from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr, Field

from app.models import Rol


class ORMModel(BaseModel):
    model_config = ConfigDict(from_attributes=True)


# Auth ----------------------------------------------------------------------
class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"


# Plantel -------------------------------------------------------------------
class PlantelBase(BaseModel):
    nombre: str = Field(min_length=1, max_length=200)
    clave: str = Field(min_length=1, max_length=50)


class PlantelCreate(PlantelBase):
    pass


class PlantelUpdate(BaseModel):
    nombre: str | None = Field(default=None, min_length=1, max_length=200)
    clave: str | None = Field(default=None, min_length=1, max_length=50)
    activo: bool | None = None


class PlantelOut(ORMModel, PlantelBase):
    id: int
    activo: bool
    created_at: datetime


# Usuario -------------------------------------------------------------------
class UserBase(BaseModel):
    nombre_completo: str = Field(min_length=1, max_length=200)
    username: str = Field(min_length=3, max_length=50, pattern=r"^[a-zA-Z0-9._-]+$")
    email: EmailStr | None = None
    rol: Rol


class UserCreate(UserBase):
    password: str = Field(min_length=8, max_length=128)
    plantel_id: int | None = None


class UserUpdate(BaseModel):
    nombre_completo: str | None = Field(default=None, min_length=1, max_length=200)
    email: EmailStr | None = None
    password: str | None = Field(default=None, min_length=8, max_length=128)
    rol: Rol | None = None
    activo: bool | None = None


class UserOut(ORMModel, UserBase):
    id: int
    plantel_id: int | None
    activo: bool
    created_at: datetime


# Grupo ---------------------------------------------------------------------
class GrupoBase(BaseModel):
    nombre: str = Field(min_length=1, max_length=100)
    grado: str | None = Field(default=None, max_length=20)


class GrupoCreate(GrupoBase):
    plantel_id: int
    docente_id: int | None = None


class GrupoUpdate(BaseModel):
    nombre: str | None = Field(default=None, min_length=1, max_length=100)
    grado: str | None = Field(default=None, max_length=20)
    docente_id: int | None = None
    activo: bool | None = None


class GrupoOut(ORMModel, GrupoBase):
    id: int
    plantel_id: int
    docente_id: int | None
    activo: bool
    created_at: datetime


# Reel ----------------------------------------------------------------------
class ReelCreate(BaseModel):
    tema: str = Field(min_length=2, max_length=200)
    nivel: str = Field(default="primaria", pattern=r"^(primaria|secundaria)$")


class ReelOut(ORMModel):
    id: int
    tema: str
    nivel: str
    titulo: str
    status: str
    duracion: float | None
    error: str | None
    created_at: datetime

