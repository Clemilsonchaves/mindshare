import { prismaClient } from '../../prisma/prisma.js'
import { CreateIdeaInput, UpdateIdeaInput } from '../dtos/input/idea.input.js'

export class IdeaService {
  private normalizeIdea<T extends { description: string | null }>(idea: T) {
    return {
      ...idea,
      description: idea.description ?? undefined,
    }
  }

  async createIdea(data: CreateIdeaInput, authorId: string) {
    const idea = await prismaClient.idea.create({
      data: {
        title: data.title,
        description: data.description,
        authorId: authorId,
      },
    })

    return this.normalizeIdea(idea)
  }

  async listIdeas() {
    const ideas = await prismaClient.idea.findMany()
    return ideas.map((idea) => this.normalizeIdea(idea))
  }

  async deleteIdea(id: string) {
    const findIdea = await prismaClient.idea.findUnique({
      where: {
        id,
      },
    })
    if (!findIdea) throw new Error('Ideia não encontrada')
    return prismaClient.idea.delete({
      where: {
        id,
      },
    })
  }

  async findIdeaById(id: string) {
    return prismaClient.idea.findUnique({
      where: {
        id,
      },
    })
  }

  async getIdea(id: string) {
    const idea = await prismaClient.idea.findUnique({
      where: {
        id,
      },
    })

    if (!idea) throw new Error('Ideia não encontrada')

    return this.normalizeIdea(idea)
  }

  async updateIdea(id: string, data: UpdateIdeaInput) {
    const idea = await prismaClient.idea.findUnique({
      where: {
        id,
      },
    })

    if (!idea) throw new Error('Ideia não encontrada')

    const updatedIdea = await prismaClient.idea.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
      },
    })

    return this.normalizeIdea(updatedIdea)
  }
}
