// Shared contact-form logic used by the Vercel function (api/contact.js) and the
// local Express server (server.mjs). Emails each message through Resend.
const RESEND_API_KEY = () => process.env.RESEND_API_KEY;
const TO_EMAIL = () => process.env.CONTACT_TO_EMAIL || "hello@tonylewismanzi.com";
// onboarding@resend.dev works without a verified domain, but can only deliver to
// the email address that owns the Resend account.
const FROM_EMAIL = () => process.env.CONTACT_FROM_EMAIL || "Portfolio Contact <onboarding@resend.dev>";

const LIMITS = { name: 120, email: 200, website: 300, budget: 60, message: 5000 };
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);

export class ContactError extends Error {
  constructor(message, status = 400) {
    super(message);
    this.status = status;
  }
}

function clean(body) {
  const fields = {};
  for (const [key, max] of Object.entries(LIMITS)) {
    fields[key] = String(body?.[key] ?? "").trim().slice(0, max);
  }
  return fields;
}

export async function sendContactMessage(body) {
  // Honeypot: real visitors never see or fill the "company" field.
  if (body?.company) return { ok: true };

  const fields = clean(body);
  if (!fields.name) throw new ContactError("Please add your name.");
  if (!EMAIL_PATTERN.test(fields.email)) throw new ContactError("Please add a valid email address.");
  if (fields.message.length < 10) throw new ContactError("Please tell me a little more about your project.");

  const apiKey = RESEND_API_KEY();
  if (!apiKey) {
    console.error("[contact] RESEND_API_KEY is not set");
    throw new ContactError("The contact form isn't available right now. Please book a call instead.", 503);
  }

  const rows = [
    ["Name", fields.name],
    ["Email", fields.email],
    ["Website", fields.website || "—"],
    ["Budget", fields.budget || "—"],
  ];
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;color:#171717;line-height:1.5">
      <h2 style="margin:0 0 16px">New portfolio enquiry</h2>
      <table style="border-collapse:collapse">
        ${rows
          .map(
            ([label, value]) =>
              `<tr><td style="padding:4px 16px 4px 0;color:#777">${label}</td><td style="padding:4px 0">${escapeHtml(value)}</td></tr>`,
          )
          .join("")}
      </table>
      <p style="margin:20px 0 6px;color:#777">Message</p>
      <p style="margin:0;white-space:pre-wrap">${escapeHtml(fields.message)}</p>
    </div>`;
  const text = `${rows.map(([label, value]) => `${label}: ${value}`).join("\n")}\n\n${fields.message}`;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM_EMAIL(),
      to: [TO_EMAIL()],
      reply_to: fields.email,
      subject: `New enquiry from ${fields.name}`,
      html,
      text,
    }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("[contact] Resend error", response.status, detail);
    throw new ContactError("Your message couldn't be sent. Please try again or book a call.", 502);
  }

  return { ok: true };
}
