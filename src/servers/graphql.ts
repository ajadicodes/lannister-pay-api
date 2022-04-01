import {GraphQLSchema} from 'graphql';
import mercurius from 'mercurius';
import {serverConfig} from './config';

export default (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  app: any,
  {
    schema,
    context,
  }: {schema: GraphQLSchema; context: typeof serverConfig.context}
) => {
  app.register(mercurius, {
    schema,
    context,
    graphiql: true,
    jit: 1,
  });
};
