import { Injectable } from '@angular/core';
import { collection, doc } from '@angular/fire/firestore';
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
        // type: transaction.type,
      };
    },
    fromFirestore: (snapshot, options) => {
      const data = snapshot.data(options);
      return {
        transactionId: data['transactionId'],
        userId: data['transactionId'],
        date: data['transactionId'],
        amount: data['transactionId'],
        description: data['transactionId'],
        categoryId: data['transactionId'],
        // type: data['transactionId'],
      };
    },
  };

  constructor() {}

  getTransactionCollectionForUser(userId: string): CollectionReference<TransactionInterface>{
    return collection(doc(this.db, 'users', userId), 'transactions').withConverter(this.transactionConverter)
  }

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
        // type: data['type'],
        categoryId: data['category'],
      });
    });

    return transactions;
  }

  saveTransaction(userId: string, date: Date, amount: number, description: string, categoryId: string, type: string, ) {
    const transactionsCollection = this.getTransactionCollectionForUser(userId);

    const docRef = doc(transactionsCollection)

    const newId = docRef.id

    const transactionToSave: TransactionInterface = {
      transactionId: newId,
      userId: userId,
      date: date,
      amount: amount,
      description: description,
      categoryId: categoryId,
      // type: type
    }

    const promise  =setDoc(docRef, transactionToSave)
    return from(promise)
  }

  // async function getUserTransactions(userId) {
  //   const transactionsCollection = collection(this.db, "transactions")
  //   const q = query(transactionsCollection, where("userId", "==", userId))
  //   const querySnapshot = await getDocs(q);
  // const transactions = [];
  // }
}
