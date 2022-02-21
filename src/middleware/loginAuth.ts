import { NextFunction, Request, Response } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import User from '../model/user';

//import {config} from '../config'

interface Users extends Request {
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
//users login authorization
export function authlogin(req: Users, res: Response, next: NextFunction): any {
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
      const userId = decoded!;
      const user = await User.findById(userId);
      if (!user) {
        return res.send({ login: `No User exists with this ${userId}` });
      }
      next();
    }
  });
}

// export  function getRandomNumber(str: any): Promise<string> {
//   return Math.random().toFixed(str).split('.')[1];

// }
// console.log(getRandomNumber(10));

//admin authorization
// export function adminAuth(req: Users, res: Response, next: NextFunction): any {
//   const token = req.headers['authorization'];
//   if (!token) {
//     return res.status(403).send('login please');
//   }
//   const admintokenBody = token.slice(7);
//   jwt.verify(
//     admintokenBody,
//     'SECRET',
//     async (err, decoded: customJwtPayLoad | undefined) => {
//       if (err) {
//         return res.status(403).send({ Error: 'Access denied' });
//       } else {
//         const { userId } = decoded!;
//         const user = await User.findById(userId);
//         if (!user) {
//           return res.send({ msg: 'No user exists with this id' });
//         }
//         if (user.role === 'admin') {
//           next();
//         } else {
//           return res.status(401).send({ msg: 'You are unauthorized' });
//         }
//       }
//     },
//   );
// }
