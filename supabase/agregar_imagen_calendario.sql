-- =========================================================
-- AGREGAR IMAGEN AL CALENDARIO LITÚRGICO
-- =========================================================
-- Si tu base de datos ya estaba creada, corre SOLO este archivo en
-- Supabase (SQL Editor -> New query -> pega -> Run) para poder subir
-- una imagen en cada fecha del calendario litúrgico.
-- =========================================================

alter table calendario_liturgico
    add column if not exists imagen text;
