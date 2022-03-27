import {Document, Model} from 'mongoose';

import {ObjectId} from 'mongodb';

export interface Entity {
  feeEntity: string;
  entityProperty: string;
}

interface FlatPerc {
  type: 'FLAT_PERC';
  flatValue: string;
  percValue: string;
}

type Flat = {type: 'FLAT'} & Omit<FlatPerc, 'type' | 'percValue'>;

type Perc = {type: 'PERC'} & Omit<FlatPerc, 'type' | 'flatValue'>;

export type FeeValue = Flat | Perc | FlatPerc;

export type FeeType = FeeValue['type'];

// Although mongoose does not recommend our document interface
// extend Document -- even though they themselves say many Mongoose TypeScript
// codebases use this approach -- it is used here because its the only way
// the version of apollo-datasource-mongodb -- used in this codebase --
// differentiates between a Model and a Collection type.
export interface FeeSpecDocument extends Document {
  feeID: string;
  feeCurrency: string;
  feeLocale: string;
  entity: Entity;
  //   feeType: FeeType;
  feeValue: FeeValue;
  specificityCount: number;
}

export type FeeSpec = Pick<
  FeeSpecDocument,
  | 'feeID'
  | 'feeCurrency'
  | 'feeLocale'
  | 'entity'
  | 'feeValue'
  | 'specificityCount'
>;

export interface Fields {
  [fieldName: string]:
    | string
    | number
    | boolean
    | ObjectId
    | (string | number | boolean | ObjectId)[];
}

interface DataSources {
  fees: Model<FeeSpec>;
}

export interface ContextValue {
  dataSources?: DataSources;
}
