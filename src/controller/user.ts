import express, { Request, Response } from 'express';
import User from '../model/user';
import bcrypt from 'bcrypt';
import { userSchema } from '../middleware/validation';
import jwt from 'jsonwebtoken';

export async function createUser(
  req: express.Request,
  res: express.Response,
): Promise<any> {
  console.log('function dey work');
  try {
    const accountNum = Math.floor(Math.random() * 10000000000 + 1);
    const validation = userSchema.validate(req.body);
    if (validation.error) {
      console.log(validation.error);
      res.send({ 'Validation error': validation.error.message });
    }
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.send({ success: true, message: 'User already exists' });
    } else {
      const userPasswd = await bcrypt.hash(req.body.password, 10);
      const newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: userPasswd,
        account_Number: accountNum,
      });
      await newUser.save();
      res.send({ success: true, data: newUser });
    }
  } catch (e) {
    console.log(e);
    res.send({ success: false, message: (e as Error).message });
  }
}
export async function loginUser(req: Request, res: Response): Promise<any> {
  try {
    console.log('\n\n', new Date().toLocaleDateString(), req.body);
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.send({ msg: 'No user with this email exist' });
    } else {
      const matchPassword = await bcrypt.compare(
        req.body.password,
        user.password,
      );
      if (!matchPassword) {
        res.send({ msg: "Authentication failed, Password doesn't match" });
      } else {
        const token = jwt.sign({ userId: user.id }, 'SECRET', {
          expiresIn: '1h',
        });
        res.setHeader('Authorization', token);
        return res.status(200).json({
          message: 'Auth successful',
          token: token,
        });
      }
    }
  } catch (err) {
    res.send('error');
  }
}
export async function getAllUser(req: Request, res: Response): Promise<any> {
  try {
    const user = await User.find();
    if (user.length === 0) {
      res.send({ msg: 'No user exist' });
    }
    res.send({ user: user });
  } catch (err) {
    res.send(err);
  }
}
export async function getSingleUser(req: Request, res: Response): Promise<any> {
  try {
    const user = await User.findOne({
      account_Number: req.body.account_Number,
    });
    if (!user)
      return res.send({
        msg: `No user exists with account number ${req.body.account_Number}`,
      });
    return res.send({ details: user });
  } catch (err) {
    res.send(err);
  }
}
