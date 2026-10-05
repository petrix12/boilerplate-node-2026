/* src/middlewares/linkedinEnabled.middleware.js */
const checkLinkedinAuthEnabled = (req, res, next) => {
    const clientId = process.env.SOCIAL_LINKEDIN_CLIENT_ID;
    const clientSecret = process.env.SOCIAL_LINKEDIN_CLIENT_SECRET;

    if (!clientId || clientId.trim() === '' || !clientSecret || clientSecret.trim() === '') {
        return res.status(404).json({
            status: 'fail',
            message: 'El inicio de sesión con LinkedIn no está habilitado.'
        });
    }
    next();
};

module.exports = { checkLinkedinAuthEnabled };