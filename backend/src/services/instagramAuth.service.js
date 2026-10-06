/* src/services/instagramAuth.service.js */
const prisma = require('../config/prisma');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const generateToken = (user, roles = [], permissions = []) => {
    return jwt.sign(
        { id: user.id, email: user.email, roles, permissions },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
};

const instagramAuthService = {
    async authenticateWithInstagram(accessToken) {
        // Consultar a la Graph API pidiendo también el email
        const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email&access_token=${accessToken}`);
        
        if (!response.ok) {
            throw new Error('Token de Instagram inválido o expirado');
        }

        const instagramData = await response.json();
        const { id, name: accountName, email: socialEmail } = instagramData;

        if (!id) {
            throw new Error('No se pudo obtener el identificador de la cuenta de usuario');
        }

        // Si Meta devuelve un correo real, lo usamos; si viene vacío, usamos el sintético
        const email = socialEmail || `${id}@instagram.oauth.local`;
        const name = accountName ? `Usuario (${accountName})` : 'Usuario de Instagram';

        // Buscar si el usuario ya existe por su email (ya sea el real o el sintético anterior)
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
            const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);

            user = await prisma.user.create({
                data: {
                    email,
                    name,
                    password: randomPassword,
                    avatarUrl: null,
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

module.exports = instagramAuthService;