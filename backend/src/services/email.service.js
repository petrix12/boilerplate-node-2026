/* src/services/email.service.js */
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const { BrevoClient } = require('@getbrevo/brevo');

// Helper interno para renderizar
const renderTemplate = (data) => {
    const filePath = path.join(__dirname, '../templates/emails/base-email.html');
    let template = fs.readFileSync(filePath, 'utf-8');

    for (const [key, value] of Object.entries(data)) {
        const regex = new RegExp(`{{${key}}}`, 'g');
        template = template.replace(regex, value || '');
    }
    return template;
};

// Configuración común de transporte
const getEmailConfig = () => {
    return {
        appName: process.env.APP_NAME || 'Plataforma',
        logoUrl: process.env.APP_LOGO_URL || 'https://via.placeholder.com/48?text=App',
        senderEmail: process.env.MAIL_FROM || 'no-reply@boilerplate.com',
        mailDriver: process.env.MAIL_CONNECTION || 'smtp',
        frontendUrl: process.env.FRONTEND_URL || 'http://localhost:5173'
    };
};

// 1. Configuración de la estrategia SMTP (Nodemailer global)
const transporter = nodemailer.createTransport({
    host: process.env.MAIL_HOST,
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
});

// 2. Configuración de la estrategia API HTTP (Brevo Client unificado)
let brevoApiClient = null;
if (process.env.MAIL_CONNECTION === 'api') {
    brevoApiClient = new BrevoClient({
        apiKey: process.env.MAIL_PASS,
    });
}

// Función genérica para despachar vía SMTP o API de Brevo
const dispatchEmail = async (toEmail, userName, subject, htmlContent, config) => {
    if (config.mailDriver === 'api') {
        try {
            await brevoApiClient.transactionalEmails.sendTransacEmail({
                subject: subject,
                htmlContent: htmlContent,
                sender: { name: `${config.appName} Soporte`, email: config.senderEmail },
                to: [{ email: toEmail, name: userName }],
            });
            console.log(`[Email API] Correo enviado exitosamente a ${toEmail}`);
            return true;
        } catch (error) {
            console.error('[Email API Error] Falló el envío por API:', error);
            throw new Error('No se pudo enviar el correo mediante API');
        }
    } else {
        const mailOptions = {
            from: `"${config.appName} Soporte" <${config.senderEmail}>`,
            to: toEmail,
            subject: subject,
            html: htmlContent,
        };

        try {
            await transporter.sendMail(mailOptions);
            console.log(`[Email SMTP] Correo enviado exitosamente a ${toEmail}`);
            return true;
        } catch (error) {
            console.error('[Email SMTP Error] Falló el envío por SMTP:', error);
            throw new Error('No se pudo enviar el correo mediante SMTP');
        }
    }
};

const sendVerificationEmail = async (toEmail, token, userName = 'Usuario') => {
    if (process.env.MAIL_ENABLE_VERIFICATION !== 'true') return;

    const config = getEmailConfig();
    const verificationUrl = `${config.frontendUrl}/verify-email?token=${token}`;
    const subject = `Verifica tu correo en ${config.appName}`;

    const htmlContent = renderTemplate({
        subject,
        appName: config.appName,
        logoUrl: config.logoUrl,
        heading: `¡Bienvenido, ${userName}!`,
        bodyText: `Nos alegra mucho que te hayas registrado. Para garantizar la seguridad de tu cuenta y completar el acceso, por favor confirma tu dirección de correo electrónico haciendo clic en el siguiente botón:`,
        actionText: 'Verificar mi Correo',
        actionUrl: verificationUrl,
        securityNotice: `Si no solicitaste crear una cuenta en ${config.appName}, puedes ignorar este mensaje con total tranquilidad.`
    });

    await dispatchEmail(toEmail, userName, subject, htmlContent, config);
};

const sendPasswordResetEmail = async (toEmail, token, userName = 'Usuario') => {
    const config = getEmailConfig();
    const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;
    const subject = `Recupera tu contraseña en ${config.appName}`;

    const htmlContent = renderTemplate({
        subject,
        appName: config.appName,
        logoUrl: config.logoUrl,
        heading: `Recuperación de contraseña`,
        bodyText: `Hola <strong>${userName}</strong>,<br><br>Has solicitado restablecer tu contraseña. Haz clic en el siguiente botón para continuar con el proceso:`,
        actionText: 'Restablecer Contraseña',
        actionUrl: resetUrl,
        securityNotice: `Si no solicitaste este cambio, puedes ignorar este correo de forma segura. Tu contraseña actual no sufrirá cambios.`
    });

    await dispatchEmail(toEmail, userName, subject, htmlContent, config);
};

const sendContactEmail = async (contactName, contactEmail, contactMessage) => {
    const config = getEmailConfig();
    const adminEmail = process.env.MAIL_FROM || 'admin@boilerplate.com'; // O un correo de soporte específico
    const subject = `Nuevo mensaje de contacto de ${contactName} (${config.appName})`;

    const htmlContent = renderTemplate({
        subject,
        appName: config.appName,
        logoUrl: config.logoUrl,
        heading: `Nuevo mensaje recibido`,
        bodyText: `Has recibido un nuevo mensaje a través del formulario de contacto de la plataforma:<br><br>` +
                  `<strong>Nombre:</strong> ${contactName}<br>` +
                  `<strong>Correo:</strong> ${contactEmail}<br><br>` +
                  `<strong>Mensaje:</strong><br><em>"${contactMessage}"</em>`,
        actionText: 'Responder al usuario',
        actionUrl: `mailto:${contactEmail}`,
        securityNotice: `Este mensaje fue enviado desde el formulario público de soporte de ${config.appName}.`
    });

    await dispatchEmail(adminEmail, 'Administrador', subject, htmlContent, config);
};

module.exports = { sendVerificationEmail, sendPasswordResetEmail, sendContactEmail };