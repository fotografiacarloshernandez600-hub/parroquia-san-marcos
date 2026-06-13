import { notFound } from 'next/navigation';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import PrintButton from '@/app/components/PrintButton';

export const metadata = { title: 'Boleta de solicitud' };

export default async function BoletaPage({ params }) {
  const { id } = await params;
  const db = supabaseAdmin();
  const { data: sol } = await db.from('solicitudes').select('*, sacramentos(nombre)').eq('id', id).single();
  if (!sol) notFound();

  const folio = String(sol.id).padStart(6, '0');

  return (
    <div style={{ fontFamily: "'Segoe UI', Arial, sans-serif", padding: 30, color: '#222', maxWidth: 650, margin: '0 auto' }}>
      <div style={{ border: '2px solid #1f7a5c', borderRadius: 12, padding: 24 }}>
        <div style={{ textAlign: 'right', color: '#999', fontSize: '0.85rem' }}>Folio: #{folio}</div>
        <h1 style={{ textAlign: 'center', color: '#1f7a5c', marginTop: 0, fontSize: '1.3rem', fontFamily: 'Georgia, serif' }}>⛪ Parroquia San Marcos Evangelista</h1>
        <div style={{ textAlign: 'center', color: '#777', marginBottom: 20 }}>Boleta de solicitud de sacramento</div>

        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 14 }}>
          <tbody>
            <Fila label="Sacramento solicitado" valor={sol.sacramentos?.nombre || '—'} />
            <Fila label="Solicitado por" valor={sol.nombre_solicitante} />
            <Fila label="Persona que recibe el sacramento" valor={sol.nombre_persona || sol.nombre_solicitante} />
            <Fila label="Teléfono" valor={sol.telefono} />
            <Fila label="Correo" valor={sol.email || '—'} />
            <Fila label="Fecha de solicitud" valor={new Date(sol.fecha_creacion).toLocaleString('es-MX')} />
            <Fila label="Estado" valor={sol.estado} />
            <Fila label="Mensaje / observaciones" valor={sol.mensaje || '—'} />
          </tbody>
        </table>

        <div style={{ marginTop: 50, display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '45%', textAlign: 'center', borderTop: '1px solid #333', paddingTop: 6 }}>Firma del solicitante</div>
          <div style={{ width: '45%', textAlign: 'center', borderTop: '1px solid #333', paddingTop: 6 }}>Firma y sello de la oficina parroquial</div>
        </div>
      </div>

      <div className="no-imprimir" style={{ textAlign: 'center', marginTop: 20 }}>
        <PrintButton />
      </div>

      <style>{`@media print { .no-imprimir { display: none; } }`}</style>
    </div>
  );
}

function Fila({ label, valor }) {
  return (
    <tr>
      <td style={{ padding: '8px 4px', borderBottom: '1px solid #eee', fontWeight: 'bold', width: 180, verticalAlign: 'top' }}>{label}</td>
      <td style={{ padding: '8px 4px', borderBottom: '1px solid #eee', verticalAlign: 'top', whiteSpace: 'pre-line' }}>{valor}</td>
    </tr>
  );
}
