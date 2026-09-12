const prisma = require('../src/config/prisma');
const seedRolesAndPermissions = require('../src/seeders/role-permission.seeder');
const seedSuperAdmin = require('../src/seeders/superadmin.seeder');

async function main() {
    console.log('🚀 === INICIANDO EJECUCIÓN DE SEEDERS ===\n');
    
    // 1. Ejecutar catálogo RBAC
    await seedRolesAndPermissions();
    console.log('----------------------------------------');
    
    // 2. Ejecutar SuperAdmin
    await seedSuperAdmin();
    console.log('----------------------------------------');
    
    console.log('\n✨ === SEEDERS EJECUTADOS CON ÉXITO ===');
}

main()
    .catch((e) => {
        console.error('❌ Error fatal durante el proceso de seed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });