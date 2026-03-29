// ─── Email Service (Nodemailer) ───────────────────────────────────────────────
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: {
    filename: string;
    content: Buffer;
    contentType: string;
  }[];
}

export async function sendEmail(options: EmailOptions) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM ?? "InvoiceApp <noreply@invoiceapp.com>",
    ...options,
  });
}

// ─── Email templates ──────────────────────────────────────────────────────────
export function invoiceEmailTemplate(data: {
  customerName: string;
  invoiceNumber: string;
  amount: string;
  dueDate: string;
  orgName: string;
  viewUrl: string;
}) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px;">
  <div style="background:#2563eb;color:#fff;padding:20px;border-radius:8px 8px 0 0;">
    <h2 style="margin:0;">${data.orgName}</h2>
  </div>
  <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
    <p>Dear ${data.customerName},</p>
    <p>Please find your invoice <strong>${data.invoiceNumber}</strong> for <strong>${data.amount}</strong>.</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr>
        <td style="padding:8px;color:#6b7280;">Invoice Number</td>
        <td style="padding:8px;font-weight:bold;">${data.invoiceNumber}</td>
      </tr>
      <tr style="background:#fff;">
        <td style="padding:8px;color:#6b7280;">Amount Due</td>
        <td style="padding:8px;font-weight:bold;color:#dc2626;">${data.amount}</td>
      </tr>
      <tr>
        <td style="padding:8px;color:#6b7280;">Due Date</td>
        <td style="padding:8px;">${data.dueDate}</td>
      </tr>
    </table>
    <div style="text-align:center;margin:24px 0;">
      <a href="${data.viewUrl}" style="background:#2563eb;color:#fff;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;">
        View &amp; Pay Invoice
      </a>
    </div>
    <p style="color:#6b7280;font-size:12px;">If you have any questions, please reply to this email.</p>
    <p>Thank you,<br/>${data.orgName}</p>
  </div>
</body>
</html>`;
}

export function paymentThankyouTemplate(data: {
  customerName: string;
  invoiceNumber: string;
  amount: string;
  orgName: string;
}) {
  return `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px;">
  <div style="background:#16a34a;color:#fff;padding:20px;border-radius:8px 8px 0 0;">
    <h2 style="margin:0;">Payment Received — ${data.orgName}</h2>
  </div>
  <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
    <p>Dear ${data.customerName},</p>
    <p>We've received your payment of <strong>${data.amount}</strong> for invoice <strong>${data.invoiceNumber}</strong>.</p>
    <p>Thank you for your prompt payment!</p>
    <p>Best regards,<br/>${data.orgName}</p>
  </div>
</body>
</html>`;
}

export function paymentReminderTemplate(data: {
  customerName: string;
  invoiceNumber: string;
  amount: string;
  dueDate: string;
  orgName: string;
  viewUrl: string;
  daysOverdue?: number;
}) {
  const subject = data.daysOverdue
    ? `[OVERDUE] Invoice ${data.invoiceNumber} is ${data.daysOverdue} days past due`
    : `Reminder: Invoice ${data.invoiceNumber} due ${data.dueDate}`;

  const urgency = data.daysOverdue
    ? `<p style="color:#dc2626;font-weight:bold;">This invoice is ${data.daysOverdue} days overdue.</p>`
    : `<p>This is a friendly reminder that this invoice is due on <strong>${data.dueDate}</strong>.</p>`;

  return {
    subject,
    html: `
<!DOCTYPE html>
<html>
<body style="font-family:Arial,sans-serif;color:#333;max-width:600px;margin:0 auto;padding:20px;">
  <div style="background:#d97706;color:#fff;padding:20px;border-radius:8px 8px 0 0;">
    <h2 style="margin:0;">Payment Reminder — ${data.orgName}</h2>
  </div>
  <div style="background:#f9fafb;padding:24px;border:1px solid #e5e7eb;border-radius:0 0 8px 8px;">
    <p>Dear ${data.customerName},</p>
    ${urgency}
    <p>Invoice <strong>${data.invoiceNumber}</strong> for <strong>${data.amount}</strong> remains unpaid.</p>
    <div style="text-align:center;margin:24px 0;">
      <a href="${data.viewUrl}" style="background:#2563eb;color:#fff;padding:12px 32px;border-radius:6px;text-decoration:none;font-weight:bold;">
        Pay Now
      </a>
    </div>
    <p style="color:#6b7280;font-size:12px;">Please disregard this email if payment has already been made.</p>
    <p>${data.orgName}</p>
  </div>
</body>
</html>`,
  };
}
