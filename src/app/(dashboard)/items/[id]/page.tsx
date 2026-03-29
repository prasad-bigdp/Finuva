import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Topbar } from "@/components/layout/topbar";
import { ItemForm } from "@/components/forms/item-form";

export const metadata = { title: "Edit Item" };

export default async function EditItemPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user) return null;
  const { id } = await params;

  const item = await prisma.item.findFirst({
    where: { id, organizationId: session.user.organizationId },
  });
  if (!item) notFound();

  return (
    <div>
      <Topbar title={`Edit: ${item.name}`} />
      <div className="p-6">
        <ItemForm item={item} />
      </div>
    </div>
  );
}
