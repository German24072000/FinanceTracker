import { Injectable } from '@angular/core';
import { collection } from '@angular/fire/firestore';
import {
  getFirestore,
  doc,
  setDoc,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { TransactionInterface } from '../models/transaction.interface';

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  db = getFirestore();

  constructor() {}

  async getUserTransactions(userId: string) {
    //get collection
    const transactionsCollection = collection(this.db, 'transactions');
    //build the query
    const q = query(transactionsCollection, where('userId', '==', userId));
    //execute the query
    const querySnapshot = await getDocs(q);

    const transactions: TransactionInterface[] = [];

    //add all transactions from firestore inside transactions
    querySnapshot.forEach((doc) => {

      const data = doc.data();
      transactions.push({
        transactionId: doc.id,
        userId: data['userId'],
        date: data['date'],
        amount: data['amount'],
        description: data['description'],
        type: data['type'],
        category: data['category'],
      });
    });

    return transactions;
  }

  // async function getUserTransactions(userId) {
  //   const transactionsCollection = collection(this.db, "transactions")
  //   const q = query(transactionsCollection, where("userId", "==", userId))
  //   const querySnapshot = await getDocs(q);
  // const transactions = [];
  // }
}
