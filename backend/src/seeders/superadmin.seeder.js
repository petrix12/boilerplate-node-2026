const bcrypt = require('bcryptjs');
const prisma = require('../config/prisma');
require('dotenv').config();

const seedSuperAdmin = async () => {
    try {
        console.log('🌱 Iniciando Seeder de SuperAdmin...');

        const adminEmail = process.env.SUPER_ADMIN_EMAIL || 'admin@boilerplate.com';
        const adminPassword = process.env.SUPER_ADMIN_PASSWORD;

        if (!adminPassword) {
            throw new Error('❌ Error: Debes definir SUPER_ADMIN_PASSWORD en tu archivo .env');
        }

        // 1. Verificar que el rol SUPER_ADMIN exista (sembrado previamente por role-permission.seeder.js)
        const superAdminRole = await prisma.role.findUnique({
            where: { name: 'SUPER_ADMIN' },
        });

        if (!superAdminRole) {
            throw new Error('❌ El rol SUPER_ADMIN no existe. Ejecuta primero el seeder de Roles y Permisos.');
        }

        // 2. Comprobar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
            where: { email: adminEmail },
            include: { roles: true },
        });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(adminPassword, salt);

        if (!existingUser) {
            // Crear usuario con el rol de SuperAdmin
            const adminUser = await prisma.user.create({
                data: {
                    name: 'Super Admin',
                    email: adminEmail,
                    password: hashedPassword,
                    roles: {
                        create: {
                            roleId: superAdminRole.id,
                        },
                    },
                },
            });
            console.log(`✅ SuperAdmin creado con éxito: ${adminUser.email}`);
        } else {
            // Asegurar que tenga el rol asignado si ya existía el usuario
            const hasRole = existingUser.roles.some((r) => r.roleId === superAdminRole.id);
            if (!hasRole) {
                await prisma.userRole.create({
                    data: {
                        userId: existingUser.id,
                        roleId: superAdminRole.id,
                    },
                });
            }
            console.log(`👤 SuperAdmin verificado: ${existingUser.email}`);
        }
    } catch (error) {
        console.error('❌ Error ejecutando el Seeder de SuperAdmin:', error.message);
        throw error;
    }
};

if (require.main === module) {
    seedSuperAdmin()
        .catch(() => process.exit(1))
        .finally(async () => {
            await prisma.$disconnect();
        });
}

module.exports = seedSuperAdmin;