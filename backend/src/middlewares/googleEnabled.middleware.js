const checkGoogleAuthEnabled = (req, res, next) => {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;

    if (!clientId || clientId.trim() === '' || !clientSecret || clientSecret.trim() === '') {
        return res.status(404).json({
            status: 'fail',
            message: 'El inicio de sesión con Google no está habilitado.'
        });
    }
    next();
};

module.exports = { checkGoogleAuthEnabled };