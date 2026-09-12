const prisma = require('../config/prisma');

async function seedRolesAndPermissions() {
    console.log('🌱 Iniciando la carga de roles y permisos iniciales...');

    // 1. Definición de Roles
    const roles = [
        { name: 'SUPER_ADMIN', description: 'Acceso total y gestión del sistema' },
        { name: 'ADMIN', description: 'Administrador de contenido y usuarios' },
        { name: 'USER', description: 'Usuario estándar registrado' },
    ];

    for (const role of roles) {
        await prisma.role.upsert({
            where: { name: role.name },
            update: { description: role.description },
            create: role,
        });
    }

    console.log('✅ Roles creados/verificados.');

    // 2. Definición de Permisos Catálogo
    const permissions = [
        // Acceso Global al Dashboard Admin
        { action: 'admin:access', module: 'admin', description: 'Permite acceder al panel de administración' },

        // Módulo de Usuarios
        { action: 'users:read', module: 'users', description: 'Permite ver el listado y detalle de usuarios' },
        { action: 'users:create', module: 'users', description: 'Permite registrar nuevos usuarios' },
        { action: 'users:update', module: 'users', description: 'Permite editar datos de usuarios existentes' },
        { action: 'users:delete', module: 'users', description: 'Permite eliminar usuarios' },
        
        // Módulo de Roles y Permisos
        { action: 'roles:read', module: 'roles', description: 'Permite ver la lista de roles y sus permisos' },
        { action: 'roles:create', module: 'roles', description: 'Permite crear nuevos roles' },
        { action: 'roles:update', module: 'roles', description: 'Permite modificar roles y asignar permisos' },
        { action: 'roles:delete', module: 'roles', description: 'Permite eliminar roles' },

        // Módulo de Auditoría y Logs de Aplicación
        { action: 'audit:read', module: 'audit', description: 'Permite ver el historial de auditoría y actividades' },

        // Módulo de Monitoreo y Logs del Sistema (Backend, DB)
        { action: 'system:logs:read', module: 'system', description: 'Permite consultar logs técnicos del servidor y la base de datos' },
    ];
    
    for (const perm of permissions) {
        await prisma.permission.upsert({
            where: { action: perm.action },
            update: { description: perm.description, module: perm.module },
            create: perm,
        });
    }

    console.log('✅ Catálogo de permisos actualizado.');  
}

// Ejecutar si se invoca directamente por CLI
if (require.main === module) {
    seedRolesAndPermissions()
        .catch((e) => {
            console.error('❌ Error ejecutando el seed:', e);
            process.exit(1);
        })
        .finally(async () => {
            await prisma.$disconnect();
        });
}

module.exports = seedRolesAndPermissions;