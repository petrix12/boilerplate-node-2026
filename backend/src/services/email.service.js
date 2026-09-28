// src/services/email.service.js
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false, // Requerido para STARTTLS en el puerto 587
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendVerificationEmail = async (toEmail, token, userName = 'Usuario') => {
    // Si la verificación está desactivada por la variable de entorno, salimos sin hacer nada
    if (process.env.MAIL_ENABLE_VERIFICATION !== 'true') return;

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;
    const appName = process.env.APP_NAME || 'Plataforma';
    // Logo público accesible por internet (Mailtrap o tu cliente de correo necesita una URL absoluta real)
    const logoUrl = process.env.APP_LOGO_URL || 'https://via.placeholder.com/48?text=App';

    // Leer la plantilla HTML desde el archivo físico
    const templatePath = path.join(__dirname, '../templates/emails/verification.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Reemplazar las etiquetas dinámicas de la plantilla
    htmlTemplate = htmlTemplate
        .replace(/{{appName}}/g, appName)
        .replace(/{{userName}}/g, userName)
        .replace(/{{verificationUrl}}/g, verificationUrl)
        .replace(/{{logoUrl}}/g, logoUrl);

    const mailOptions = {
        from: `"${appName} Soporte" <${process.env.MAIL_FROM || 'no-reply@boilerplate.com'}>`,
        to: toEmail,
        subject: `Verifica tu cuenta en ${appName}`,
        html: htmlTemplate,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };