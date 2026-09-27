import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
import { Role } from '../src/models/user.model.js'

const prisma = new PrismaClient()

const hashPassword = async (plainPassword: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10)
  return bcrypt.hash(plainPassword, salt)
}

async function main() {
  console.log('🌱 Iniciando seed...')

  // Verificar se o usuário admin já existe
  const existingAdmin = await prisma.user.findUnique({
    where: {
      email: 'admin@mindshare.com',
    },
  })

  if (existingAdmin) {
    console.log('✅ Usuário admin já existe, atualizando para admin...')
    await prisma.user.update({
      where: {
        email: 'admin@mindshare.com',
      },
      data: {
        role: Role.admin,
      },
    })
    console.log('✅ Usuário admin atualizado com sucesso!')
  } else {
    // Criar usuário admin
    const hashedPassword = await hashPassword('admin123')

    const admin = await prisma.user.create({
      data: {
        name: 'Administrador',
        email: 'admin@mindshare.com',
        password: hashedPassword,
        role: Role.admin,
      },
    })

    console.log('✅ Usuário admin criado com sucesso!')
    console.log('📧 Email: admin@mindshare.com')
    console.log('🔑 Senha: admin123')
    console.log('👤 ID:', admin.id)
  }

  console.log('✨ Seed concluído!')
}

main()
  .catch((e) => {
    console.error('❌ Erro ao executar seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

