export function truncar(texto, max) {
  if (!texto) return '';
  return texto.length > max ? texto.slice(0, max) + '…' : texto;
}

// Formatea 'YYYY-MM-DD' a algo como "15 ago"
export function formatFechaCorta(fecha) {
  if (!fecha) return '';
  const d = new Date(fecha + 'T00:00:00');
  if (isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString('es-MX', { day: '2-digit', month: 'short' });
}

// Formatea 'YYYY-MM-DD' a algo como "15 de agosto de 2026"
export function formatFechaLarga(fecha) {
  if (!fecha) return '';
  const d = new Date(fecha + 'T00:00:00');
  if (isNaN(d.getTime())) return fecha;
  return d.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' });
}
