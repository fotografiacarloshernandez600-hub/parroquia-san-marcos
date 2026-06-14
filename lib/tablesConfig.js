// Listas auxiliares para selects
export const DIAS_SEMANA = [
  'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo',
  'Lunes a viernes', 'Lunes a sábado', 'Todos los días',
];

export const COLORES_LITURGICOS = ['Verde', 'Morado', 'Blanco', 'Rojo', 'Rosa', 'Dorado'];

export const COLORES_LITURGICOS_HEX = {
  Verde: '#1f7a5c',
  Morado: '#6b4ba1',
  Blanco: '#999999',
  Rojo: '#c1432d',
  Rosa: '#e07ba1',
  Dorado: '#d4a017',
};

// =========================================================
// Definición de tablas administrables (CRUD genérico)
// =========================================================
export const TABLAS = {
  horarios_misa: {
    titulo: 'Horarios de Misa',
    ordenCampo: 'orden',
    campos: {
      dia: { label: 'Día', tipo: 'select', opciones: DIAS_SEMANA, requerido: true },
      hora: { label: 'Hora', tipo: 'text', placeholder: 'Ej. 7:00 pm', requerido: true },
      tipo: { label: 'Celebración', tipo: 'text', placeholder: 'Ej. Misa dominical' },
      lugar: { label: 'Lugar', tipo: 'text', placeholder: 'Ej. Templo principal' },
      orden: { label: 'Orden', tipo: 'number' },
    },
    columnasLista: ['dia', 'hora', 'tipo', 'lugar'],
  },

  horarios_oficina: {
    titulo: 'Atención de Oficina',
    ordenCampo: 'orden',
    campos: {
      dia: { label: 'Día', tipo: 'select', opciones: DIAS_SEMANA, requerido: true },
      hora_inicio: { label: 'Hora inicio', tipo: 'text', placeholder: 'Ej. 9:00 am', requerido: true },
      hora_fin: { label: 'Hora fin', tipo: 'text', placeholder: 'Ej. 2:00 pm', requerido: true },
      notas: { label: 'Notas', tipo: 'text' },
      orden: { label: 'Orden', tipo: 'number' },
    },
    columnasLista: ['dia', 'hora_inicio', 'hora_fin', 'notas'],
  },

  sacramentos: {
    titulo: 'Sacramentos',
    ordenCampo: 'orden',
    campos: {
      nombre: { label: 'Nombre', tipo: 'text', requerido: true },
      descripcion: { label: 'Descripción', tipo: 'textarea' },
      requisitos: { label: 'Requisitos (uno por línea)', tipo: 'textarea', filas: 8 },
      orden: { label: 'Orden', tipo: 'number' },
    },
    columnasLista: ['nombre'],
  },

  grupos: {
    titulo: 'Grupos y Movimientos',
    ordenCampo: 'orden',
    campos: {
      nombre: { label: 'Nombre del grupo', tipo: 'text', requerido: true },
      descripcion: { label: 'Descripción', tipo: 'textarea' },
      horario: { label: 'Horario de reunión', tipo: 'text' },
      contacto: { label: 'Contacto / encargado', tipo: 'text' },
      imagen: { label: 'Imagen', tipo: 'image', carpeta: 'grupos' },
      orden: { label: 'Orden', tipo: 'number' },
    },
    columnasLista: ['nombre', 'horario', 'contacto'],
  },

  ermitas: {
    titulo: 'Ermitas',
    ordenCampo: 'orden',
    ayuda: 'Tip: para obtener la latitud y longitud, busca el lugar en Google Maps, da clic derecho sobre el punto exacto y copia las coordenadas (ej. 18.39611, -93.21278).',
    campos: {
      nombre: { label: 'Nombre de la ermita', tipo: 'text', requerido: true },
      descripcion: { label: 'Descripción', tipo: 'textarea' },
      ubicacion_texto: { label: 'Ubicación (texto)', tipo: 'text', placeholder: 'Ej. Ranchería X, Paraíso, Tabasco' },
      lat: { label: 'Latitud', tipo: 'text', placeholder: 'Ej. 18.39611' },
      lng: { label: 'Longitud', tipo: 'text', placeholder: 'Ej. -93.21278' },
      imagen: { label: 'Imagen', tipo: 'image', carpeta: 'ermitas' },
      orden: { label: 'Orden', tipo: 'number' },
    },
    columnasLista: ['nombre', 'ubicacion_texto', 'lat', 'lng'],
  },

  eventos: {
    titulo: 'Eventos y Avisos',
    ordenCampo: 'orden',
    campos: {
      titulo: { label: 'Título', tipo: 'text', requerido: true },
      descripcion: { label: 'Descripción', tipo: 'textarea' },
      fecha: { label: 'Fecha', tipo: 'date' },
      hora: { label: 'Hora', tipo: 'text', placeholder: 'Ej. 6:00 pm' },
      imagen: { label: 'Imagen', tipo: 'image', carpeta: 'eventos' },
      orden: { label: 'Orden', tipo: 'number' },
    },
    columnasLista: ['titulo', 'fecha', 'hora'],
  },

  galeria: {
    titulo: 'Galería de Fotos',
    ordenCampo: 'orden',
    campos: {
      titulo: { label: 'Título / descripción corta', tipo: 'text' },
      categoria: { label: 'Categoría', tipo: 'text', placeholder: 'Ej. Semana Santa, Fiesta patronal...' },
      imagen: { label: 'Imagen', tipo: 'image', carpeta: 'galeria', requerido: true },
      orden: { label: 'Orden', tipo: 'number' },
    },
    columnasLista: ['titulo', 'categoria'],
  },

  calendario_liturgico: {
    titulo: 'Calendario Litúrgico',
    ordenCampo: 'orden',
    campos: {
      titulo: { label: 'Nombre / título', tipo: 'text', requerido: true, placeholder: 'Ej. Calendario Litúrgico 2026' },
      imagen: { label: 'Imagen del calendario', tipo: 'image', carpeta: 'calendario', requerido: true },
      orden: { label: 'Orden', tipo: 'number' },
    },
    columnasLista: ['titulo'],
  },

  clero: {
    titulo: 'Sacerdotes',
    ordenCampo: 'orden',
    campos: {
      nombre: { label: 'Nombre', tipo: 'text', requerido: true },
      cargo: { label: 'Cargo', tipo: 'text', placeholder: 'Ej. Párroco, Vicario parroquial, Diácono' },
      bio: { label: 'Breve reseña / biografía', tipo: 'textarea', filas: 5 },
      imagen: { label: 'Foto', tipo: 'image', carpeta: 'clero' },
      orden: { label: 'Orden', tipo: 'number' },
    },
    columnasLista: ['nombre', 'cargo'],
  },
};

export function getTabla(nombre) {
  return TABLAS[nombre] || null;
}
