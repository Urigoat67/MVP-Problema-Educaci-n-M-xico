from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.deps import require_roles
from app.models import Plantel, Rol, Usuario
from app.schemas import PlantelCreate, PlantelOut, PlantelUpdate

router = APIRouter(prefix="/planteles", tags=["planteles"])


@router.get("", response_model=list[PlantelOut])
def listar_planteles(
    db: Annotated[Session, Depends(get_db)],
    current: Annotated[Usuario, Depends(require_roles(Rol.ADMIN, Rol.DIRECTOR))],
) -> list[Plantel]:
    if current.rol == Rol.ADMIN.value:
        return list(db.scalars(select(Plantel)).all())
    plantel = db.get(Plantel, current.plantel_id)
    return [plantel] if plantel else []


@router.post("", response_model=PlantelOut, status_code=status.HTTP_201_CREATED)
def crear_plantel(
    payload: PlantelCreate,
    db: Annotated[Session, Depends(get_db)],
    current: Annotated[Usuario, Depends(require_roles(Rol.ADMIN))],
) -> Plantel:
    existe = db.scalar(select(Plantel).where(Plantel.clave == payload.clave))
    if existe:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Ya existe un plantel con esa clave.",
        )
    plantel = Plantel(nombre=payload.nombre, clave=payload.clave)
    db.add(plantel)
    db.commit()
    db.refresh(plantel)
    return plantel


@router.get("/{plantel_id}", response_model=PlantelOut)
def obtener_plantel(
    plantel_id: int,
    db: Annotated[Session, Depends(get_db)],
    current: Annotated[Usuario, Depends(require_roles(Rol.ADMIN, Rol.DIRECTOR))],
) -> Plantel:
    plantel = db.get(Plantel, plantel_id)
    if not plantel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plantel no encontrado.")
    if current.rol != Rol.ADMIN.value and plantel.id != current.plantel_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Fuera de tu plantel.")
    return plantel


@router.patch("/{plantel_id}", response_model=PlantelOut)
def actualizar_plantel(
    plantel_id: int,
    payload: PlantelUpdate,
    db: Annotated[Session, Depends(get_db)],
    current: Annotated[Usuario, Depends(require_roles(Rol.ADMIN))],
) -> Plantel:
    plantel = db.get(Plantel, plantel_id)
    if not plantel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Plantel no encontrado.")
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(plantel, key, value)
    db.commit()
    db.refresh(plantel)
    return plantel
