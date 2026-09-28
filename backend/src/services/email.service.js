// src/services/email.service.js
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: process.env.MAIL_PORT,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

const sendVerificationEmail = async (toEmail, token) => {
    // Si la verificación está desactivada por la variable de entorno, salimos sin hacer nada
    if (process.env.MAIL_ENABLE_VERIFICATION !== 'true') return;

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;

    const mailOptions = {
        from: `"Soporte" <${process.env.MAIL_FROM || 'no-reply@boilerplate.com'}>`,
        to: toEmail,
        subject: 'Verifica tu cuenta de correo',
        html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                <h2>¡Bienvenido a nuestra plataforma!</h2>
                <p>Para completar tu registro y verificar tu cuenta, por favor haz clic en el siguiente botón:</p>
                <a href="${verificationUrl}" style="display: inline-block; padding: 10px 20px; background-color: #059669; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">Verificar Correo</a>
                <p style="margin-top: 20px; font-size: 12px; color: #666;">Si no solicitaste esta cuenta, puedes ignorar este mensaje.</p>
            </div>
        `,
    };

    await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };