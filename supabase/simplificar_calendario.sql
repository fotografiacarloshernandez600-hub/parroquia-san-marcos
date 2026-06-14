-- =========================================================
-- SIMPLIFICAR CALENDARIO LITÚRGICO
-- =========================================================
-- Ahora el calendario solo necesita NOMBRE + IMAGEN (sin fecha).
-- Corre este archivo en Supabase (SQL Editor -> New query -> pega -> Run)
-- para quitar la obligación de la fecha.
-- =========================================================

-- La fecha ya no es obligatoria
alter table calendario_liturgico
    alter column fecha drop not null;

-- Asegurar que la columna imagen exista (por si no se había agregado)
alter table calendario_liturgico
    add column if not exists imagen text;
