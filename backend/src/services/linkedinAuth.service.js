const prisma = require('../config/prisma');
const jwt = require('jsonwebtoken');
const bcrypt = fn => bcrypt; // (o mantén tu importación de bcryptjs como la tenías)

const generateToken = (user, roles = [], permissions = []) => {
    return jwt.sign(
        { id: user.id, email: user.email, roles, permissions },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
};

const linkedinAuthService = {
    async authenticateWithLinkedin(code) {
        // 1. Intercambiar el 'code' por el 'access_token' de LinkedIn
        //const frontendUrl = process.env.FRONTEND_URL || process.env.VITE_APP_URL || 'https://boilerplate-localhost.com';
        const frontendUrl = process.env.FRONTEND_URL;
        
        const tokenParams = new URLSearchParams({
            grant_type: 'authorization_code',
            code: code,
            client_id: process.env.SOCIAL_LINKEDIN_CLIENT_ID,
            client_secret: process.env.SOCIAL_LINKEDIN_CLIENT_SECRET,
            redirect_uri: `${frontendUrl}/auth/linkedin/callback`
        });

        const tokenResponse = await fetch('https://www.linkedin.com/oauth/v2/accessToken', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: tokenParams.toString()
        });

        if (!tokenResponse.ok) {
            throw new Error('No se pudo obtener el token de acceso de LinkedIn. Código inválido o expirado.');
        }

        const tokenData = await tokenResponse.json();
        const accessToken = tokenData.access_token;

        if (!accessToken) {
            throw new Error('LinkedIn no devolvió un token de acceso válido.');
        }

        // 2. Consultar la información del usuario usando el access_token real
        const response = await fetch('https://api.linkedin.com/v2/userinfo', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });

        if (!response.ok) {
            throw new Error('Token de LinkedIn inválido o expirado al consultar el perfil');
        }

        const linkedinData = await response.json();
        const { email, name, picture } = linkedinData;

        if (!email) {
            throw new Error('La cuenta de LinkedIn no proporcionó un correo electrónico');
        }

        // 3. Lógica de búsqueda / creación de usuario (mantén tu código de Prisma tal cual)
        let user = await prisma.user.findUnique({
            where: { email },
            include: {
                roles: {
                    include: {
                        role: {
                            include: {
                                permissions: { include: { permission: true } }
                            }
                        }
                    }
                }
            }
        });

        let isNewUser = false;

        if (!user) {
            isNewUser = true;
            const userRole = await prisma.role.findUnique({ where: { name: 'USER' } });
            const bcryptjs = require('bcryptjs');
            const randomPassword = await bcryptjs.hash(Math.random().toString(36), 10);

            user = await prisma.user.create({
                data: {
                    email,
                    name: name || 'Usuario de LinkedIn',
                    password: randomPassword,
                    avatarUrl: picture || null,
                    roles: userRole ? { create: { roleId: userRole.id } } : undefined
                },
                include: {
                    roles: {
                        include: {
                            role: {
                                include: {
                                    permissions: { include: { permission: true } }
                                }
                            }
                        }
                    }
                }
            });
        }

        if (!user.isActive) {
            throw new Error('La cuenta de usuario está desactivada');
        }

        const userRoles = user.roles.map(ur => ur.role.name);
        const permissionsSet = new Set();
        user.roles.forEach(ur => {
            ur.role.permissions.forEach(rp => {
                permissionsSet.add(rp.permission.action);
            });
        });
        const userPermissions = Array.from(permissionsSet);

        const token = generateToken(user, userRoles, userPermissions);

        return {
            isNewUser,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                avatarUrl: user.avatarUrl,
                roles: userRoles,
                permissions: userPermissions
            },
            token
        };
    }
};

module.exports = linkedinAuthService;