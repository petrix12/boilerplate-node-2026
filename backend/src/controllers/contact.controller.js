/* src/controllers/contact.controller.js */
const { sendContactEmail } = require('../services/email.service');

const submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({
                status: 'fail',
                message: 'Todos los campos son obligatorios'
            });
        }

        // Enviamos el correo al administrador/soporte utilizando el servicio centralizado
        await sendContactEmail(name, email, message);

        return res.status(200).json({
            status: 'success',
            message: 'Mensaje enviado correctamente. Nos pondremos en contacto pronto.'
        });
    } catch (error) {
        console.error('Error en submitContactForm:', error);
        return res.status(500).json({
            status: 'error',
            message: 'No se pudo enviar el mensaje. Inténtalo de más tarde.'
        });
    }
};

module.exports = { submitContactForm };