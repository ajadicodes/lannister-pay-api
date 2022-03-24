import {ApolloError} from 'apollo-server-errors';
import Fees from '../dataSources/fees';
import {MONGODB_URI} from '../config';
import {MongoClient} from 'mongodb';
import {schema} from '../graphql/schema';

// TODO: replace mongoose connection with this
// TODO: move into appropriate dir
if (!MONGODB_URI)
  throw new ApolloError('No URI found...', 'DATABASE_CONNECTION_ERROR');

const client = new MongoClient(MONGODB_URI);
client.connect();
console.log('Client is connected');

export const serverConfig = {
  schema,

  context: {
    dataSources: {
      fees: new Fees(client.db().collection('feespecmodels')),
    },
  },
};
