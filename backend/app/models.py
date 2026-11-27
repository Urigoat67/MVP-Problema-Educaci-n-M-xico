from __future__ import annotations

from datetime import datetime
from enum import Enum

from sqlalchemy import Boolean, DateTime, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db import Base


class Rol(str, Enum):
    ADMIN = "admin"
    DIRECTOR = "director"
    DOCENTE = "docente"
    ALUMNO = "alumno"


class Plantel(Base):
    __tablename__ = "planteles"

    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(String(200))
    clave: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    usuarios: Mapped[list[Usuario]] = relationship(back_populates="plantel")
    grupos: Mapped[list[Grupo]] = relationship(back_populates="plantel")


class Usuario(Base):
    __tablename__ = "usuarios"

    id: Mapped[int] = mapped_column(primary_key=True)
    plantel_id: Mapped[int | None] = mapped_column(ForeignKey("planteles.id"), index=True)
    nombre_completo: Mapped[str] = mapped_column(String(200))
    username: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    email: Mapped[str | None] = mapped_column(String(200), unique=True)
    password_hash: Mapped[str] = mapped_column(String(200))
    rol: Mapped[str] = mapped_column(String(20), default=Rol.ALUMNO.value)
    activo: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    plantel: Mapped[Plantel | None] = relationship(back_populates="usuarios")
    grupos_docente: Mapped[list[Grupo]] = relationship(
        back_populates="docente", foreign_keys="Grupo.docente_id"
    )
    grupos_alumno: Mapped[list[Grupo]] = relationship(
        secondary="alumno_grupo", back_populates="alumnos"
    )


class Grupo(Base):
    __tablename__ = "grupos"

    id: Mapped[int] = mapped_column(primary_key=True)
    plantel_id: Mapped[int] = mapped_column(ForeignKey("planteles.id"), index=True)
    docente_id: Mapped[int | None] = mapped_column(ForeignKey("usuarios.id"), index=True)
    nombre: Mapped[str] = mapped_column(String(100))
    grado: Mapped[str | None] = mapped_column(String(20))
    activo: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
    updated_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    plantel: Mapped[Plantel] = relationship(back_populates="grupos")
    docente: Mapped[Usuario | None] = relationship(
        back_populates="grupos_docente", foreign_keys="Grupo.docente_id"
    )
    alumnos: Mapped[list[Usuario]] = relationship(
        secondary="alumno_grupo", back_populates="grupos_alumno"
    )


class AlumnoGrupo(Base):
    __tablename__ = "alumno_grupo"
    __table_args__ = (
        UniqueConstraint("alumno_id", "grupo_id", name="uq_alumno_grupo"),
    )

    id: Mapped[int] = mapped_column(primary_key=True)
    alumno_id: Mapped[int] = mapped_column(
        ForeignKey("usuarios.id", ondelete="CASCADE"), index=True
    )
    grupo_id: Mapped[int] = mapped_column(
        ForeignKey("grupos.id", ondelete="CASCADE"), index=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), server_default=func.now()
    )
