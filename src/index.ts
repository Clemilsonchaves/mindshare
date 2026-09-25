import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";


async function bootstrap() {
  const server = new ApolloServer({
    typeDefs: `
      type Query {
        helloworld: String
      }
    `,
    resolvers: {
      Query: {
        helloworld: () => "Hello world!",
      },
    },
  
    // Your Apollo Server configuration here
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`Server ready at ${url}`);
}

bootstrap();