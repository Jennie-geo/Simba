import express from 'express';
const router = express.Router();

import {
  createUser,
  loginUser,
  getAllUser,
  getSingleUser,
  welcomePage,
} from '../controller/user';
import { authlogin, isLoggedIn } from '../middleware/loginAuth';

router.post('/welcome', welcomePage);
router.post('/api/v1/user/user_signup', createUser);
router.post('/api/v1/user/login', loginUser);
router.get('/api/v1/user/getUser', isLoggedIn, getAllUser);
router.get('/api/v1/user/getAUser', authlogin, getSingleUser);
export default router;
