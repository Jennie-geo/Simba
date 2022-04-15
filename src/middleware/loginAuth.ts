import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../model/user';

//import {config} from '../config'

export interface CustomRequest extends Request {
  user?: string;
  name?: string;
  email?: string;
  password?: string;
  role?: string;
}

interface customJwtPayLoad extends jwt.JwtPayload {
  adminId?: string;
  userId?: string;
}
// checking if a user is already logged in
export function isLoggedIn(
  req: Request,
  res: Response,
  next: NextFunction,
): any {
  const token = req.headers['authorization'];

  if (!token) {
    console.log('no token', token);
    return next();
  }
  //verify token
  const tokenBody = token.slice(7);

  jwt.verify(tokenBody, 'SECRET', async (err, decoded) => {
    if (err) {
      console.log('token invalid');
      return next();
    } else {
      console.log('token valid, return token.');
      //there is a valid token
      return res.json({
        message: 'Already logged in',
        token: token,
      });
    }
  });
}
//CustomRequest login authorization
export function authlogin(
  req: CustomRequest,
  res: Response,
  next: NextFunction,
): any {
  const token = req.headers['authorization'];
  if (!token) {
    return res.status(403).send('You have to login to continue');
  }
  //verify token
  const tokenBody = token.slice(7);

  jwt.verify(tokenBody, 'SECRET', async (err, decoded) => {
    if (err) {
      console.log('error', err);
      return res.status(403).send({ Error: 'Access denied' });
    } else {
      //there is a valid token
      const { userId } = decoded as {
        userId: string;
        iat: number;
        exp: number;
      };
      const user = await User.findById(userId);
      if (!user) {
        return res.send({ login: `No User exists with this ${userId}` });
      }
      req.user = userId as string;
      next();
    }
  });
}
