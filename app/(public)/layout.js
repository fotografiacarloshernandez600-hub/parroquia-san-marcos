import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import ScrollReveal from '@/app/components/ScrollReveal';
import { getSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({ children }) {
  const settings = await getSettings();
  return (
    <>
      <Header />
      {children}
      <Footer settings={settings} />
      <ScrollReveal />
    </>
  );
}
