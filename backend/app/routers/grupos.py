from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import require_roles
from app.models import AlumnoGrupo, Grupo, Plantel, Rol, Usuario
from app.schemas import GrupoCreate, GrupoOut, GrupoUpdate

router = APIRouter(prefix="/grupos", tags=["grupos"])


def _es_admin(user: Usuario) -> bool:
    return user.rol == Rol.ADMIN.value


@router.get("", response_model=list[GrupoOut])
def listar_grupos(
    db: Annotated[Session, Depends(get_db)],
    current: Annotated[Usuario, Depends(require_roles(Rol.ADMIN, Rol.DIRECTOR, Rol.DOCENTE))],
    plantel_id: int | None = None,
) -> list[Grupo]:
    stmt = select(Grupo)
    if _es_admin(current):
        if plantel_id is not None:
            stmt = stmt.where(Grupo.plantel_id == plantel_id)
    else:
        stmt = stmt.where(Grupo.plantel_id == current.plantel_id)
    return list(db.scalars(stmt).all())


@router.post("", response_model=GrupoOut, status_code=status.HTTP_201_CREATED)
def crear_grupo(
    payload: GrupoCreate,
    db: Annotated[Session, Depends(get_db)],
    current: Annotated[Usuario, Depends(require_roles(Rol.ADMIN, Rol.DIRECTOR, Rol.DOCENTE))],
) -> Grupo:
    if not _es_admin(current):
        payload.plantel_id = current.plantel_id

    plantel = db.get(Plantel, payload.plantel_id)
    if not plantel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plantel no encontrado.")

    if payload.docente_id is not None:
        docente = db.get(Usuario, payload.docente_id)
        if not docente or docente.rol != Rol.DOCENTE.value:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="El docente_id debe corresponder a un docente.",
            )

    grupo = Grupo(
        plantel_id=payload.plantel_id,
        docente_id=payload.docente_id,
        nombre=payload.nombre,
        grado=payload.grado,
    )
    db.add(grupo)
    db.commit()
    db.refresh(grupo)
    return grupo


@router.get("/{grupo_id}", response_model=GrupoOut)
def obtener_grupo(
    grupo_id: int,
    db: Annotated[Session, Depends(get_db)],
    current: Annotated[Usuario, Depends(require_roles(Rol.ADMIN, Rol.DIRECTOR, Rol.DOCENTE))],
) -> Grupo:
    grupo = db.get(Grupo, grupo_id)
    if not grupo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Grupo no encontrado.")
    if not _es_admin(current) and grupo.plantel_id != current.plantel_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Fuera de tu plantel.")
    return grupo


@router.patch("/{grupo_id}", response_model=GrupoOut)
def actualizar_grupo(
    grupo_id: int,
    payload: GrupoUpdate,
    db: Annotated[Session, Depends(get_db)],
    current: Annotated[Usuario, Depends(require_roles(Rol.ADMIN, Rol.DIRECTOR, Rol.DOCENTE))],
) -> Grupo:
    grupo = db.get(Grupo, grupo_id)
    if not grupo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Grupo no encontrado.")
    if not _es_admin(current) and grupo.plantel_id != current.plantel_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Fuera de tu plantel.")

    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(grupo, key, value)
    db.commit()
    db.refresh(grupo)
    return grupo


@router.post("/{grupo_id}/alumnos/{alumno_id}", status_code=status.HTTP_201_CREATED)
def agregar_alumno(
    grupo_id: int,
    alumno_id: int,
    db: Annotated[Session, Depends(get_db)],
    current: Annotated[Usuario, Depends(require_roles(Rol.ADMIN, Rol.DIRECTOR, Rol.DOCENTE))],
) -> dict:
    grupo = db.get(Grupo, grupo_id)
    if not grupo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Grupo no encontrado.")
    if not _es_admin(current) and grupo.plantel_id != current.plantel_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Fuera de tu plantel.")

    alumno = db.get(Usuario, alumno_id)
    if not alumno or alumno.rol != Rol.ALUMNO.value:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="El alumno_id debe corresponder a un alumno.",
        )

    vinculado = db.scalar(
        select(AlumnoGrupo).where(
            AlumnoGrupo.alumno_id == alumno_id,
            AlumnoGrupo.grupo_id == grupo_id,
        )
    )
    if vinculado:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El alumno ya está en el grupo.",
        )

    db.add(AlumnoGrupo(alumno_id=alumno_id, grupo_id=grupo_id))
    db.commit()
    return {"detail": "Alumno agregado al grupo."}


@router.delete("/{grupo_id}/alumnos/{alumno_id}", status_code=status.HTTP_204_NO_CONTENT)
def quitar_alumno(
    grupo_id: int,
    alumno_id: int,
    db: Annotated[Session, Depends(get_db)],
    current: Annotated[Usuario, Depends(require_roles(Rol.ADMIN, Rol.DIRECTOR, Rol.DOCENTE))],
) -> None:
    grupo = db.get(Grupo, grupo_id)
    if not grupo:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Grupo no encontrado.")
    if not _es_admin(current) and grupo.plantel_id != current.plantel_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Fuera de tu plantel.")

    vinculado = db.scalar(
        select(AlumnoGrupo).where(
            AlumnoGrupo.alumno_id == alumno_id,
            AlumnoGrupo.grupo_id == grupo_id,
        )
    )
    if vinculado:
        db.delete(vinculado)
        db.commit()
