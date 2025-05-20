export interface TransactionInterface {
  transactionId: string,
  userId: string,
  date: Date,
  amount: number,
  description: string,
  category: string,
  type: string, // Example of a union type
  // ... other properties
}