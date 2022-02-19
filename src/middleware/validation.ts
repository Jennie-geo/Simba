import Joi from 'joi';

export const userSchema = Joi.object({
  firstName: Joi.string().min(3).required(),
  lastName: Joi.string().min(3).required(),
  email: Joi.string()
    .trim()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string()
    .trim()
    .pattern(
      new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'),
    ),
});

export const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
  password: Joi.string()
    .trim()
    .pattern(
      new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})'),
    ),
});
export const transactionSchema = Joi.object({
  senderAccount_nr: Joi.string().trim(),
  amount: Joi.number(),
  receiverAccount_nr: Joi.string().trim(),
  source_currency: Joi.string().trim().required(),
  target_currency: Joi.string().trim().required(),
  exchange_rate: Joi.number(),
});
export const accountSchema = Joi.object({
  amount: Joi.number().required(),
});

// export const accountSchema = Joi.object({
//   senderAcct_nr: Joi.string().required().trim(),
//   amount: Joi.number().required(),
//   receiverAcct_nr: Joi.string().trim(),
//   transactionDesc: Joi.string().trim(),
// });
