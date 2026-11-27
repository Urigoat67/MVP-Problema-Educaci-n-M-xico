from pathlib import Path
from typing import Annotated

from fastapi import APIRouter, BackgroundTasks, Depends, HTTPException, status
from fastapi.responses import FileResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.db import get_db
from app.models import Reel
from app.schemas import ReelCreate, ReelOut
from app.services.reels import generar_reel

router = APIRouter(prefix="/reels", tags=["reels"])


@router.post("", response_model=ReelOut, status_code=status.HTTP_201_CREATED)
def crear_reel(
    payload: ReelCreate,
    background: BackgroundTasks,
    db: Annotated[Session, Depends(get_db)],
) -> Reel:
    reel = Reel(tema=payload.tema, nivel=payload.nivel, status="pending")
    db.add(reel)
    db.commit()
    db.refresh(reel)
    background.add_task(generar_reel, reel.id)
    return reel


@router.get("", response_model=list[ReelOut])
def listar_reels(db: Annotated[Session, Depends(get_db)]) -> list[Reel]:
    return list(db.scalars(select(Reel).order_by(Reel.id.desc())).all())


@router.get("/{reel_id}/video")
def ver_video(reel_id: int, db: Annotated[Session, Depends(get_db)]) -> FileResponse:
    reel = db.get(Reel, reel_id)
    if not reel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reel no encontrado.")
    if reel.status != "ready" or not reel.file_path:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="El video aún no está listo.",
        )
    path = Path(reel.file_path)
    if not path.exists():
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Archivo no encontrado.")
    return FileResponse(path, media_type="video/mp4", filename=f"reel-{reel.id}.mp4")


@router.get("/{reel_id}", response_model=ReelOut)
def obtener_reel(reel_id: int, db: Annotated[Session, Depends(get_db)]) -> Reel:
    reel = db.get(Reel, reel_id)
    if not reel:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reel no encontrado.")
    return reel
