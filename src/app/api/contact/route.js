import nodemailer from "nodemailer";

// Force Node.js runtime (nodemailer n'est pas compatible edge)
export const runtime = "nodejs";

export async function POST(req) {
  try {
  const { name, email, message } = await req.json();
  // Validation basique
  const safeStr = (v) => (typeof v === "string" ? v.trim() : "");
  const n = safeStr(name);
  const e = safeStr(email);
  const m = safeStr(message);
  const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!n || !e || !m || n.length > 200 || e.length > 200 || m.length > 5000 || !emailRe.test(e)) {
      return new Response(JSON.stringify({ error: "Champs requis manquants." }), { status: 400 });
    }

    // Configurez le transporteur SMTP (remplacez par vos infos)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_SECURE === "true", // true pour 465, false pour autres
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Petite fonction d'échappement HTML pour le corps
    const escapeHtml = (s) => s
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#39;");

    // Email à envoyer
    await transporter.sendMail({
      from: `Contact GHN <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL, // Adresse de l'admin
      subject: `Nouveau message de ${n}`,
      replyTo: e,
      text: m,
      html: `<p><b>Nom:</b> ${escapeHtml(n)}</p><p><b>Email:</b> ${escapeHtml(e)}</p><p><b>Message:</b><br/>${escapeHtml(m).replace(/\n/g, "<br/>")}</p>`
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
