import nodemailer from "nodemailer";

export async function POST(req) {
  try {
    const { name, email, message } = await req.json();
    if (!name || !email || !message) {
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

    // Email à envoyer
    await transporter.sendMail({
      from: `Contact GHN <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL, // Adresse de l'admin
      subject: `Nouveau message de ${name}`,
      replyTo: email,
      text: message,
      html: `<p><b>Nom:</b> ${name}</p><p><b>Email:</b> ${email}</p><p><b>Message:</b><br/>${message}</p>`
    });

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
}
