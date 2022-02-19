// import Mongoose from 'mongoose';

// const accountSchema = new Mongoose.Schema(
//   {
//     user: {
//       type: Mongoose.SchemaTypes.ObjectId,
//       ref: 'user',
//     },

//     account_Number: {
//       type: String,
//       require: true,
//     },
//     sent_Amount: {
//       type: Number,
//       require: true,
//     },
//     senderAccount_nr: {
//       type: String,
//       require: true,
//     },
//     amount: {
//       type: Number,
//       require: true,
//     },
//     receiver_Account_nr: {
//       type: String,
//       require: true,
//     },
//     // balance: {
//     //   type: String,
//     //   transactions: [
//     //     {
//     //       transactionName: String,
//     //       senderName: String,
//     //       amount: Number,
//     //       currencyType: String,
//     //       status: {
//     //         type: Boolean,
//     //         enum: ['failed', 'successful'],
//     //         default: 'successful',
//     //       },
//     //     },
//     //   ],
//     // },
//   },
//   { timestamps: true },
// );

// const Account = Mongoose.model('account', accountSchema);

// export default Account;
