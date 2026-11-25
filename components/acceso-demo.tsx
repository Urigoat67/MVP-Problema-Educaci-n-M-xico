'use client';

import { useState, type ReactNode } from 'react';

const demoUsers = {
  Docente: 'docente.demo',
  Alumno: 'alumno.demo',
  Dirección: 'director.demo',
};

const demoPassword = 'AulaDemo2026';

export function DemoAccess({ role, children }: { role: keyof typeof demoUsers; children: ReactNode }) {
  const [entered, setEntered] = useState(false);
  const [invalid, setInvalid] = useState(false);
  const username = demoUsers[role];

  if (entered) return <>
    <div className="demo-session">
      <button type="button" className="quiet" onClick={() => {setEntered(false); setInvalid(false);}}>Cerrar sesión de demo</button>
    </div>
    {children}
  </>;

  return <section className="demo-login" aria-labelledby="demo-login-title">
    <div className="hero">
      <p className="eyebrow">Escuela Horizonte</p>
      <h1 id="demo-login-title">{role === 'Dirección' ? 'Portal de Dirección' : role === 'Alumno' ? 'Portal del alumno' : 'Portal docente'}</h1>
      <p>Ingresa con tu usuario y contraseña.</p>
    </div>
    <form className="card form" autoComplete="off" aria-describedby="demo-access-note" onSubmit={event => {
      event.preventDefault();
      const values = new FormData(event.currentTarget);
      const matches = values.get('username') === username && values.get('password') === demoPassword;
      setInvalid(!matches);
      if (matches) setEntered(true);
    }}>
      <h2>Iniciar sesión</h2>
      <p id="demo-access-note">Acceso simulado · Los datos de demostración ya están escritos.</p>
      <label>Usuario<input name="username" defaultValue={username} autoCapitalize="none" spellCheck={false} required /></label>
      <label>Contraseña<input name="password" type="password" defaultValue={demoPassword} required /></label>
      {invalid && <p role="alert">Usa el usuario y la contraseña precargados para este portal.</p>}
      <button className="action">Iniciar sesión</button>
    </form>
  </section>;
}
