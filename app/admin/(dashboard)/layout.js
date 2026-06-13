import AdminSidebar from '@/app/components/AdminSidebar';

export const dynamic = 'force-dynamic';

export default function DashboardLayout({ children }) {
  return (
    <div className="admin-wrap">
      <AdminSidebar />
      <main className="admin-main">{children}</main>
    </div>
  );
}
