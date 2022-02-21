import Router from 'express';
import {
  createTransaction,
  getRateController,
  getSingleTransactionByUser,
  getAllTransactions,
} from '../controller/transaction';
import { isLoggedIn, authlogin } from '../middleware/loginAuth';

const router = Router();

router.post('/api/v1/createTransaction/:id', isLoggedIn, createTransaction);
router.post('/api/v1/getRate', authlogin, getRateController);
router.get('/api/v1/getTransaction', getSingleTransactionByUser);
router.get('/api/v1/allTransactions', getAllTransactions);
export default router;
