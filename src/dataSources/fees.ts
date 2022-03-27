import {FeeSpec, FeeSpecDocument, Fields} from '../types';

import {MongoDataSource} from 'apollo-datasource-mongodb';
import connectionToDB from '../utils/connectionToDB';

export default class Fees extends MongoDataSource<FeeSpecDocument> {
  getSpecFees = async (fields: Fields) => {
    try {
      await connectionToDB();
      return this.findByFields(fields);
    } catch (error: unknown) {
      console.error(error);
      throw error;
    }
  };

  getDocumentCount = async () => {
    try {
      await connectionToDB();
      return this.model.countDocuments();
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  insertMany = async (docs: FeeSpec[]) => {
    try {
      await connectionToDB();

      // empty database before new specification
      await this.model.deleteMany({});
      // empty cache
      // await this.deleteFromCacheByFields()
      await this.model.insertMany(docs);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Error inserting specification:', error);
      throw error;
    }
  };
}
