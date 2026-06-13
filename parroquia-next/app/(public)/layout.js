import Header from '@/app/components/Header';
import Footer from '@/app/components/Footer';
import { getSettings } from '@/lib/settings';

export const dynamic = 'force-dynamic';

export default async function PublicLayout({ children }) {
  const settings = await getSettings();
  return (
    <>
      <div className="franja-color"></div>
      <Header />
      {children}
      <Footer settings={settings} />
    </>
  );
}
