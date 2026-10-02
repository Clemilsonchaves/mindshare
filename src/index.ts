import 'reflect-metadata'
import express from 'express'
import cors from 'cors'
import { ApolloServer } from '@apollo/server'
import { buildSchema } from 'type-graphql'
import { expressMiddleware } from '@as-integrations/express5'
import { AuthResolver } from './resolvers/auth.resolver.js'
import { UserResolver } from './resolvers/user.resolver.js'
import { buildContext } from './graphql/context/index.js'
import { IdeaResolver } from './resolvers/idea.resolver.js'
import { CommentResolver } from './resolvers/comment.resolver.js'
import { VoteResolver } from './resolvers/vote.resolver.js'

async function bootstrap() {
  const app = express()
  const allowedOrigins = new Set([
    'http://localhost:5173',
    'http://127.0.0.1:5173',
    'https://studio.apollographql.com',
    'https://embeddable-sandbox.cdn.apollographql.com',
  ])

  // Habilitar CORS
  app.use(
    cors({
      origin(origin, callback) {
        if (!origin || allowedOrigins.has(origin)) {
          callback(null, true)
          return
        }

        callback(new Error('Origem não permitida pelo CORS'))
      },
      credentials: true,
    })
  )

  const schema = await buildSchema({
    resolvers: [
      AuthResolver,
      UserResolver,
      IdeaResolver,
      CommentResolver,
      VoteResolver,
    ],
    validate: false,
    emitSchemaFile: './schema.graphql',
  })

  const server = new ApolloServer({
    schema,
  })

  await server.start()

  const graphqlHandler = expressMiddleware(server, {
    context: buildContext,
  })

  app.use(
    '/graphql',
    express.json(),
    graphqlHandler
  )

  app.all('/', express.json(), graphqlHandler)

  app.listen(
    {
      port: 4000,
    },
    () => {
      console.log(`Servidor iniciado na porta 4000!`)
    }
  )
}

bootstrap()
