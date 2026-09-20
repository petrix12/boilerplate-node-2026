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

const googleAuthService = {
    async authenticateWithGoogle(idToken) {
        // Validar el token directamente con Google
        const response = await fetch(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`);
        if (!response.ok) {
            throw new Error('Token de Google inválido o expirado');
        }

        const googleData = await response.json();
        const { email, name, picture, aud } = googleData;

        // Validar que el token corresponda a nuestro Client ID
        if (aud !== process.env.GOOGLE_CLIENT_ID) {
            throw new Error('El token de Google no pertenece a esta aplicación');
        }

        if (!email) {
            throw new Error('La cuenta de Google no proporcionó un correo electrónico');
        }

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

        // Si no existe, lo registramos automáticamente con el rol por defecto 'USER'
        if (!user) {
            const userRole = await prisma.role.findUnique({ where: { name: 'USER' } });
            const randomPassword = await bcrypt.hash(Math.random().toString(36), 10);

            user = await prisma.user.create({
                data: {
                    email,
                    name: name || 'Usuario de Google',
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

module.exports = googleAuthService;