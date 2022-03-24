import {ApolloServer} from 'apollo-server-express';
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core/dist/plugin/drainHttpServer';
import {ContextValue} from 'sofa-api/types';
import {GraphQLSchema} from 'graphql';
import http from 'http';
import {serverConfig} from './config';

export const apolloGraphqlServer = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app: any,
  {schema, context}: {schema: GraphQLSchema; context: ContextValue}
) => {
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
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
  graphqlServer.applyMiddleware({
    app,
  });
};
