import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { Topbar } from "@/components/layout/topbar";
import { SettingsForm } from "@/components/forms/settings-form";

export const metadata = { title: "Settings" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) return null;

  const org = await prisma.organization.findUnique({
    where: { id: session.user.organizationId },
  });

  const isAdmin = session.user.role === "ADMIN";

  return (
    <div>
      <Topbar title="Organization Settings" />
      <div className="p-6 max-w-3xl">
        {!isAdmin && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
            Only admins can edit organization settings.
          </div>
        )}
        <SettingsForm org={org} readOnly={!isAdmin} />
      </div>
    </div>
  );
}
