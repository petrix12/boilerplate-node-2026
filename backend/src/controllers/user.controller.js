const bcrypt = require('bcryptjs');
const path = require('path');
const { PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { s3Client, ensureBucketExists } = require('../config/s3');
const prisma = require('../config/prisma');

// Helper interno para S3
const deleteExistingS3File = async (publicUrl) => {
    if (!publicUrl) return;
    try {
        const bucketName = process.env.S3_BUCKET_NAME || 'app-uploads';
        const s3PublicBaseUrl = `${process.env.S3_PUBLIC_URL}/`;
        if (publicUrl.startsWith(s3PublicBaseUrl)) {
            const key = publicUrl.replace(s3PublicBaseUrl, '');
            await s3Client.send(new DeleteObjectCommand({ Bucket: bucketName, Key: key }));
        }
    } catch (err) {
        console.warn('⚠️ No se pudo eliminar la imagen anterior en S3:', err.message);
    }
};

// Listar usuarios (búsqueda + paginación + ordenamiento)
const getUsers = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const where = search
            ? {
                OR: [
                    { name: { contains: search, mode: 'insensitive' } },
                    { email: { contains: search, mode: 'insensitive' } },
                ],
            }
            : {};

        const allowedSortFields = ['name', 'email', 'createdAt'];
        const validSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
        const validSortOrder = ['asc', 'desc'].includes(sortOrder.toLowerCase()) ? sortOrder.toLowerCase() : 'desc';

        const [total, users] = await prisma.$transaction([
            prisma.user.count({ where }),
            prisma.user.findMany({
                where,
                skip,
                take: parseInt(limit),
                orderBy: [{ [validSortBy]: validSortOrder }, { id: 'asc' }],
                select: {
                    id: true,
                    name: true,
                    email: true,
                    avatarUrl: true,
                    isActive: true,
                    createdAt: true,
                    roles: { select: { role: { select: { name: true } } } },
                },
            }),
        ]);

        const formattedUsers = users.map((u) => ({
            ...u,
            roles: u.roles.map((r) => r.role.name),
        }));

        return res.status(200).json({
            status: 'success',
            data: {
                users: formattedUsers,
                pagination: {
                    total,
                    page: parseInt(page),
                    totalPages: Math.ceil(total / parseInt(limit)),
                },
            },
        });
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// Crear usuario
const createUser = async (req, res) => {
    try {
        const { name, email, password, role = 'USER' } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ status: 'fail', message: 'El correo electrónico ya existe' });
        }

        const roleObj = await prisma.role.findUnique({ where: { name: role } });
        if (!roleObj) {
            return res.status(400).json({ status: 'fail', message: `El rol ${role} no existe` });
        }

        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: passwordHash,
                roles: { create: { roleId: roleObj.id } },
            },
            select: { id: true, email: true, name: true, createdAt: true },
        });

        return res.status(201).json({ status: 'success', data: { user: newUser } });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// Actualizar usuario por ID
const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, password } = req.body;

        const existingUser = await prisma.user.findUnique({ where: { id } });
        if (!existingUser) {
            return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });
        }

        if (email && email !== existingUser.email) {
            const emailTaken = await prisma.user.findUnique({ where: { email } });
            if (emailTaken) {
                return res.status(400).json({ status: 'fail', message: 'El correo electrónico ya está en uso' });
            }
        }

        const updateData = {
            name: name || existingUser.name,
            email: email || existingUser.email,
        };

        if (password && password.trim() !== '') {
            const salt = await bcrypt.genSalt(10);
            updateData.password = await bcrypt.hash(password, salt);
        }

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                avatarUrl: true,
                isActive: true,
                createdAt: true,
                roles: { select: { role: { select: { name: true } } } },
            },
        });

        return res.status(200).json({
            status: 'success',
            message: 'Usuario actualizado correctamente',
            data: { user: { ...updatedUser, roles: updatedUser.roles.map((r) => r.role.name) } },
        });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// Asignar roles a un usuario
const updateUserRoles = async (req, res) => {
    try {
        const { id } = req.params;
        const { roles } = req.body;

        await prisma.userRole.deleteMany({ where: { userId: id } });

        if (roles && roles.length > 0) {
            const dbRoles = await prisma.role.findMany({ where: { name: { in: roles } } });
            const userRolesData = dbRoles.map((role) => ({ userId: id, roleId: role.id }));
            await prisma.userRole.createMany({ data: userRolesData });
        }

        return res.status(200).json({ status: 'success', message: 'Roles actualizados correctamente' });
    } catch (error) {
        console.error('Error al actualizar roles de usuario:', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// Eliminar usuario
const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        if (req.user.id === id) {
            return res.status(400).json({ status: 'fail', message: 'No puedes eliminar tu propia cuenta' });
        }

        await prisma.userRole.deleteMany({ where: { userId: id } });
        await prisma.user.delete({ where: { id } });

        return res.status(200).json({ status: 'success', message: 'Usuario eliminado correctamente' });
    } catch (error) {
        console.error('Error al eliminar usuario:', error);
        return res.status(500).json({ status: 'error', message: 'Error al eliminar el usuario' });
    }
};

// Actualizar perfil del usuario autenticado (/me)
const updateProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, currentPassword, newPassword } = req.body;

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });

        const updateData = {};
        if (name && name.trim() !== '') updateData.name = name.trim();

        if (newPassword) {
            if (!currentPassword) {
                return res.status(400).json({ status: 'fail', message: 'Debes proporcionar la contraseña actual.' });
            }
            const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isPasswordValid) {
                return res.status(400).json({ status: 'fail', message: 'La contraseña actual es incorrecta.' });
            }
            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: updateData,
            select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true },
        });

        return res.status(200).json({ status: 'success', message: 'Perfil actualizado correctamente', data: { user: updatedUser } });
    } catch (error) {
        console.error('Error en updateProfile:', error);
        return res.status(500).json({ status: 'error', message: 'Error interno del servidor' });
    }
};

// Subir Avatar
const uploadAvatar = async (req, res) => {
    try {
        const userId = req.user.id;
        if (!req.file) return res.status(400).json({ status: 'fail', message: 'No se ha adjuntado ninguna imagen' });

        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });

        const bucketName = process.env.S3_BUCKET_NAME || 'app-uploads';
        await ensureBucketExists(bucketName);

        if (user.avatarUrl) await deleteExistingS3File(user.avatarUrl);

        const fileExt = path.extname(req.file.originalname);
        const fileName = `avatars/user_${userId}_${Date.now()}${fileExt}`;

        await s3Client.send(new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            Body: req.file.buffer,
            ContentType: req.file.mimetype,
        }));

        const publicUrl = `${process.env.S3_PUBLIC_URL}/${fileName}`;

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { avatarUrl: publicUrl },
            select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true },
        });

        return res.status(200).json({ status: 'success', message: 'Avatar actualizado', data: { user: updatedUser } });
    } catch (error) {
        console.error('Error en uploadAvatar:', error);
        return res.status(500).json({ status: 'error', message: 'Error al procesar la imagen' });
    }
};

// Eliminar Avatar
const deleteAvatar = async (req, res) => {
    try {
        const userId = req.user.id;
        const user = await prisma.user.findUnique({ where: { id: userId } });
        if (!user) return res.status(404).json({ status: 'fail', message: 'Usuario no encontrado' });

        if (user.avatarUrl) await deleteExistingS3File(user.avatarUrl);

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { avatarUrl: null },
            select: { id: true, name: true, email: true, avatarUrl: true, createdAt: true },
        });

        return res.status(200).json({ status: 'success', message: 'Avatar eliminado', data: { user: updatedUser } });
    } catch (error) {
        console.error('Error en deleteAvatar:', error);
        return res.status(500).json({ status: 'error', message: 'Error al eliminar el avatar' });
    }
};

module.exports = {
    getUsers,
    createUser,
    updateUser,
    updateUserRoles,
    deleteUser,
    updateProfile,
    uploadAvatar,
    deleteAvatar,
}; 