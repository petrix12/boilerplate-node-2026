const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const { getClientIp } = require('../utils/request.utils');

const generateToken = (user, roles = [], permissions = []) => {
    return jwt.sign(
        { id: user.id, email: user.email, roles, permissions },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '24h' }
    );
};

const register = async (req, res) => {
    try {
        const { email, password, firstName, lastName } = req.body;
        const fullName = `${firstName} ${lastName}`;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ status: 'fail', message: 'El correo electrónico ya está registrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: { email, password: passwordHash, name: fullName },
            select: { id: true, email: true, name: true, avatarUrl: true, createdAt: true },
        });

        const token = generateToken(newUser, []);

        return res.status(201).json({
            status: 'success',
            message: 'Usuario registrado correctamente',
            data: { user: { ...newUser, roles: [] }, token },
        });
    } catch (error) {
        console.error('Error en registro:', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.user.findUnique({
            where: { email },
            include: { 
                roles: { 
                    include: { 
                        role: { 
                            include: { 
                                permissions: { 
                                    include: { permission: true } 
                                } 
                            } 
                        } 
                    } 
                } 
            },
        });

        if (!user || !user.isActive) {
            if (!user) {
                await prisma.auditLog.create({
                    data: {
                        action: 'LOGIN_FAILED',
                        entity: 'Auth',
                        ipAddress: getClientIp(req),
                        details: JSON.stringify({ email, reason: 'Usuario no encontrado' }),
                    },
                });
            }
            return res.status(401).json({ status: 'fail', message: 'Credenciales inválidas o cuenta desactivada' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            await prisma.auditLog.create({
                data: {
                    action: 'LOGIN_FAILED',
                    entity: 'Auth',
                    ipAddress: getClientIp(req),
                    details: JSON.stringify({ email, reason: 'Contraseña incorrecta' }),
                },
            });
            return res.status(401).json({ status: 'fail', message: 'Credenciales inválidas' });
        }

        const userRoles = user.roles.map((ur) => ur.role.name);

        // Extraer lista plana de permisos sin duplicados
        const permissionsSet = new Set();
        user.roles.forEach((ur) => {
            if (ur.role && ur.role.permissions) {
                ur.role.permissions.forEach((rp) => {
                    if (rp.permission && rp.permission.action) {
                        permissionsSet.add(rp.permission.action);
                    }
                });
            }
        });
        const userPermissions = Array.from(permissionsSet);

        const token = generateToken(user, userRoles, userPermissions);

        await prisma.auditLog.create({
            data: {
                action: 'LOGIN_SUCCESS',
                entity: 'Auth',
                entityId: String(user.id),
                ipAddress: getClientIp(req),
                user: { connect: { id: user.id } },
                details: JSON.stringify({ ip: req.ip, userAgent: req.headers['user-agent'] }),
            },
        });

        return res.status(200).json({
            status: 'success',
            message: 'Inicio de sesión exitoso',
            data: {
                user: { 
                    id: user.id, 
                    email: user.email, 
                    name: user.name, 
                    avatarUrl: user.avatarUrl, 
                    roles: userRoles, 
                    permissions: userPermissions 
                },
                token,
            },
        });
    } catch (error) {
        console.error('Error en login:', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

const getMe = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            include: {
                roles: {
                    include: {
                        role: {
                            include: {
                                permissions: {
                                    include: { permission: true }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!user) return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });

        const userRoles = user.roles.map((ur) => ur.role.name);

        const permissionsSet = new Set();
        user.roles.forEach((ur) => {
            if (ur.role && ur.role.permissions) {
                ur.role.permissions.forEach((rp) => {
                    if (rp.permission && rp.permission.action) {
                        permissionsSet.add(rp.permission.action);
                    }
                });
            }
        });
        const userPermissions = Array.from(permissionsSet);

        // Evaluar si la IA está habilitada comprobando la variable de entorno
        const isAiEnabled = !!process.env.AI_API_KEY && process.env.AI_API_KEY.trim() !== '';        

        return res.status(200).json({
            status: 'success',
            data: { 
                user: { 
                    id: user.id, 
                    email: user.email, 
                    name: user.name, 
                    avatarUrl: user.avatarUrl, 
                    roles: userRoles, 
                    permissions: userPermissions,
                    createdAt: user.createdAt 
                },
                features: {
                    aiDiagnostic: isAiEnabled
                }
            },
        });
    } catch (error) {
        console.error('Error en getMe:', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

const logout = async (req, res) => {
    try {
        if (req.user?.id) {
            await prisma.auditLog.create({
                data: {
                    action: 'LOGOUT',
                    entity: 'Auth',
                    entityId: String(req.user.id),
                    ipAddress: getClientIp(req),
                    user: { connect: { id: req.user.id } },
                    details: JSON.stringify({ ip: req.ip }),
                },
            });
        }
        return res.status(200).json({ status: 'success', message: 'Sesión cerrada correctamente' });
    } catch (error) {
        console.error('Error en logout:', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

module.exports = { register, login, getMe, logout };