import { supabaseAdmin } from '@/lib/supabaseAdmin';
import SacramentosClient from '@/app/components/SacramentosClient';

export const metadata = { title: 'Sacramentos | Parroquia San Marcos Evangelista' };

export default async function SacramentosPage() {
  const db = supabaseAdmin();
  const { data: sacramentos } = await db.from('sacramentos').select('*').order('orden', { ascending: true });

  return <SacramentosClient sacramentos={sacramentos ?? []} />;
}
