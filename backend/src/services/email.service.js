// src/services/email.service.js
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { BrevoClient } = require('@getbrevo/brevo');

// 1. Configuración de la estrategia SMTP (Nodemailer)
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false, // Requerido para STARTTLS en el puerto 587
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// 2. Configuración de la estrategia API HTTP (Brevo Client unificado)
let brevoApiClient = null;
if (process.env.MAIL_CONNECTION === 'api') {
    brevoApiClient = new BrevoClient({
        apiKey: process.env.MAIL_PASS, // Reutilizamos MAIL_PASS para la API Key
    });
}

const sendVerificationEmail = async (toEmail, token, userName = 'Usuario') => {
    // Si la verificación está desactivada por la variable de entorno, salimos sin hacer nada
    if (process.env.MAIL_ENABLE_VERIFICATION !== 'true') return;

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const verificationUrl = `${frontendUrl}/verify-email?token=${token}`;
    const appName = process.env.APP_NAME || 'Plataforma';
    const logoUrl = process.env.APP_LOGO_URL || 'https://via.placeholder.com/48?text=App';
    const senderEmail = process.env.MAIL_FROM || 'no-reply@boilerplate.com';
    const mailDriver = process.env.MAIL_CONNECTION || 'smtp';

    // Leer la plantilla HTML desde el archivo físico
    const templatePath = path.join(__dirname, '../templates/emails/verification.html');
    let htmlTemplate = fs.readFileSync(templatePath, 'utf-8');

    // Reemplazar las etiquetas dinámicas de la plantilla
    htmlTemplate = htmlTemplate
        .replace(/{{appName}}/g, appName)
        .replace(/{{userName}}/g, userName)
        .replace(/{{verificationUrl}}/g, verificationUrl)
        .replace(/{{logoUrl}}/g, logoUrl);

    const subject = `Verifica tu cuenta en ${appName}`;

    // Estrategia A: Envío mediante API HTTP (Puerto 443 - Ideal para Render)
    if (mailDriver === 'api') {
        try {
            await brevoApiClient.transactionalEmails.sendTransacEmail({
                subject: subject,
                htmlContent: htmlTemplate,
                sender: { name: `${appName} Soporte`, email: senderEmail },
                to: [{ email: toEmail, name: userName }],
            });
            console.log(`[Email API] Correo enviado exitosamente a ${toEmail}`);
            return true;
        } catch (error) {
            console.error('[Email API Error] Falló el envío por API:', error);
            throw new Error('No se pudo enviar el correo de verificación mediante API');
        }
    } 
    
    // Estrategia B: Envío tradicional mediante SMTP (Nodemailer)
    else {
        const mailOptions = {
            from: `"${appName} Soporte" <${senderEmail}>`,
            to: toEmail,
            subject: subject,
            html: htmlTemplate,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`[Email SMTP] Correo enviado exitosamente a ${toEmail}`);
            return true;
        } catch (error) {
            console.error('[Email SMTP Error] Falló el envío por SMTP:', error);
            throw new Error('No se pudo enviar el correo de verificación mediante SMTP');
        }
    }
};

module.exports = { sendVerificationEmail };