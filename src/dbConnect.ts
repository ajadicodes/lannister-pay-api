import {MONGODB_URI} from './config';
import mongoose from 'mongoose';

const dbConnect = async () => {
  // check if we have a connection to the database or if it's currently
  // connecting or disconnecting (readyState 1, 2 and 3)
  if (mongoose.connection.readyState >= 1) {
    return;
  }

  if (!MONGODB_URI) throw new Error('No URI was provided');

  // console.log('Connecting to database.....');

  return mongoose.connect(MONGODB_URI);
};

export default dbConnect;
