'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [usuario, setUsuario] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, password }),
      });
      const data = await res.json();
      if (res.ok && data.ok) {
        router.push('/admin');
        router.refresh();
      } else {
        setError(data.error || 'Usuario o contraseña incorrectos.');
      }
    } catch {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="admin-wrap" style={{ display: 'block', minHeight: '100vh' }}>
      <div className="login-box">
        <h1>⛪ Parroquia San Marcos Evangelista<br /><small>Panel de administración</small></h1>
        {error && <div className="alerta error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-grupo">
            <label htmlFor="usuario">Usuario</label>
            <input type="text" id="usuario" required autoFocus value={usuario} onChange={(e) => setUsuario(e.target.value)} />
          </div>
          <div className="form-grupo">
            <label htmlFor="password">Contraseña</label>
            <input type="password" id="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          <button type="submit" className="btn" disabled={cargando}>{cargando ? 'Ingresando...' : 'Ingresar'}</button>
        </form>
        <p style={{ textAlign: 'center', marginTop: 14 }}><Link href="/">← Volver al sitio</Link></p>
      </div>
    </div>
  );
}
