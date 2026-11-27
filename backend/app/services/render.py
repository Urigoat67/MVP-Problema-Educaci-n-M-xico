from __future__ import annotations

import math
import textwrap
from functools import lru_cache
from typing import Callable, Iterator

from PIL import Image, ImageDraw, ImageFont

from app.services.guion import Guion

FONT_BOLD = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
FONT_REGULAR = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"


@lru_cache(maxsize=None)
def _fuente(size: int, bold: bool = True) -> ImageFont.FreeTypeFont:
    path = FONT_BOLD if bold else FONT_REGULAR
    return ImageFont.truetype(path, size)


# --------------------------------------------------------------------------
# Plantilla de respaldo (si no hay IA o el código falla)
# --------------------------------------------------------------------------
BG_TOP = (76, 29, 149)
BG_BOTTOM = (30, 64, 175)
ACCENT = (253, 224, 71)
WHITE = (255, 255, 255)
INK = (30, 27, 75)


def _gradiente(ancho: int, alto: int) -> Image.Image:
    img = Image.new("RGB", (ancho, alto))
    draw = ImageDraw.Draw(img)
    for y in range(alto):
        t = y / max(1, alto - 1)
        r = int(BG_TOP[0] + (BG_BOTTOM[0] - BG_TOP[0]) * t)
        g = int(BG_TOP[1] + (BG_BOTTOM[1] - BG_TOP[1]) * t)
        b = int(BG_TOP[2] + (BG_BOTTOM[2] - BG_TOP[2]) * t)
        draw.line([(0, y), (ancho, y)], fill=(r, g, b))
    return img


def _decoraciones(draw: ImageDraw.ImageDraw, t: float, ancho: int, alto: int) -> None:
    for i in range(6):
        r = 40 + (i * 31) % 90
        x = (t * (18 + i * 7) + i * 150) % (ancho + 2 * r) - r
        y = 140 + (i * 173) % (alto - 320)
        draw.ellipse((x - r, y - r, x + r, y + r), fill=(255, 255, 255, 26))
    for i in range(4):
        x = (t * (30 + i * 9) + i * 210) % (ancho + 40) - 20
        y = 200 + (i * 251) % (alto - 400)
        draw.rectangle((x - 12, y - 12, x + 12, y + 12), fill=(253, 224, 71, 70))


def _badge(draw: ImageDraw.ImageDraw, texto: str, ancho: int, y: int) -> None:
    fuente = _fuente(40, bold=True)
    w = draw.textlength(texto, font=fuente)
    x0 = ancho / 2 - w / 2 - 28
    draw.rounded_rectangle((x0, y, x0 + w + 56, y + 78), radius=39, fill=ACCENT)
    draw.text((ancho / 2, y + 39), texto, font=fuente, fill=INK, anchor="mm")


def _dibujar_titulo(draw: ImageDraw.ImageDraw, ancho: int) -> None:
    fuente = _fuente(96, bold=True)
    draw.text((ancho / 2, 300), "¿Sabías", font=fuente, fill=WHITE, anchor="mm")
    draw.text((ancho / 2, 410), "que...?", font=fuente, fill=ACCENT, anchor="mm")


def _dibujar_caja(draw: ImageDraw.ImageDraw, texto: str, ancho: int, alto: int) -> None:
    lineas = textwrap.wrap(texto, width=16)
    n = len(lineas)
    fuente = _fuente(64, bold=True)
    line_h = 86
    caja_h = 84 + n * line_h
    y0 = int(alto / 2 - caja_h / 2)
    x0 = 70
    x1 = ancho - 70
    draw.rounded_rectangle((x0, y0, x1, y0 + caja_h), radius=44, fill=WHITE)
    for i, linea in enumerate(lineas):
        draw.text((ancho / 2, y0 + 62 + i * line_h), linea, font=fuente, fill=INK, anchor="ma")


def _limites(escenas_dur: list[float]) -> list[float]:
    limites = []
    acc = 0.0
    for d in escenas_dur:
        acc += d
        limites.append(acc)
    return limites


def _marco_plantilla(
    guion: Guion, escenas_dur: list[float], ancho: int, alto: int, cola: float
) -> Iterator[bytes]:
    fondo = _gradiente(ancho, alto)
    fps = 24
    total_frames = int(round((sum(escenas_dur) + cola) * fps))
    limites = _limites(escenas_dur)
    for frame in range(total_frames):
        t = frame / fps
        idx = len(guion.escenas) - 1
        for i, limite in enumerate(limites):
            if t < limite:
                idx = i
                break
        img = fondo.copy()
        draw = ImageDraw.Draw(img)
        _decoraciones(draw, t, ancho, alto)
        _badge(draw, "DATOS CURIOSOS", ancho, 120)
        if idx == 0:
            _dibujar_titulo(draw, ancho)
        _dibujar_caja(draw, guion.escenas[idx].texto, ancho, alto)
        wm = _fuente(30, bold=True)
        draw.text((ancho / 2, alto - 120), "Aula de Retos", font=wm, fill=(255, 255, 255, 170), anchor="mm")
        for i in range(len(guion.escenas)):
            cx = ancho / 2 + (i - (len(guion.escenas) - 1) / 2) * 40
            color = WHITE if i <= idx else (255, 255, 255, 90)
            draw.ellipse((cx - 10, alto - 60, cx + 10, alto - 40), fill=color)
        yield img.tobytes()


# --------------------------------------------------------------------------
# Ejecución del código generado por la IA (dibuja TODO el frame, fondo incluido)
# --------------------------------------------------------------------------
_FORBIDDEN = (
    "import",
    "from ",
    "while ",
    "__",
    "open(",
    "eval(",
    "exec(",
    "compile(",
    "globals(",
    "locals(",
    "getattr(",
    "setattr(",
    "input(",
    "subprocess",
    "socket",
    "os.",
    "sys.",
    "base64",
    "pickle",
    "requests",
    "urllib",
    "http",
    "shutil",
    "pathlib",
    "class ",
)


def _validar_codigo(codigo: str) -> bool:
    if not codigo:
        return False
    c = codigo.lower()
    return not any(t in c for t in _FORBIDDEN)


def _compilar_codigo(codigo: str) -> Callable | None:
    if not _validar_codigo(codigo):
        return None
    ns: dict = {
        "math": math,
        "textwrap": textwrap,
        "ImageDraw": ImageDraw,
        "ImageFont": ImageFont,
    }
    ns["__builtins__"] = {
        "range": range,
        "len": len,
        "min": min,
        "max": max,
        "abs": abs,
        "round": round,
        "int": int,
        "float": float,
        "str": str,
        "bool": bool,
        "list": list,
        "tuple": tuple,
        "dict": dict,
        "enumerate": enumerate,
        "zip": zip,
        "sum": sum,
        "sorted": sorted,
        "pow": pow,
        "divmod": divmod,
    }
    try:
        exec(codigo, ns)
    except Exception:
        return None
    fn = ns.get("render_frame")
    if not callable(fn):
        return None
    # Prueba de humo: un frame de prueba debe dibujar sin error.
    try:
        img = Image.new("RGB", (720, 1280))
        fn(ImageDraw.Draw(img), 1.0, "Prueba", 0, 3)
        if img.getbbox() is None:
            return None
    except Exception:
        return None
    return fn


def _marco_ia(
    fn: Callable, guion: Guion, escenas_dur: list[float], ancho: int, alto: int, cola: float
) -> Iterator[bytes]:
    fps = 24
    total_frames = int(round((sum(escenas_dur) + cola) * fps))
    limites = _limites(escenas_dur)
    total = len(guion.escenas)
    for frame in range(total_frames):
        t = frame / fps
        idx = total - 1
        for i, limite in enumerate(limites):
            if t < limite:
                idx = i
                break
        img = Image.new("RGB", (ancho, alto))
        fn(ImageDraw.Draw(img), t, guion.escenas[idx].texto, idx, total)
        yield img.tobytes()


def render_frames(
    guion: Guion, escenas_dur: list[float], ancho: int, alto: int, cola: float = 0.0
) -> Iterator[bytes]:
    fn = _compilar_codigo(guion.codigo) if guion.codigo else None
    if fn is not None:
        return _marco_ia(fn, guion, escenas_dur, ancho, alto, cola)
    return _marco_plantilla(guion, escenas_dur, ancho, alto, cola)
