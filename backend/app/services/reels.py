from __future__ import annotations

import shutil
import subprocess
import tempfile
from pathlib import Path

from pydub import AudioSegment

from app.config import settings
from app.db import SessionLocal
from app.models import Reel
from app.services.guion import generar_guion
from app.services.render import render_frames
from app.services.tts import sintetizar

_GAP = 0.35
_COLA = 0.9


def _ffmpeg() -> str:
    exe = shutil.which("ffmpeg")
    if not exe:
        raise RuntimeError("ffmpeg no está disponible.")
    return exe


def _codificar(
    guion,
    escenas_dur: list[float],
    audio_path: Path,
    salida: Path,
    cola: float,
    fps: int,
    ancho: int,
    alto: int,
) -> None:
    cmd = [
        _ffmpeg(),
        "-y",
        "-f", "rawvideo",
        "-pix_fmt", "rgb24",
        "-s", f"{ancho}x{alto}",
        "-r", str(fps),
        "-i", "-",
        "-i", str(audio_path),
        "-c:v", "libx264",
        "-pix_fmt", "yuv420p",
        "-preset", "veryfast",
        "-crf", "23",
        "-c:a", "aac",
        "-b:a", "128k",
        "-shortest",
        "-movflags", "+faststart",
        str(salida),
    ]
    proc = subprocess.Popen(
        cmd, stdin=subprocess.PIPE, stdout=subprocess.DEVNULL, stderr=subprocess.PIPE
    )
    assert proc.stdin is not None
    for frame in render_frames(guion, escenas_dur, ancho, alto, cola):
        proc.stdin.write(frame)
    proc.stdin.close()
    proc.wait(timeout=600)
    if proc.returncode != 0:
        raise RuntimeError((proc.stderr.read().decode() or "")[-600:])


def generar_reel(reel_id: int) -> None:
    db = SessionLocal()
    try:
        reel = db.get(Reel, reel_id)
        if not reel:
            return
        reel.status = "processing"
        db.commit()

        try:
            guion = generar_guion(reel.tema, reel.nivel)

            with tempfile.TemporaryDirectory() as td:
                tmp = Path(td)

                duraciones: list[float] = []
                for i, escena in enumerate(guion.escenas):
                    mp3 = tmp / f"escena_{i}.mp3"
                    sintetizar(escena.narracion, str(mp3))
                    duraciones.append(AudioSegment.from_mp3(mp3).duration_seconds)

                pista = AudioSegment.silent(duration=0)
                for i in range(len(guion.escenas)):
                    pista += AudioSegment.from_mp3(tmp / f"escena_{i}.mp3")
                    pista += AudioSegment.silent(duration=int(_GAP * 1000))
                pista += AudioSegment.silent(duration=int(_COLA * 1000))
                audio_path = tmp / "audio.mp3"
                pista.export(audio_path, format="mp3")

                escenas_render = [d + _GAP for d in duraciones]
                total = sum(escenas_render) + _COLA

                media_dir = Path(settings.media_dir) / "reels"
                media_dir.mkdir(parents=True, exist_ok=True)
                salida = media_dir / f"{reel_id}.mp4"

                _codificar(
                    guion,
                    escenas_render,
                    audio_path,
                    salida,
                    _COLA,
                    settings.reel_fps,
                    settings.reel_width,
                    settings.reel_height,
                )

                reel.titulo = guion.titulo
                reel.file_path = str(salida)
                reel.duracion = round(total, 2)
                reel.status = "ready"
                reel.error = None
        except Exception as exc:  # noqa: BLE001
            reel.status = "error"
            reel.error = str(exc)[:500]

        db.commit()
    finally:
        db.close()
