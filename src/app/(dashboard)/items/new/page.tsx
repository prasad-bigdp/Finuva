import { Topbar } from "@/components/layout/topbar";
import { ItemForm } from "@/components/forms/item-form";

export const metadata = { title: "New Item" };

export default function NewItemPage() {
  return (
    <div>
      <Topbar title="New Item" />
      <div className="p-6">
        <ItemForm />
      </div>
    </div>
  );
}
