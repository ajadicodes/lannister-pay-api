import mongoose, {Schema} from 'mongoose';

import {FeeSpec} from '../types';

// import beautifulUnique from 'mongoose-beautiful-unique-validation'
// import mongooseValidationErrorTransform from 'mongoose-validation-error-transform'

const schema = new Schema<FeeSpec>({
  feeID: {type: String, required: true},
  feeCurrency: {type: String, required: true},
  feeLocale: {type: String, required: true},
  entity: {
    feeEntity: {type: String, required: true},
    entityProperty: {type: String, required: true},
  },
  // feeValue: {type: Schema.Types.ObjectId, ref: 'FlatPercModel'},
  feeValue: {
    type: {type: String, required: true},
    flatValue: String,
    percValue: String,
  },

  specificityCount: Number,
});

// schema.plugin(beautifulUnique)
// schema.plugin(mongooseValidationErrorTransform, {
//   capitalize: true,
//   humanize: true,
//   transform: (messages: string[]) => messages.join(' '),
// })
schema.index({
  'entity.feeEntity': 'hashed',
  'entity.entityProperty': 1,
  feeLocale: 1,
  feeCurrency: 1,
});
const feeSpecModel = mongoose.model('FeeSpecModel', schema, 'feespecmodels');
export {feeSpecModel};
