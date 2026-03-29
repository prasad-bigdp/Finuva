// ─── Seed Script ─────────────────────────────────────────────────────────────
// Run: npm run db:seed
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // Clean up existing data
  await prisma.payment.deleteMany();
  await prisma.invoiceItem.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.item.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.session.deleteMany();
  await prisma.account.deleteMany();
  await prisma.user.deleteMany();
  await prisma.organization.deleteMany();

  // Create organization + admin user
  const hash = await bcrypt.hash("password123", 12);

  const org = await prisma.organization.create({
    data: {
      name: "Acme Technologies Pvt. Ltd.",
      email: "billing@acme.in",
      phone: "+91 98765 43210",
      address: "42, MG Road",
      city: "Bengaluru",
      state: "Karnataka",
      country: "India",
      pincode: "560001",
      gstin: "29AABCT1332L1ZN",
      pan: "AABCT1332L",
      currency: "INR",
      timezone: "Asia/Kolkata",
      invoicePrefix: "INV",
      invoiceCounter: 1,
      users: {
        create: [
          {
            name: "Admin User",
            email: "admin@acme.in",
            password: hash,
            role: "ADMIN",
          },
          {
            name: "Staff User",
            email: "staff@acme.in",
            password: hash,
            role: "STAFF",
          },
        ],
      },
    },
  });

  console.log(`✅ Organization created: ${org.name}`);

  // Create customers
  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        organizationId: org.id,
        displayName: "TechSoft Solutions",
        companyName: "TechSoft Solutions Pvt. Ltd.",
        email: "accounts@techsoft.in",
        phone: "+91 80 2345 6789",
        gstin: "27AAACT1234A1Z5",
        billingAddress: "15, Nariman Point",
        billingCity: "Mumbai",
        billingState: "Maharashtra",
        billingCountry: "India",
        billingPincode: "400021",
      },
    }),
    prisma.customer.create({
      data: {
        organizationId: org.id,
        displayName: "GlobalRetail Ltd.",
        companyName: "GlobalRetail Ltd.",
        email: "finance@globalretail.com",
        phone: "+91 44 6789 0123",
        gstin: "33AABCG4567B1Z2",
        billingAddress: "Anna Salai, T. Nagar",
        billingCity: "Chennai",
        billingState: "Tamil Nadu",
        billingCountry: "India",
        billingPincode: "600017",
      },
    }),
    prisma.customer.create({
      data: {
        organizationId: org.id,
        displayName: "Sharma & Associates",
        email: "info@sharmaassoc.in",
        phone: "+91 11 4567 8901",
        billingCity: "New Delhi",
        billingState: "Delhi",
        billingCountry: "India",
      },
    }),
  ]);

  console.log(`✅ ${customers.length} customers created`);

  // Create items
  const items = await Promise.all([
    prisma.item.create({
      data: {
        organizationId: org.id,
        name: "Web Development",
        description: "Full-stack web application development",
        type: "SERVICE",
        unit: "hrs",
        rate: 2500,
        taxRate: 18,
        hsnSac: "998314",
      },
    }),
    prisma.item.create({
      data: {
        organizationId: org.id,
        name: "UI/UX Design",
        description: "User interface and experience design",
        type: "SERVICE",
        unit: "hrs",
        rate: 2000,
        taxRate: 18,
        hsnSac: "998314",
      },
    }),
    prisma.item.create({
      data: {
        organizationId: org.id,
        name: "Annual Support Contract",
        description: "12 months premium support and maintenance",
        type: "SERVICE",
        rate: 60000,
        taxRate: 18,
        hsnSac: "998314",
      },
    }),
    prisma.item.create({
      data: {
        organizationId: org.id,
        name: "Server Hosting",
        description: "Cloud server hosting per month",
        type: "SERVICE",
        unit: "month",
        rate: 5000,
        taxRate: 18,
        hsnSac: "998316",
      },
    }),
  ]);

  console.log(`✅ ${items.length} items created`);

  // Create a sample invoice
  const subtotal = 40 * 2500; // 40 hrs web dev
  const tax = (subtotal * 18) / 100;
  const total = subtotal + tax;
  const halfTax = tax / 2;

  const invoice = await prisma.invoice.create({
    data: {
      organizationId: org.id,
      customerId: customers[0].id,
      invoiceNumber: "INV-00001",
      status: "SENT",
      issueDate: new Date(),
      dueDate: new Date(Date.now() + 30 * 86400000),
      subtotal,
      discountType: "PERCENT",
      discountValue: 0,
      discountAmount: 0,
      cgst: halfTax,
      sgst: halfTax,
      igst: 0,
      totalTax: tax,
      total,
      amountPaid: 0,
      balanceDue: total,
      currency: "INR",
      notes: "Thank you for your business!",
      terms: "Payment due within 30 days. Late payment will incur 2% monthly interest.",
      placeOfSupply: "Maharashtra",
      isInterState: true,
      sentAt: new Date(),
      items: {
        create: [
          {
            itemId: items[0].id,
            name: items[0].name,
            description: items[0].description,
            quantity: 40,
            unit: "hrs",
            rate: 2500,
            discount: 0,
            taxRate: 18,
            taxAmount: tax,
            amount: total,
            hsnSac: "998314",
            sortOrder: 0,
          },
        ],
      },
    },
  });

  // Update org invoice counter
  await prisma.organization.update({
    where: { id: org.id },
    data: { invoiceCounter: 2 },
  });

  // Update customer outstanding balance
  await prisma.customer.update({
    where: { id: customers[0].id },
    data: { outstandingBalance: total },
  });

  console.log(`✅ Sample invoice created: ${invoice.invoiceNumber}`);
  console.log("\n🎉 Seed complete!");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Login credentials:");
  console.log("  Admin → admin@acme.in / password123");
  console.log("  Staff → staff@acme.in / password123");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
