'use client';

export default function ConfirmSubmitButton({ children, className, mensaje }) {
  return (
    <button
      type="submit"
      className={className}
      onClick={(e) => {
        if (!window.confirm(mensaje || '¿Estás seguro?')) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
