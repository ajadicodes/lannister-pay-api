import {ApolloError} from 'apollo-server-errors';
import {MONGODB_URI} from '../config';
import mongoose from 'mongoose';

const connectionToDB = async () => {
  const connectionState = mongoose.connection.readyState;
  // const states = {
  //   0: 'disconnected',
  //   1: 'connected',
  //   2: 'connecting',
  //   3: 'disconnecting',
  //   99: 'uninitialized',
  // };
  // console.log(':::: Database state:', states[connectionState].toUpperCase());
  // check if we have a connection to the database or if it's currently
  // connecting or disconnecting (readyState 1, 2 and 3)
  if (connectionState >= 1) {
    return;
  }

  if (!MONGODB_URI)
    throw new ApolloError('No URI was provided', 'DATABASE_CONNECTION_ERROR');

  return mongoose.connect(MONGODB_URI);
};

export default connectionToDB;
