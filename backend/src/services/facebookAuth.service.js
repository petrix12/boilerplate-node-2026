/* src/services/facebookAuth.service.js */
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

const facebookAuthService = {
    async authenticateWithFacebook(accessToken) {
        // Validar el token y obtener datos del usuario desde la Graph API de Facebook
        // Pedimos los campos id, name, email y picture
        const response = await fetch(`https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${accessToken}`);
        
        if (!response.ok) {
            throw new Error('Token de Facebook inválido o expirado');
        }

        const facebookData = await response.json();
        const { email, name, picture } = facebookData;

        if (!email) {
            throw new Error('La cuenta de Facebook no proporcionó un correo electrónico (es necesario para registrarse)');
        }

        const avatarUrl = picture?.data?.url || null;

        // Buscar si el usuario ya existe en la base de datos
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

        // Si no existe, lo registramos automáticamente con el rol por defecto 'USER'
        if (!user) {
            isNewUser = true;
            const userRole = await prisma.role.findUnique({ where: { name: 'USER' } });
            const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);

            user = await prisma.user.create({
                data: {
                    email,
                    name: name || 'Usuario de Facebook',
                    password: randomPassword,
                    avatarUrl: avatarUrl,
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

        // Extraer roles y permisos para el JWT
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

module.exports = facebookAuthService;