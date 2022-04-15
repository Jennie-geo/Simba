import Router from 'express';
import {
  createTransaction,
  getRateController,
  getTransactionByUser,
  getAllTransactions,
} from '../controller/transaction';
import { isLoggedIn, authlogin } from '../middleware/loginAuth';

const router = Router();

router.post('/api/v1/createTransaction', authlogin, createTransaction);
router.post('/api/v1/getRate', authlogin, getRateController);
router.get('/api/v1/getTransaction', authlogin, getTransactionByUser);
router.get('/api/v1/allTransactions', authlogin, getAllTransactions);
export default router;
