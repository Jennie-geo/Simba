import Mongoose from 'mongoose';

const userSchema = new Mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
    },
    lastName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      required: true,
    },
    account_Number: {
      type: String,
      require: true,
    },
    balance: {
      USD: {
        type: Number,
        default: 1000,
      },
      EUR: {
        type: Number,
        default: 0,
      },
      NGN: {
        type: Number,
        default: 0,
      },
    },
    password: {
      type: String,
      required: true,
    },
    confirmPassword: {
      type: String,
      //required: true,
    },
  },
  {
    timestamps: true,
  },
);

const User = Mongoose.model('user', userSchema);

export default User;
