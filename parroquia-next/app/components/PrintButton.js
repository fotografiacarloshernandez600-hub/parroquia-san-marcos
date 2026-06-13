'use client';

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      style={{ padding: '8px 16px', borderRadius: 8, border: '1px solid #1f7a5c', background: '#fff', cursor: 'pointer' }}
    >
      🖨️ Imprimir
    </button>
  );
}
