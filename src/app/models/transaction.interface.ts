export interface TransactionInterface {
  transactionId: string,
  userId: string,
  date: Date,
  amount: number,
  description: string,
  categoryId: string,
  // type:string,
}