import { Topbar } from "@/components/layout/topbar";
import { CustomerForm } from "@/components/forms/customer-form";

export const metadata = { title: "New Customer" };

export default function NewCustomerPage() {
  return (
    <div>
      <Topbar title="New Customer" />
      <div className="p-6">
        <CustomerForm />
      </div>
    </div>
  );
}
