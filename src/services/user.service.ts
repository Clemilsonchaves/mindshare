import { prismaClient } from '../../prisma/prisma.js'
import { CreateUserInput, UpdateUserInput } from '../dtos/input/user.input.js'

export class UserService {
  private normalizeUser<T extends {
    password: string | null
    role?: string | null
  }>(user: T) {
    return {
      ...user,
      password: user.password ?? undefined,
      role: user.role ?? undefined,
    }
  }

  async createUser(data: CreateUserInput) {
    const findUser = await prismaClient.user.findUnique({
      where: {
        email: data.email,
      },
    })
    if (findUser) throw new Error('Usuário já cadastrado!')

    const user = await prismaClient.user.create({
      data: {
        name: data.name,
        email: data.email,
      },
    })

    return this.normalizeUser(user)
  }

  async findUser(id: string) {
    const user = await prismaClient.user.findUnique({
      where: {
        id,
      },
    })
    if (!user) throw new Error('Usuário não existe')
    return this.normalizeUser(user)
  }

  async listUsers() {
    const users = await prismaClient.user.findMany()
    return users.map((user) => this.normalizeUser(user))
  }

  async updateUser(id: string, data: UpdateUserInput) {
    const user = await prismaClient.user.findUnique({
      where: { id },
    })
    if (!user) throw new Error('Usuário não existe')

    const updatedUser = await prismaClient.user.update({
      where: { id },
      data: {
        name: data.name ?? undefined,
        role: data.role ?? undefined,
      },
    })

    return this.normalizeUser(updatedUser)
  }

  async deleteUser(id: string) {
    const user = await prismaClient.user.findUnique({
      where: { id },
    })
    if (!user) throw new Error('Usuário não existe')

    await prismaClient.user.delete({
      where: { id },
    })

    return true
  }
}
