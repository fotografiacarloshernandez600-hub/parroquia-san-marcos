import { changePasswordAction } from '@/lib/actions/settings';

export const metadata = { title: 'Cambiar contraseña | Panel admin' };

export default async function PasswordPage({ searchParams }) {
  const params = await searchParams;

  return (
    <>
      <div className="admin-topbar"><h1>Cambiar contraseña</h1></div>

      {params?.ok && <div className="alerta exito">Contraseña actualizada correctamente.</div>}
      {params?.error && <div className="alerta error">{params.error}</div>}

      <div className="card" style={{ maxWidth: 420 }}>
        <form action={changePasswordAction}>
          <div className="form-grupo">
            <label>Contraseña actual</label>
            <input type="password" name="actual" required />
          </div>
          <div className="form-grupo">
            <label>Nueva contraseña</label>
            <input type="password" name="nueva" required minLength={6} />
          </div>
          <div className="form-grupo">
            <label>Confirmar nueva contraseña</label>
            <input type="password" name="confirmar" required minLength={6} />
          </div>
          <button type="submit" className="btn">Actualizar contraseña</button>
        </form>
      </div>
    </>
  );
}
