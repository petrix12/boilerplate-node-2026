/* src/middlewares/facebookEnabled.middleware.js */
const checkFacebookAuthEnabled = (req, res, next) => {
    const appId = process.env.SOCIAL_META_CLIENT_ID;
    const appSecret = process.env.SOCIAL_META_CLIENT_SECRET;

    if (!appId || appId.trim() === '' || !appSecret || appSecret.trim() === '') {
        return res.status(404).json({
            status: 'fail',
            message: 'El inicio de sesión con Facebook no está habilitado.'
        });
    }
    next();
};

module.exports = { checkFacebookAuthEnabled };