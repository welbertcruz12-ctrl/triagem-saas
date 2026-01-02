import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/client";
import { Sidebar } from "@/components/dashboard/sidebar";
import { Header } from "@/components/dashboard/header";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createServerSupabaseClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  // Buscar dados do usuário e tenant
  const { data: userData } = await supabase
    .from("users")
    .select("*, tenants(*)")
    .eq("auth_id", user.id)
    .single();

  if (!userData) {
    redirect("/auth/login");
  }

  const tenant = userData.tenants;

  // Se onboarding não completo, redirecionar
  if (!tenant?.onboarding_completed) {
    redirect("/onboarding");
  }

  return (
    <div className="flex h-screen bg-muted/30">
      <Sidebar tenant={tenant} user={userData} />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header tenant={tenant} user={userData} />
        <main className="flex-1 overflow-y-auto p-6">{children}</main>
      </div>
    </div>
  );
}
