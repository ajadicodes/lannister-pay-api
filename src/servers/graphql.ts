import {ApolloServer} from 'apollo-server-express';
import {ApolloServerPluginDrainHttpServer} from 'apollo-server-core/dist/plugin/drainHttpServer';
import {ContextFunction} from 'apollo-server-core';
import {GraphQLSchema} from 'graphql';
import http from 'http';

export const apolloGraphqlServer = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app: any,
  {schema, context}: {schema: GraphQLSchema; context: ContextFunction}
) => {
  const httpServer = http.createServer(app);
  const server = new ApolloServer({
    schema,
    plugins: [ApolloServerPluginDrainHttpServer({httpServer})],
    context,
    // introspection: true,
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
  {schema, context}: {schema: GraphQLSchema; context: ContextFunction}
) => {
  const graphqlServer = apolloGraphqlServer(app, {schema, context});
  // const buildPath = path.join(process.cwd(), 'build');

  // // expose graphqli-explorer
  // app.use('/graphql', express.static(buildPath));
  // app.get(
  //   '/graphql',
  //   (_req: unknown, res: {sendFile: (arg0: string) => void}) => {
  //     res.sendFile(path.join(buildPath + '/index.html'));
  //   }
  // );

  // // graphql api by default
  // app.get('/g', (_: any, res: {redirect: (arg0: string) => void}) => {
  //   res.redirect(graphqlServer.graphqlPath);
  // });
  await graphqlServer.start();
  graphqlServer.applyMiddleware({
    app,
  });
};
