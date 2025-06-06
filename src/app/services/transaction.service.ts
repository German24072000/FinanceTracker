import { Injectable } from '@angular/core';
import { collection, deleteDoc, doc, getDoc, updateDoc } from '@angular/fire/firestore';
import {
  getFirestore,
  query,
  where,
  getDocs,
  FirestoreDataConverter,
  CollectionReference,
  setDoc,
} from 'firebase/firestore';
import { TransactionInterface } from '../models/transaction.interface';
import { from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  db = getFirestore();

  transactionConverter: FirestoreDataConverter<TransactionInterface> = {
    toFirestore: (transaction: TransactionInterface) => {
      return {
        transactionId: transaction.transactionId,
        userId: transaction.userId,
        date: transaction.date,
        amount: transaction.amount,
        description: transaction.description,
        categoryId: transaction.categoryId,
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return {
        transactionId: data['transactionId'],
        userId: data['userId'],
        date: data['date'],
        amount: data['amount'],
        description: data['description'],
        categoryId: data['categoryId'],
      };
    },
  };

  constructor() {}

  getTransactionCollectionForUser(
    userId: string
  ): CollectionReference<TransactionInterface> {
    return collection(
      doc(this.db, 'users', userId),
      'transactions'
    ).withConverter(this.transactionConverter);
  }

  async getUserTransactions(userId: string) {
    const transactionsCollection = this.getTransactionCollectionForUser(userId);
    //build the query
    const q = query(transactionsCollection, where('userId', '==', userId));

    //execute the query
    const querySnapshot = await getDocs(q);

    const transactions: TransactionInterface[] = [];

    //add all transactions from firestore inside transactions
    querySnapshot.forEach((transaction) => {
      const data = transaction.data();

      transactions.push({
        transactionId: transaction.id,
        userId: data['userId'],
        date: data['date'],
        amount: data['amount'],
        description: data['description'],
        // type: data['type'],
        categoryId: data['categoryId'],
      });
    });

    return transactions;
  }

  saveTransaction(
    userId: string,
    date: Date,
    amount: number,
    description: string,
    categoryId: string,
    type: string
  ) {
    const transactionsCollection = this.getTransactionCollectionForUser(userId);

    const docRef = doc(transactionsCollection);

    const newId = docRef.id;

    const transactionToSave: TransactionInterface = {
      transactionId: newId,
      userId: userId,
      date: date,
      amount: amount,
      description: description,
      categoryId: categoryId,
    };

    const promise = setDoc(docRef, transactionToSave);
    return from(promise);
  }

  updateTransaction(
    userId: string,
    description: string,
    date: Date,
    amount: number,
    categoryId: string,
    transactionId: string
  ) {
    const transactionsCollection = this.getTransactionCollectionForUser(userId);
    const docRef = doc(transactionsCollection, transactionId);

    const promise = setDoc(docRef, {
      transactionId: transactionId,
      userId: userId,
      date: date,
      amount: amount,
      description: description,
      categoryId: categoryId,
    } as TransactionInterface);

    return from(promise);
  }

  async getTransactionById(userId: string, transactionId: string) {
    const transactionsCollection = this.getTransactionCollectionForUser(userId);
    const docRef = doc(transactionsCollection, transactionId);
    const querySnapshot = await getDoc(docRef);
    let data = querySnapshot.data();

    return {
      transactionId: data?.transactionId,
      userId: data?.userId,
      date: data?.date,
      amount: data?.amount,
      description: data?.description,
      categoryId: data?.categoryId,
    } as TransactionInterface;
  }

  async deleteTransaction(userId: string, transactionId: string) {
    const transactionsCollection = this.getTransactionCollectionForUser(userId);
    const docRef = doc(transactionsCollection, transactionId);
    await deleteDoc(docRef)
  }
}
