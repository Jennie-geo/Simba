import express, { Request, Response } from 'express';
import Transaction from '../model/transactions';
import { transactionSchema } from '../middleware/validation';
import User from '../model/user';
import axios from 'axios';
import jwt from 'jsonwebtoken';
import { GetRateReturnType } from '../interface/apiInterface';
import { exchangeRates, currencies } from 'exchange-rates-api';
import { getRate, getRateControllers } from '../lib/rateApi';
import { CustomRequest } from '../middleware/loginAuth';

export async function createTransaction(
  req: CustomRequest,
  res: Response,
): Promise<any> {
  try {
    const validation = transactionSchema.validate(req.body);
    if (validation.error) {
      res.send({ 'Validation error': validation.error.message });
    }
    const {
      senderAccount_nr,
      source_currency,
      receiverAccount_nr,
      target_currency,
      amount,
    } = req.body;

    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ msg: 'No user found' });
    const rateApiResponse = await getRateControllers(
      source_currency,
      target_currency,
    );
    if (source_currency !== target_currency && rateApiResponse.error) {
      return res.status(404).json({
        error: 'Unable to get rate for transaction',
      });
    }
    const { conversion_rate } = rateApiResponse;
    const sender = await User.findOne({ account_Number: senderAccount_nr });
    const receiver = await User.findOne({ account_Number: receiverAccount_nr });

    if (!sender) {
      return res.status(400).json({ msg: 'No sender account added' });
    }
    if (!receiver) {
      return res.status(400).json({ msg: 'No receiver account exists' });
    }
    if (receiver.account_Number === senderAccount_nr) {
      return res.status(400).json({
        msg: 'Please, add a different receiver account number',
      });
    }

    if (sender.balance[source_currency] >= amount) {
      const quoteEvaluation = amount * conversion_rate;

      const newSenderBalUSD = sender.balance[source_currency] - amount;
      const newReceiverBalNGN =
        receiver.balance[target_currency] + quoteEvaluation;

      const updateAccount = {
        senderAccount_nr,
        receiverAccount_nr,
        amount,
        target_currency,
        source_currency,
        // userId: user,
        exchange_rate: conversion_rate,
      };
      sender.balance[source_currency] = newSenderBalUSD;
      receiver.balance[target_currency] = newReceiverBalNGN;

      await sender.save();
      await receiver.save();

      const newTransaction = new Transaction(updateAccount);
      await newTransaction.save();

      res.status(200).json({ success: true, details: newTransaction });
    } else {
      res.status(400).json({ success: false, msg: 'Insufficient amount' });
    }
  } catch (err: any) {
    res.status(500).json(err.message);
  }
}

export async function getAllTransactions(
  req: Request,
  res: Response,
): Promise<any> {
  try {
    const transaction = await Transaction.find();
    if (transaction.length === 0) {
      return res.send({ msg: 'No transaction found' });
    }
    res.send({ Details: transaction });
  } catch (err: any) {
    res.send({ Error: err.message });
  }
}

export async function getSingleTransactionByUser(
  req: CustomRequest,
  res: Response,
): Promise<any> {
  try {
    const transaction = await Transaction.find({ userId: req.user });
    if (!transaction) {
      return res.status(404).json({ msg: 'No user with the id exists' });
    }
    res.status(200).json({ msg: transaction });
  } catch (err: any) {
    res.status(500).json({ Error: err.message });
  }
}

export async function getRateController(
  req: Request,
  res: Response,
): Promise<any> {
  // 'https://v6.exchangerate-api.com/v6/e040af17b11ab1c76fa9fdf9/latest/USD',
  try {
    const { base_code, target_code } = req.body;
    const { data } = await axios.get(
      `https://v6.exchangerate-api.com/v6/${process.env.EXCHANGE_API_KEY}/pair/${base_code}/${target_code}`,
    );
    console.log(data);
    res.send({ Data: data });
  } catch (err) {
    res.send({ Errors: err });
  }
}
