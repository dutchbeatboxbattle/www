import AdminDashboardClient from "@/components/admin/AdminDashboardClient";
import data from "@/data/cms-store.json";
import type { CMSData } from "@/types/cms";
export default function AdminPage() {
  return (
    <AdminDashboardClient
      initialAuthenticated={false}
      initialData={data as CMSData}
    />
  );
}
