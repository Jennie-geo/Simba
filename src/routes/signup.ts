import express from 'express';
const router = express.Router();

import {
  createUser,
  loginUser,
  getAllUser,
  getSingleUser,
} from '../controller/user';
import { isLoggedIn } from '../middleware/loginAuth';

router.post('/api/v1/user/user_signup', createUser);
router.post('/api/v1/user/login', loginUser);
router.get('/api/v1/user/getUser', isLoggedIn, getAllUser);
router.get('/api/v1/user/getAUser', getSingleUser);
export default router;
