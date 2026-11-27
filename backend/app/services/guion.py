from __future__ import annotations

import json
from dataclasses import dataclass, field

import httpx

from app.config import settings


@dataclass
class Escena:
    texto: str
    narracion: str


@dataclass
class Guion:
    titulo: str
    escenas: list[Escena] = field(default_factory=list)
    codigo: str | None = None


_EJEMPLO = '''
def render_frame(draw, t, escena_texto, escena_idx, total_escenas):
    W, H = 720, 1280
    draw.rectangle([0, 0, W, H], fill=(30, 27, 75))
    for i in range(6):
        x = (t * (20 + i * 6) + i * 130) % (W + 120) - 60
        y = 120 + (i * 197) % (H - 320)
        draw.ellipse([x - 42, y - 42, x + 42, y + 42], fill=(59, 130, 246))
    draw.rounded_rectangle([70, 470, W - 70, 830], radius=44, fill=(255, 255, 255))
    font = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 64)
    for i, linea in enumerate(textwrap.wrap(escena_texto, width=16)):
        draw.text((W / 2, 540 + i * 86), linea, font=font, fill=(30, 27, 75), anchor="ma")
    if escena_idx == 0:
        titulo = ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", 92)
        draw.text((W / 2, 320), "¿Sabías que...?", font=titulo, fill=(253, 224, 71), anchor="mm")
    for i in range(total_escenas):
        cx = W / 2 + (i - (total_escenas - 1) / 2) * 40
        draw.ellipse([cx - 10, H - 60, cx + 10, H - 40], fill=(255, 255, 255))
'''

_SYSTEM = (
    "Eres un agente que produce videos cortos de 'datos curiosos' de 15 segundos para "
    "niños en México. Debes devolver JSON con tres campos: "
    "'titulo' (string), 'escenas' (array de exactamente 3 objetos con 'texto' y 'narracion', "
    "texto máximo 6 palabras, narracion máximo 14 palabras) y 'codigo' (string con el "
    "código Python que dibuja cada frame del video).\n\n"
    "REGLAS DEL CÓDIGO (muy importante):\n"
    "- Define SOLO una función: def render_frame(draw, t, escena_texto, escena_idx, total_escenas):\n"
    "- NO escribas 'import' ni 'from'. Ya están disponibles: draw (ImageDraw), ImageFont, math y textwrap.\n"
    "- El lienzo es de 720x1280. Dibuja SIEMPRE el fondo completo primero con "
    "draw.rectangle([0, 0, 720, 1280], fill=color).\n"
    "- 't' es el tiempo en segundos (aprox 0 a 15). Anima con math.sin(t) para movimiento.\n"
    "- Dibuja el texto de escena_texto con textwrap.wrap(escena_texto, width=16) y "
    "draw.text(..., anchor=\"ma\").\n"
    "- Fuentes: ImageFont.truetype(\"/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf\", size).\n"
    "- Usa SOLO: draw.ellipse, draw.rectangle, draw.rounded_rectangle, draw.line, "
    "draw.polygon, draw.arc, draw.text, draw.textlength.\n"
    "- Prohibido: archivos, red, subprocess, import de módulos, eval, exec, clases.\n"
    "- Código determinista, sin bucles infinitos y rápido. Usa colores vivos y texto legible "
    "con buen contraste.\n\n"
    "EJEMPLO DE CÓDIGO VÁLIDO:\n"
    f"{_EJEMPLO}\n\n"
    "Responde únicamente con el objeto JSON, sin texto adicional."
)


def _guion_por_defecto(tema: str) -> Guion:
    t = tema.strip()
    return Guion(
        titulo=t,
        escenas=[
            Escena("¿Sabías que...?", f"¿Sabías que hay un dato curioso sobre {t}?"),
            Escena("Es sorprendente", f"Los científicos siguen descubriendo cosas nuevas sobre {t}."),
            Escena("¡Compártelo!", "Cuéntaselo a alguien y sigue explorando."),
        ],
        codigo=None,
    )


def _guion_con_ia(tema: str, nivel: str) -> Guion:
    url = f"{settings.llm_base_url.rstrip('/')}/chat/completions"
    headers = {
        "Authorization": f"Bearer {settings.llm_api_key}",
        "Content-Type": "application/json",
    }
    body = {
        "model": settings.llm_model,
        "messages": [
            {"role": "system", "content": _SYSTEM},
            {
                "role": "user",
                "content": json.dumps(
                    {"tema": tema, "nivel": nivel}, ensure_ascii=False
                ),
            },
        ],
        "response_format": {"type": "json_object"},
        "max_tokens": 2200,
        "temperature": 0.7,
    }
    resp = httpx.post(url, headers=headers, json=body, timeout=60)
    resp.raise_for_status()
    data = resp.json()
    raw = data["choices"][0]["message"]["content"]
    parsed = json.loads(raw)
    escenas = [
        Escena(texto=e["texto"], narracion=e["narracion"]) for e in parsed["escenas"]
    ]
    if not escenas:
        raise ValueError("Plan sin escenas.")
    return Guion(titulo=parsed["titulo"], escenas=escenas, codigo=parsed.get("codigo"))


def generar_guion(tema: str, nivel: str) -> Guion:
    if settings.llm_api_key:
        try:
            return _guion_con_ia(tema, nivel)
        except Exception:
            return _guion_por_defecto(tema)
    return _guion_por_defecto(tema)
