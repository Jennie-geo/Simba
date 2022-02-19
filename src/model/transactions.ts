import Mongoose from 'mongoose';

const Schema = Mongoose.Schema;

const transactionSchema = new Schema(
  {
    user: {
      type: Mongoose.SchemaTypes.ObjectId,
      ref: 'user',
    },
    senderAccount_nr: {
      type: String,
      require: true,
    },
    amount: {
      type: Number,
      require: true,
    },
    // balance: {
    //   USD: {
    //     type: Number,
    //     default: 1000,
    //   },
    //   EUR: {
    //     type: Number,
    //     default: 0,
    //   },
    //   NGN: {
    //     type: Number,
    //     default: 0,
    //   },
    receiverAccount_nr: {
      type: String,
      require: true,
    },
    source_currency: {
      type: String,
    },
    target_currency: {
      type: String,
    },
    exchange_rate: {
      type: Number,
    },
    status: {
      type: String,
      enum: ['failed', 'successful'],
      default: 'successful',
    },
  },
  { timestamps: true },
);

const Transaction = Mongoose.model('transaction', transactionSchema);

export default Transaction;
