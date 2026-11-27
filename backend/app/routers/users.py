from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import require_roles
from app.models import Rol, Usuario
from app.schemas import UserCreate, UserOut, UserUpdate
from app.security import hash_password

router = APIRouter(prefix="/users", tags=["users"])


def _es_admin(user: Usuario) -> bool:
    return user.rol == Rol.ADMIN.value


def _restringir_por_plantel(current: Usuario, target: Usuario) -> None:
    if _es_admin(current):
        return
    if target.plantel_id != current.plantel_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Fuera de tu plantel.",
        )


@router.get("", response_model=list[UserOut])
def listar_usuarios(
    db: Annotated[Session, Depends(get_db)],
    current: Annotated[Usuario, Depends(require_roles(Rol.ADMIN, Rol.DIRECTOR, Rol.DOCENTE))],
    rol: Rol | None = None,
    plantel_id: int | None = None,
) -> list[Usuario]:
    stmt = select(Usuario)
    if _es_admin(current):
        if plantel_id is not None:
            stmt = stmt.where(Usuario.plantel_id == plantel_id)
    else:
        stmt = stmt.where(Usuario.plantel_id == current.plantel_id)
    if rol is not None:
        stmt = stmt.where(Usuario.rol == rol.value)
    return list(db.scalars(stmt).all())


@router.post("", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def crear_usuario(
    payload: UserCreate,
    db: Annotated[Session, Depends(get_db)],
    current: Annotated[Usuario, Depends(require_roles(Rol.ADMIN, Rol.DIRECTOR))],
) -> Usuario:
    if not _es_admin(current):
        payload.plantel_id = current.plantel_id
        if payload.rol in (Rol.ADMIN, Rol.DIRECTOR):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No puedes crear usuarios con ese rol.",
            )

    existe = db.scalar(select(Usuario).where(Usuario.username == payload.username))
    if existe:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El nombre de usuario ya existe.",
        )

    user = Usuario(
        nombre_completo=payload.nombre_completo,
        username=payload.username,
        email=payload.email,
        password_hash=hash_password(payload.password),
        rol=payload.rol.value,
        plantel_id=payload.plantel_id,
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


@router.get("/{user_id}", response_model=UserOut)
def obtener_usuario(
    user_id: int,
    db: Annotated[Session, Depends(get_db)],
    current: Annotated[Usuario, Depends(require_roles(Rol.ADMIN, Rol.DIRECTOR, Rol.DOCENTE))],
) -> Usuario:
    user = db.get(Usuario, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")
    _restringir_por_plantel(current, user)
    return user


@router.patch("/{user_id}", response_model=UserOut)
def actualizar_usuario(
    user_id: int,
    payload: UserUpdate,
    db: Annotated[Session, Depends(get_db)],
    current: Annotated[Usuario, Depends(require_roles(Rol.ADMIN, Rol.DIRECTOR))],
) -> Usuario:
    user = db.get(Usuario, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")
    _restringir_por_plantel(current, user)

    data = payload.model_dump(exclude_unset=True)

    if "password" in data:
        user.password_hash = hash_password(data.pop("password"))

    if "rol" in data:
        nuevo_rol = data.pop("rol")
        if not _es_admin(current) and nuevo_rol in (Rol.ADMIN, Rol.DIRECTOR):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No puedes asignar ese rol.",
            )
        user.rol = nuevo_rol.value

    for key, value in data.items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)
    return user


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def desactivar_usuario(
    user_id: int,
    db: Annotated[Session, Depends(get_db)],
    current: Annotated[Usuario, Depends(require_roles(Rol.ADMIN, Rol.DIRECTOR))],
) -> None:
    user = db.get(Usuario, user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Usuario no encontrado.")
    _restringir_por_plantel(current, user)
    user.activo = False
    db.commit()
