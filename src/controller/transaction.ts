import express, { Request, Response } from 'express';
import Transaction from '../model/transactions';
import { transactionSchema } from '../middleware/validation';
import User from '../model/user';
import axios from 'axios';
import { GetRateReturnType } from '../interface/apiInterface';
import { exchangeRates, currencies } from 'exchange-rates-api';
import { getRate, getRateControllers } from '../lib/rateApi';

export async function createTransaction(
  req: Request,
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

    //get exchange rate for the transaction
    // const rateApiResponse = await getRate(source_currency, target_currency);
    const rateApiResponse = await getRateControllers(
      source_currency,
      target_currency,
    );
    console.log('checking...', rateApiResponse);
    if (source_currency !== target_currency && rateApiResponse.error) {
      return res.status(404).json({
        error: 'Unable to get rate for transaction',
      });
    }
    const { conversion_rate } = rateApiResponse;
    console.log('rate', conversion_rate);
    const sender = await User.findOne({ account_Number: senderAccount_nr });
    const receiver = await User.findOne({ account_Number: receiverAccount_nr });

    if (!sender) {
      return res.send({ msg: 'No sender account added' });
    }
    if (!receiver) {
      return res.send({ msg: 'No receiver account exists' });
    }
    if (receiver.account_Number === senderAccount_nr) {
      return res.send({
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
        exchange_rate: conversion_rate,
      };
      console.log('Transaction', Transaction);
      console.log('newsender', newSenderBalUSD);
      console.log('newReceiver', newReceiverBalNGN);
      sender.balance[source_currency] = newSenderBalUSD;
      receiver.balance[target_currency] = newReceiverBalNGN;

      await sender.save();
      await receiver.save();

      const newTransaction = new Transaction(updateAccount);
      console.log('new Transanctio', newTransaction);
      // Transaction.status = 'successful'
      await newTransaction.save();

      res.send({ success: true, details: newTransaction });
    } else {
      res.send({ success: false, msg: 'Insufficient amount' });
    }
  } catch (err: any) {
    res.send(err.message);
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
  req: Request,
  res: Response,
): Promise<any> {
  try {
    const user = await User.findOne({
      _id: req.params.id,
    });
    if (!user) return res.send({ msg: 'No user account exists' });
    console.log('user', user);
    const transaction = await Transaction.findOne({
      account_Number: req.body.account_Number,
    });
    console.log(transaction);
    // if (transaction) {
    //   if (
    //     user.account_Number === transaction.Details.receiverAccount_nr ||
    //     user.account_Number === transaction.Details.senderAccount_nr
    //   ) {
    //     return res.send({ userTransaction: transaction });
    //   }
    // }
    // res.send({ msg: 'No Transaction Found' });
  } catch (err: any) {
    res.send({ Error: err.message });
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
