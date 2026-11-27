from typing import Annotated

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jwt import PyJWTError
from sqlalchemy.orm import Session

from app.config import settings
from app.db import get_db
from app.models import Rol, Usuario
from app.security import decode_token

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=f"{settings.api_v1_prefix}/auth/login")


def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[Session, Depends(get_db)],
) -> Usuario:
    exc = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="No se pudo validar la credencial.",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = decode_token(token)
    except PyJWTError:
        raise exc
    sub = payload.get("sub")
    if sub is None:
        raise exc
    try:
        user_id = int(sub)
    except (TypeError, ValueError):
        raise exc
    user = db.get(Usuario, user_id)
    if user is None:
        raise exc
    if not user.activo:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Usuario desactivado.",
        )
    return user


def require_roles(*roles: Rol):
    allowed = {r.value for r in roles}

    def checker(current: Annotated[Usuario, Depends(get_current_user)]) -> Usuario:
        if current.rol not in allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="No tienes permisos para esta acción.",
            )
        return current

    return checker
