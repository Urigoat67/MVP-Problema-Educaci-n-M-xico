'use client';

import { useState } from 'react';
import { Shell } from '@/components/shell';

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8000';

type Reel = {
  id: number;
  tema: string;
  titulo: string;
  status: string;
  duracion: number | null;
  error: string | null;
};

export default function ReelsPage() {
  const [tema, setTema] = useState('');
  const [nivel, setNivel] = useState('primaria');
  const [reel, setReel] = useState<Reel | null>(null);
  const [cargando, setCargando] = useState(false);

  async function crear(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!tema.trim()) return;
    setCargando(true);
    setReel(null);
    try {
      const res = await fetch(`${API}/api/v1/reels`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tema: tema.trim(), nivel }),
      });
      const nuevo: Reel = await res.json();
      setReel(nuevo);
      await esperar(nuevo.id);
    } finally {
      setCargando(false);
    }
  }

  async function esperar(id: number) {
    for (let i = 0; i < 45; i++) {
      await new Promise((r) => setTimeout(r, 2000));
      const res = await fetch(`${API}/api/v1/reels/${id}`);
      const data: Reel = await res.json();
      setReel(data);
      if (data.status === 'ready' || data.status === 'error') return;
    }
  }

  const listo = reel?.status === 'ready';

  return (
    <Shell>
      <section className="hero">
        <p className="eyebrow">Ghopper · Reels de aprendizaje</p>
        <h1>Aprende en 15 segundos</h1>
        <p>Escribe un tema y Ghopper te genera un video corto animado para entenderlo.</p>
      </section>

      <form className="card form section" onSubmit={crear}>
        <label>
          Tema
          <input
            value={tema}
            onChange={(e) => setTema(e.target.value)}
            placeholder="Ej. ¿Por qué flotan los barcos?"
            required
          />
        </label>
        <label>
          Nivel
          <select value={nivel} onChange={(e) => setNivel(e.target.value)}>
            <option value="primaria">Primaria</option>
            <option value="secundaria">Secundaria</option>
          </select>
        </label>
        <button className="action" type="submit" disabled={cargando}>
          {cargando ? 'Generando…' : 'Crear video'}
        </button>
      </form>

      {reel && (
        <section className="section">
          <div className="card">
            {reel.status === 'processing' || reel.status === 'pending' ? (
              <p role="status">Ghopper está animando tu video…</p>
            ) : reel.status === 'error' ? (
              <p role="alert">No se pudo generar: {reel.error}</p>
            ) : null}
            {listo && (
              <video
                controls
                autoPlay
                playsInline
                src={`${API}/api/v1/reels/${reel.id}/video`}
                style={{ width: '100%', maxWidth: 420, borderRadius: '1rem', display: 'block', margin: '0 auto' }}
              />
            )}
          </div>
        </section>
      )}
    </Shell>
  );
}
