// 📦 Charger les variables d'environnement
require('dotenv').config();
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true pour 465, false pour 587
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(to, code) {
  const verificationLink = `http://localhost:5000/api/auth/verify-email?email=${encodeURIComponent(to)}&code=${code}`;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto;">
      <h2 style="color: #2c3e50;">👋 Bonjour,</h2>
      <p>Merci pour votre inscription sur notre plateforme.</p>

      <p>Pour activer votre compte, cliquez sur le bouton ci-dessous :</p>
      <p style="text-align: center; margin: 30px 0;">
        <a href="${verificationLink}" style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">✅ Vérifier mon compte</a>
      </p>

      <p>Si le bouton ne fonctionne pas, copiez-collez ce lien dans votre navigateur :</p>
      <p style="background: #f4f4f4; padding: 10px; border-radius: 4px;">${verificationLink}</p>

      <p style="margin-top: 30px; color: #999;">Ce lien expirera dans 15 minutes.</p>

      <hr style="margin-top: 40px;">
      <p style="font-size: 12px; color: #aaa;">© ${new Date().getFullYear()} Fataf Dev - Tous droits réservés.</p>
    </div>
  `;

  const textContent = `
Bonjour,

Merci pour votre inscription !

Pour activer votre compte, cliquez ici :
${verificationLink}

Ou copiez/collez ce lien dans votre navigateur :
${verificationLink}

Ce lien expirera dans 15 minutes.

— Fataf Dev
`;

  await transporter.sendMail({
    from: `"Fataf 👨‍💻" <${process.env.EMAIL_USER}>`,
    to,
    subject: "🎉 Activez votre compte maintenant",
    text: textContent,
    html: htmlContent,
  });
}

module.exports = { sendVerificationEmail };
