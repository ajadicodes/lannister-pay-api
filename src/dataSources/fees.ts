import {FeeSpec, Fields} from '../types';

import MongoDataSource from 'apollo-mongodb-datasource';
import connectionToDB from '../utils/connectionToDB';

export default class Fees extends MongoDataSource<FeeSpec> {
  getSpecFees = async (fields: Fields) => {
    try {
      // await connectionToDB();
      return this.find(fields);
    } catch (error: unknown) {
      console.error(error);
      throw error;
    }
  };

  getDocumentCount = async () => {
    try {
      // await connectionToDB();
      return this.collection.countDocuments();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  insertMany = async (docs: FeeSpec[]) => {
    try {
      // await connectionToDB();

      // empty database before new specification
      await this.collection.deleteMany({});
      // empty cache
      // await this.deleteFromCacheByFields()
      await this.collection.insertMany(docs);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error inserting specification:', error);
      throw error;
    }
  };
}
