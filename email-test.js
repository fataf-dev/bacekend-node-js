const nodemailer = require("nodemailer");

// 🔒 Identifiants Gmail avec mot de passe d'application
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // false pour port 587
  auth: {
    user: "fataf1391@gmail.com",
    pass: "zftxornpxhzlnlxk", // nouveau mot de passe d’application (sans espaces)
  },
});

// 📤 Fonction pour envoyer un e-mail
const sendTestEmail = async () => {
  try {
    const info = await transporter.sendMail({
      from: '"Fataf 👨‍💻" <fataf1391@gmail.com>',
      to: "fataf1391@gmail.com",
      subject: "✅ Test Nodemailer + Gmail",
      text: "Ceci est un test d'envoi d'email avec Gmail et Node.js",
      html: "<b>Bravo !</b> Ça fonctionne 😎",
    });

    console.log("✅ Email envoyé avec succès !");
    console.log("📨 ID du message :", info.messageId);
  } catch (error) {
    console.error("❌ Échec de l'envoi de l'email :", error);
  }
};

sendTestEmail();
