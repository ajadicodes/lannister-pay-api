import {ObjectId} from 'mongoose';
import mongoose from 'mongoose';

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

export interface FeeSpec {
  feeID: string;
  feeCurrency: string;
  feeLocale: string;
  entity: Entity;
  //   feeType: FeeType;
  feeValue: FeeValue;
  specificityCount: number;
}

export interface Fields {
  [fieldName: string]:
    | string
    | number
    | boolean
    | ObjectId
    | (string | number | boolean | ObjectId)[];
}

export interface DataSources {
  fees?: mongoose.Model<FeeSpec>;
}

export interface ContextValue {
  dataSources: DataSources;
}
