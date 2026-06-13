'use client';

import { useEffect } from 'react';

// Activa las animaciones de aparición (.reveal -> .visible) cuando los
// elementos entran en pantalla al hacer scroll. Es ligero y no bloquea nada.
export default function ScrollReveal() {
  useEffect(() => {
    const elementos = document.querySelectorAll('.reveal');

    // Si no hay soporte o el usuario prefiere menos movimiento, mostrar todo.
    const prefiereMenos = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefiereMenos || !('IntersectionObserver' in window)) {
      elementos.forEach((el) => el.classList.add('visible'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    elementos.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });

  return null;
}
