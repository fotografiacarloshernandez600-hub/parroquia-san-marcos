-- =========================================================
-- PARROQUIA SAN MARCOS EVANGELISTA - Esquema para Supabase
-- =========================================================
-- Cómo usar:
-- 1. Entra a tu proyecto de Supabase -> "SQL Editor" -> "New query".
-- 2. Pega TODO este archivo y da clic en "Run".
-- 3. Eso crea las tablas, datos iniciales, el usuario admin y el
--    bucket de almacenamiento "uploads" para imágenes y comprobantes.
-- =========================================================

-- ---------- Extensiones necesarias ----------
create extension if not exists pgcrypto;

-- ---------- TABLAS ----------

create table if not exists settings (
    clave text primary key,
    valor text
);

create table if not exists admin_users (
    id bigint generated always as identity primary key,
    usuario text unique not null,
    password_hash text not null,
    nombre text
);

create table if not exists horarios_misa (
    id bigint generated always as identity primary key,
    dia text not null,
    hora text not null,
    tipo text,
    lugar text,
    orden integer default 0
);

create table if not exists horarios_oficina (
    id bigint generated always as identity primary key,
    dia text not null,
    hora_inicio text not null,
    hora_fin text not null,
    notas text,
    orden integer default 0
);

create table if not exists sacramentos (
    id bigint generated always as identity primary key,
    nombre text not null,
    descripcion text,
    requisitos text,
    orden integer default 0
);

create table if not exists grupos (
    id bigint generated always as identity primary key,
    nombre text not null,
    descripcion text,
    horario text,
    contacto text,
    imagen text,
    orden integer default 0
);

create table if not exists ermitas (
    id bigint generated always as identity primary key,
    nombre text not null,
    descripcion text,
    ubicacion_texto text,
    lat double precision,
    lng double precision,
    imagen text,
    orden integer default 0
);

create table if not exists eventos (
    id bigint generated always as identity primary key,
    titulo text not null,
    descripcion text,
    fecha date,
    hora text,
    imagen text,
    orden integer default 0
);

create table if not exists galeria (
    id bigint generated always as identity primary key,
    titulo text,
    categoria text,
    imagen text not null,
    orden integer default 0
);

create table if not exists calendario_liturgico (
    id bigint generated always as identity primary key,
    fecha date not null,
    titulo text not null,
    descripcion text,
    color_liturgico text,
    imagen text,
    orden integer default 0
);

create table if not exists solicitudes (
    id bigint generated always as identity primary key,
    sacramento_id bigint references sacramentos(id) on delete set null,
    nombre_solicitante text not null,
    telefono text,
    email text,
    nombre_persona text,
    mensaje text,
    estado text default 'Pendiente',
    notas_admin text,
    fecha_creacion timestamptz default now()
);

create table if not exists solicitud_archivos (
    id bigint generated always as identity primary key,
    solicitud_id bigint not null references solicitudes(id) on delete cascade,
    ruta_archivo text not null,
    nombre_original text
);

-- ---------- ROW LEVEL SECURITY ----------
-- Se activa RLS sin políticas públicas: todo el acceso lo hace el
-- backend de Next.js usando la "service role key" (que ignora RLS).
-- Esto evita exponer datos sensibles directamente al navegador.

create table if not exists clero (
    id bigint generated always as identity primary key,
    nombre text not null,
    cargo text,
    bio text,
    imagen text,
    orden integer default 0
);

alter table settings enable row level security;
alter table clero enable row level security;
alter table admin_users enable row level security;
alter table horarios_misa enable row level security;
alter table horarios_oficina enable row level security;
alter table sacramentos enable row level security;
alter table grupos enable row level security;
alter table ermitas enable row level security;
alter table eventos enable row level security;
alter table galeria enable row level security;
alter table calendario_liturgico enable row level security;
alter table solicitudes enable row level security;
alter table solicitud_archivos enable row level security;

-- ---------- DATOS INICIALES ----------

-- Usuario administrador por defecto
-- Usuario: admin   Contraseña: CambiarEsta123
-- (cámbiala desde el panel en cuanto entres)
insert into admin_users (usuario, password_hash, nombre)
values ('admin', '$2b$10$LyrQSZAH27YwDFXWRLqNI.htLLUbZI/PW00/8ieaerq.Qdsmdsv/e', 'Administrador')
on conflict (usuario) do nothing;

-- Datos generales del sitio
insert into settings (clave, valor) values
    ('direccion', 'Calle Juárez #201, Col. Centro, C.P. 86600, Paraíso, Tabasco, México'),
    ('telefono', '+52 933 333 3658'),
    ('email', 'sanmarcosparaiso@gmail.com'),
    ('facebook', 'https://www.facebook.com/sanmarcosevangelistaparaiso/'),
    ('lat_iglesia', '18.39611'),
    ('lng_iglesia', '-93.21278'),
    ('historia', 'Parroquia dedicada a San Marcos Evangelista, santo patrono de Paraíso, Tabasco. La construcción del templo comenzó en 1823, cuando Paraíso recibió la categoría de pueblo. A lo largo de su historia el templo ha pasado por distintas etapas, hasta llegar a su característica y colorida fachada, propia de la región de la Chontalpa.

Edite este texto desde el panel de administración para ampliar la historia, misión y visión de la parroquia.'),
    ('mision', 'Ser una comunidad parroquial samaritana, comprometida decididamente con la nueva evangelización, acompañando a las familias en su camino de fe.'),
    ('vision', 'Ser una comunidad viva, misionera y unida, que anuncia el Evangelio y sirve a los más necesitados.'),
    ('patrono', 'San Marcos Evangelista es uno de los cuatro evangelistas, autor del Evangelio que lleva su nombre. Su fiesta se celebra el 25 de abril.')
on conflict (clave) do nothing;

-- Horarios de misa (ejemplo - editar desde el admin)
insert into horarios_misa (dia, hora, tipo, lugar, orden) values
    ('Lunes a viernes', '7:00 pm', 'Misa diaria', 'Templo principal', 1),
    ('Sábado', '7:00 pm', 'Misa vespertina', 'Templo principal', 2),
    ('Domingo', '7:00 am', 'Misa dominical', 'Templo principal', 3),
    ('Domingo', '10:00 am', 'Misa dominical', 'Templo principal', 4),
    ('Domingo', '12:00 pm', 'Misa dominical', 'Templo principal', 5),
    ('Domingo', '6:00 pm', 'Misa dominical', 'Templo principal', 6)
on conflict do nothing;

-- Horario de atención de oficina parroquial
insert into horarios_oficina (dia, hora_inicio, hora_fin, notas, orden) values
    ('Lunes a viernes', '9:00 am', '2:00 pm', 'Trámites de sacramentos y constancias', 1),
    ('Lunes a viernes', '4:00 pm', '7:00 pm', 'Atención general', 2),
    ('Sábado', '9:00 am', '1:00 pm', 'Atención general', 3)
on conflict do nothing;

-- Sacramentos con requisitos (uno por línea)
insert into sacramentos (nombre, descripcion, requisitos, orden) values
('Bautismo', 'El Bautismo es el primer sacramento que nos incorpora a la Iglesia.',
'Acta de nacimiento del niño/a (original y copia)
CURP del niño/a
Copia de credencial INE de los padres
Copia de credencial INE de los padrinos
Constancia de plática prebautismal
Comprobante de pago de derechos parroquiales', 1),

('Primera Comunión', 'Sacramento de iniciación que recibe a los niños que han concluido su catequesis.',
'Acta de bautismo
Constancia de haber concluido el curso de catequesis
Copia de credencial INE de los padres o tutores
Comprobante de pago de derechos parroquiales', 2),

('Confirmación', 'Sacramento que fortalece la gracia bautismal y nos hace testigos de Cristo.',
'Acta de bautismo
Constancia de primera comunión
Constancia de haber concluido el curso de confirmación
Copia de credencial INE
Copia de credencial INE del padrino o madrina (mayor de 16 años, confirmado)
Comprobante de pago de derechos parroquiales', 3),

('Matrimonio', 'Sacramento que une a un hombre y una mujer en alianza ante Dios y la comunidad.',
'Actas de bautismo recientes (no mayores a 6 meses) de ambos
Constancia de confirmación de ambos
Acta de nacimiento de ambos
Copia de credencial INE de ambos
Copia de identificación de los testigos
Constancia de haber concluido el curso prematrimonial
Acta de matrimonio civil (si ya se realizó)
Comprobante de pago de derechos parroquiales', 4),

('XV Años (Misa de acción de gracias)', 'Celebración de acción de gracias por los 15 años, con previa preparación espiritual.',
'Acta de bautismo
Constancia de confirmación (si ya la recibió)
Copia de credencial INE de los padres o tutores
Constancia de haber asistido a la plática de XV años
Comprobante de pago de derechos parroquiales', 5)
on conflict do nothing;

-- Ermita de ejemplo (editar/eliminar y agregar las reales desde el admin)
insert into ermitas (nombre, descripcion, ubicacion_texto, lat, lng, orden) values
('Ermita de ejemplo', 'Edite o elimine esta ermita desde el panel de administración y agregue las ermitas reales que pertenecen a la parroquia, con su ubicación en el mapa.', 'Paraíso, Tabasco', 18.39611, -93.21278, 1)
on conflict do nothing;

-- Sacerdote de ejemplo (editar/eliminar desde el admin)
insert into clero (nombre, cargo, bio, orden) values
('Nombre del párroco', 'Párroco', 'Edita o elimina este ejemplo desde el panel de administración y agrega a los sacerdotes de la parroquia con su foto, cargo y una breve reseña.', 1)
on conflict do nothing;

-- =========================================================
-- ALMACENAMIENTO (Storage)
-- =========================================================
-- Crea un bucket público llamado "uploads" para imágenes de
-- grupos, ermitas, eventos, galería y comprobantes de solicitudes.
insert into storage.buckets (id, name, public)
values ('uploads', 'uploads', true)
on conflict (id) do nothing;

-- =========================================================
-- FIN. Después de ejecutar este script:
-- 1. Ve a "Project Settings" -> "API" y copia:
--      - "Project URL"          -> SUPABASE_URL
--      - "service_role" secret  -> SUPABASE_SERVICE_ROLE_KEY
--    (NUNCA compartas la service_role key públicamente)
-- 2. Usuario del panel: admin / Contraseña: CambiarEsta123
--    Cámbiala en cuanto entres al panel.
-- =========================================================
