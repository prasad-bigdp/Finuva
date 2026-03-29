import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="min-h-screen">
      <Sidebar orgName={session.user.organizationName} />
      <div className="lg:pl-[19rem]">
        <main className="min-h-screen pb-10">{children}</main>
      </div>
    </div>
  );
}
