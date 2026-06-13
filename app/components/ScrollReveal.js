'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Activa las animaciones de aparición (.reveal -> .visible) cuando los
// elementos entran en pantalla. Se re-ejecuta en cada cambio de página
// (usePathname) y SIEMPRE tiene un respaldo que muestra el contenido,
// para que nunca quede una sección invisible / "en blanco".
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const mostrarTodo = () => {
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
    };

    // Respaldo de seguridad: si en 1.2s algo no disparó, mostramos todo igual.
    const respaldo = setTimeout(mostrarTodo, 1200);

    let observer;
    try {
      const prefiereMenos =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefiereMenos || typeof IntersectionObserver === 'undefined') {
        mostrarTodo();
        clearTimeout(respaldo);
        return;
      }

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
      );

      const elementos = document.querySelectorAll('.reveal:not(.visible)');
      // Lo que ya está en pantalla al cargar, se muestra de inmediato.
      elementos.forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight) {
          el.classList.add('visible');
        } else {
          observer.observe(el);
        }
      });
    } catch {
      mostrarTodo();
    }

    return () => {
      clearTimeout(respaldo);
      if (observer) observer.disconnect();
    };
  }, [pathname]);

  return null;
}
