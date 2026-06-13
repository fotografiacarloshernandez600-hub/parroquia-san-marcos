'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

// Anima la aparición de elementos .reveal al hacer scroll.
// El contenido es VISIBLE por defecto (en el CSS). Este script activa el
// modo animado (body.js-reveal) solo si todo está OK, así nunca se queda
// una sección invisible aunque algo falle.
export default function ScrollReveal() {
  const pathname = usePathname();

  useEffect(() => {
    const body = document.body;
    let observer;
    let respaldo;

    const mostrarTodo = () => {
      body.classList.remove('js-reveal');
      document.querySelectorAll('.reveal').forEach((el) => el.classList.add('visible'));
    };

    try {
      const prefiereMenos =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      if (prefiereMenos || typeof IntersectionObserver === 'undefined') {
        mostrarTodo();
        return;
      }

      // Activar el modo animado (oculta los .reveal para animarlos)
      body.classList.add('js-reveal');

      // Respaldo: si en 1.5s algo no disparó, mostramos todo igual
      respaldo = setTimeout(mostrarTodo, 1500);

      observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.08, rootMargin: '0px 0px -30px 0px' }
      );

      // Mostrar de inmediato lo que ya está en pantalla; observar el resto
      requestAnimationFrame(() => {
        const elementos = document.querySelectorAll('.reveal:not(.visible)');
        elementos.forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.top < window.innerHeight + 100) {
            el.classList.add('visible');
          } else {
            observer.observe(el);
          }
        });
      });
    } catch {
      mostrarTodo();
    }

    return () => {
      if (respaldo) clearTimeout(respaldo);
      if (observer) observer.disconnect();
    };
  }, [pathname]);

  return null;
}
