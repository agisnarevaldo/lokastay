const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')

const prisma = new PrismaClient()

async function main() {
    const adminEmail = 'admin@lokastay.com'
    const adminPassword = 'adminpassword123' // You should use a strong password in production

    const hashedPassword = await bcrypt.hash(adminPassword, 10)

    const admin = await prisma.user.upsert({
        where: { email: adminEmail },
        update: {
            isAdmin: true,
            role: 'ADMIN',
            password: hashedPassword,
        },
        create: {
            email: adminEmail,
            name: 'Admin User',
            password: hashedPassword,
            isAdmin: true,
            role: 'ADMIN',
        },
    })

    console.log(`Admin user created/updated: ${admin.email}`)
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })