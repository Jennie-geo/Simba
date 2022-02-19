import express, { Request, Response } from 'express';
import { accountSchema } from '../middleware/validation';
import Account from '../model/account';

import User from '../model/user';

export async function createAccount(req: Request, res: Response): Promise<any> {
  try {
    const accountNum = Math.floor(Math.random() * 10000000000 + 1);
    const validation = accountSchema.validate(req.body);
    if (validation.error) {
      res.send({ 'Validation error': validation.error.message });
    }

    const user = await User.findById({ _id: req.params.id });
    if (!user) return res.send({ msg: 'No user exists' });

    const checkIfAcctExists = await Account.findOne({
      accountNumber: accountNum,
    });
    if (checkIfAcctExists) return res.send({ msg: 'Account already exists' });
    const newAcct = new Account({
      accountNumber: accountNum,
      amount: req.body.amount,
      user: user._id,
    });
    await newAcct.save();
    return res.send({
      msg: 'Account created successfully',
      detail: newAcct,
    });
  } catch (err) {
    res.send(err);
  }
}
