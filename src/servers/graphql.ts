import {ApolloServer} from 'apollo-server-fastify';
import {ApolloServerPlugin} from 'apollo-server-plugin-base';
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core/dist/plugin/drainHttpServer';
import {ContextValue} from 'sofa-api/types';
import {FastifyInstance} from 'fastify';
import {GraphQLSchema} from 'graphql';
import http from 'http';
import {serverConfig} from './config';

function fastifyAppClosePlugin(app: FastifyInstance): ApolloServerPlugin {
  return {
    async serverWillStart() {
      return {
        async drainServer() {
          await app.close();
        },
      };
    },
  };
}

export const apolloGraphqlServer = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app: any,
  {schema, context}: {schema: GraphQLSchema; context: ContextValue}
) => {
  const server = new ApolloServer({
    schema,
    plugins: [
      fastifyAppClosePlugin(app),
      ApolloServerPluginDrainHttpServer({httpServer: app.server}),
    ],
    context,
    // formatError: err => {
    //   // Don't give the specific errors to the client.
    //   let errorMessage = err.message;
    //   if (errorMessage.startsWith('Context creation failed: ')) {
    //     errorMessage = last(errorMessage.split(':'));
    //     return new ApolloError(errorMessage, err?.extensions?.code);
    //   }
    //   // Otherwise return the original error which can also
    //   // be manipulated in other ways, as long as it's returned.
    //   return err;
    // },
  });

  return server;
};

export default async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app: any,
  {
    schema,
    context,
  }: {schema: GraphQLSchema; context: typeof serverConfig.context}
) => {
  const graphqlServer = apolloGraphqlServer(app, {schema, context});

  await graphqlServer.start();
  app.register(graphqlServer.createHandler());
};
