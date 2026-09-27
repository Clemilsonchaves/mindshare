import { Arg, FieldResolver, Mutation, Resolver, Root, UseMiddleware } from 'type-graphql'
import { VoteModel } from '../models/vote.model.js'
import { GqlUser } from '../graphql/decorators/user.decorator.js'
import { User } from '@prisma/client'
import { VoteService } from '../services/vote.service.js'
import { IdeaModel } from '../models/idea.model.js'
import { IdeaService } from '../services/idea.service.js'
import { UserModel } from '../models/user.model.js'
import { UserService } from '../services/user.service.js'
import { IsAuth } from '../middlewares/auth.middleware.js'

@Resolver(() => VoteModel)
@UseMiddleware(IsAuth)
export class VoteResolver {
  private voteService = new VoteService()
  private ideaService = new IdeaService()
  private userService = new UserService()

  @Mutation(() => Boolean)
  async toggleVote(
    @Arg('ideaId', () => String) ideaId: string,
    @GqlUser() user: User
  ): Promise<boolean> {
    return this.voteService.toggleVote(user.id, ideaId)
  }

  @FieldResolver(() => IdeaModel)
  async idea(@Root() vote: VoteModel): Promise<IdeaModel> {
    return this.ideaService.findIdeaById(vote.ideaId)
  }

  @FieldResolver(() => UserModel)
  async user(@Root() vote: VoteModel): Promise<UserModel> {
    return this.userService.findUser(vote.userId)
  }
}
