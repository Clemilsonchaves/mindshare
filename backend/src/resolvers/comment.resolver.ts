import { Arg, FieldResolver, Mutation, Resolver, Root, UseMiddleware } from 'type-graphql'
import { CommentModel } from '../models/comment.model.js'
import { CreateCommentInput } from '../dtos/input/comment.input.js'
import { CommentService } from '../services/comment.service.js'
import { GqlUser } from '../graphql/decorators/user.decorator.js'
import { IdeaModel } from '../models/idea.model.js'
import { IdeaService } from '../services/idea.service.js'
import { UserModel } from '../models/user.model.js'
import { UserService } from '../services/user.service.js'
import { IsAuth } from '../middlewares/auth.middleware.js'

@Resolver(() => CommentModel)
@UseMiddleware(IsAuth)
export class CommentResolver {
  private commentService = new CommentService()
  private ideaService = new IdeaService()
  private userService = new UserService()

  @Mutation(() => CommentModel)
  async createComment(
    @Arg('ideaId', () => String) ideaId: string,
    @Arg('data', () => CreateCommentInput) data: CreateCommentInput,
    @GqlUser() user: UserModel
  ): Promise<CommentModel> {
    return this.commentService.create(ideaId, user.id, data)
  }

  @FieldResolver(() => IdeaModel)
  async idea(@Root() comment: CommentModel): Promise<IdeaModel> {
    return this.ideaService.getIdea(comment.ideaId)
  }

  @FieldResolver(() => UserModel)
  async author(@Root() comment: CommentModel): Promise<UserModel> {
    return this.userService.findUser(comment.authorId)
  }
}
