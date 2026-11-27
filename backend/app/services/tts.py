import asyncio

import edge_tts

from app.config import settings


def sintetizar(texto: str, salida: str, voice: str | None = None) -> None:
    voz = voice or settings.edge_tts_voice

    async def _run() -> None:
        comm = edge_tts.Communicate(texto, voz)
        await comm.save(salida)

    asyncio.run(_run())
