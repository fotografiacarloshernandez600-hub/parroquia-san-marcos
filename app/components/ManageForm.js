import Link from 'next/link';
import { publicUrl } from '@/lib/supabaseAdmin';
import { saveRecordAction } from '@/lib/actions/manage';

export default function ManageForm({ table, conf, registro, error }) {
  const id = registro?.id || 0;
  const action = saveRecordAction.bind(null, table);

  return (
    <div className="card">
      {conf.ayuda && <p><em>{conf.ayuda}</em></p>}
      {error && <div className="alerta error">{error}</div>}

      <form action={action}>
        <input type="hidden" name="id" value={id} />
        {Object.entries(conf.campos).map(([name, def]) => (
          <div className="form-grupo" key={name}>
            <label htmlFor={`f_${name}`}>{def.label}{def.requerido ? ' *' : ''}</label>

            {def.tipo === 'textarea' && (
              <textarea name={name} id={`f_${name}`} rows={def.filas || 4} defaultValue={registro?.[name] ?? ''} />
            )}

            {def.tipo === 'select' && (
              <select name={name} id={`f_${name}`} defaultValue={registro?.[name] ?? ''}>
                <option value="">-- Selecciona --</option>
                {def.opciones.map((op) => <option key={op} value={op}>{op}</option>)}
              </select>
            )}

            {def.tipo === 'image' && (
              <>
                {registro?.[name] && (
                  <div style={{ marginBottom: 8 }}>
                    <img src={publicUrl(registro[name])} className="img-mini" alt="" />
                    <label style={{ display: 'inline', fontWeight: 'normal', marginLeft: 8 }}>
                      <input type="checkbox" name={`quitar_${name}`} value="1" style={{ width: 'auto' }} /> Quitar imagen actual
                    </label>
                  </div>
                )}
                <input type="file" name={name} id={`f_${name}`} accept=".jpg,.jpeg,.png,.webp" />
              </>
            )}

            {def.tipo === 'date' && (
              <input type="date" name={name} id={`f_${name}`} defaultValue={registro?.[name] ?? ''} />
            )}

            {def.tipo === 'number' && (
              <input type="number" name={name} id={`f_${name}`} defaultValue={registro?.[name] ?? 0} />
            )}

            {def.tipo === 'text' && (
              <input type="text" name={name} id={`f_${name}`} defaultValue={registro?.[name] ?? ''} placeholder={def.placeholder || ''} />
            )}
          </div>
        ))}

        <button type="submit" className="btn">Guardar</button>{' '}
        <Link href={`/admin/manage/${table}`} className="btn gris">Cancelar</Link>
      </form>
    </div>
  );
}
