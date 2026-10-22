```tsx
import { notFound } from "next/navigation";
import { getAdminSecretSlug, isAuthenticatedAdmin } from "@/lib/auth";
import { getCMSData } from "@/lib/cms-storage";
import AdminDashboardClient from "@/components/admin/AdminDashboardClient";


export const dynamic = "force-dynamic";


interface AdminPageProps {
  params: Promise<{ slug: string }>;
}


export default async function SecretAdminPage({ params }: AdminPageProps) {
  const { slug } = await params;
  const expectedSlug = getAdminSecretSlug();


  // Als de geheime slug niet klopt, toon een standaard 404 pagina
  if (slug !== expectedSlug) {
    notFound();
  }


  const [authenticated, cmsData] = await Promise.all([
    isAuthenticatedAdmin(),
    getCMSData(),
  ]);


  return (
    <AdminDashboardClient
      initialAuthenticated={authenticated}
      initialData={cmsData}
    />
  );
}
```
