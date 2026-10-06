/* src/middlewares/instagramEnabled.middleware.js */
const checkInstagramAuthEnabled = (req, res, next) => {
    const clientId = process.env.SOCIAL_INSTAGRAM_CLIENT_ID;
    const clientSecret = process.env.SOCIAL_INSTAGRAM_CLIENT_SECRET;

    if (!clientId || clientId.trim() === '' || !clientSecret || clientSecret.trim() === '') {
        return res.status(404).json({
            status: 'fail',
            message: 'El inicio de sesión con Instagram no está habilitado.'
        });
    }
    next();
};

module.exports = { checkInstagramAuthEnabled };