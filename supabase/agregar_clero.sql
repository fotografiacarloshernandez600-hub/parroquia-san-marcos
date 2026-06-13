-- =========================================================
-- AGREGAR SECCIÓN DE SACERDOTES (CLERO)
-- =========================================================
-- Si TU base de datos ya estaba creada de antes, corre SOLO
-- este archivo en Supabase (SQL Editor -> New query -> pega -> Run)
-- para añadir la nueva sección de sacerdotes/padres.
-- (Si instalas desde cero con schema.sql, ya viene incluida.)
-- =========================================================

create table if not exists clero (
    id bigint generated always as identity primary key,
    nombre text not null,
    cargo text,
    bio text,
    imagen text,
    orden integer default 0
);

alter table clero enable row level security;

-- Sacerdote de ejemplo (edítalo o elimínalo desde el panel)
insert into clero (nombre, cargo, bio, orden) values
('Nombre del párroco', 'Párroco', 'Edita o elimina este ejemplo desde el panel de administración y agrega a los sacerdotes de la parroquia con su foto, cargo y una breve reseña.', 1)
on conflict do nothing;
