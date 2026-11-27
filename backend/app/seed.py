from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import settings
from app.db import SessionLocal
from app.models import AlumnoGrupo, Grupo, Plantel, Rol, Usuario
from app.security import hash_password

DEMO_PASSWORD = "AulaDemo2026"


def _get_or_create_plantel(db: Session) -> Plantel:
    plantel = db.scalar(select(Plantel).where(Plantel.clave == "DEMO001"))
    if plantel:
        return plantel
    plantel = Plantel(nombre="Escuela Horizonte", clave="DEMO001")
    db.add(plantel)
    db.flush()
    return plantel


def _get_or_create_user(
    db: Session,
    plantel: Plantel,
    username: str,
    nombre: str,
    rol: Rol,
    password: str,
) -> Usuario:
    user = db.scalar(select(Usuario).where(Usuario.username == username))
    if user:
        return user
    user = Usuario(
        plantel_id=plantel.id,
        nombre_completo=nombre,
        username=username,
        rol=rol.value,
        password_hash=hash_password(password),
    )
    db.add(user)
    db.flush()
    return user


def seed() -> None:
    db = SessionLocal()
    try:
        admin = db.scalar(
            select(Usuario).where(Usuario.username == settings.seed_admin_username)
        )
        if not admin:
            db.add(
                Usuario(
                    nombre_completo="Administrador del sistema",
                    username=settings.seed_admin_username,
                    rol=Rol.ADMIN.value,
                    password_hash=hash_password(settings.seed_admin_password),
                )
            )

        plantel = _get_or_create_plantel(db)
        _get_or_create_user(
            db, plantel, "director.demo", "Dirección de primaria", Rol.DIRECTOR, DEMO_PASSWORD
        )
        docente = _get_or_create_user(
            db, plantel, "docente.demo", "Docente de primaria", Rol.DOCENTE, DEMO_PASSWORD
        )
        alumno = _get_or_create_user(
            db, plantel, "alumno.demo", "Alumno de primaria", Rol.ALUMNO, DEMO_PASSWORD
        )

        grupo = db.scalar(select(Grupo).where(Grupo.nombre == "5° A"))
        if not grupo:
            grupo = Grupo(plantel_id=plantel.id, docente_id=docente.id, nombre="5° A", grado="5°")
            db.add(grupo)
            db.flush()

        vinculado = db.scalar(
            select(AlumnoGrupo).where(
                AlumnoGrupo.alumno_id == alumno.id,
                AlumnoGrupo.grupo_id == grupo.id,
            )
        )
        if not vinculado:
            db.add(AlumnoGrupo(alumno_id=alumno.id, grupo_id=grupo.id))

        db.commit()
    finally:
        db.close()
