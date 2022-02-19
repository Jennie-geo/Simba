import Router from 'express';
import {
  createTransaction,
  getRateController,
  getSingleTransactionByUser,
  getAllTransactions,
} from '../controller/transaction';
import { isLoggedIn } from '../middleware/loginAuth';

const router = Router();

router.post('/api/v1/createTransaction', isLoggedIn, createTransaction);
router.post('/api/v1/getRate', isLoggedIn, getRateController);
router.get(
  '/api/v1/getTransaction/:id',
  isLoggedIn,
  getSingleTransactionByUser,
);
router.get('/api/v1/allTransactions', getAllTransactions);
export default router;
