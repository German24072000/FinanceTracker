import { Component, inject, OnInit, signal } from '@angular/core';
import { TransactionService } from '../../services/transaction.service';
import { Timestamp } from '@angular/fire/firestore'; // Import the Timestamp type
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { CategoryService } from '../../services/category.service';
import { DisplayTransactionInterface } from '../../models/displayTransaction.interface';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss',
})
export class TransactionsComponent implements OnInit {
  private userId: string = '';

  authService = inject(AuthService);

  transactions = signal<DisplayTransactionInterface[]>([]);

  constructor(
    private transactionService: TransactionService,
    private router: Router,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.currentUserLoggedIn()!.uid;
    this.getTransactionsWithCategoryName(this.userId);
  }

  async getTransactionsWithCategoryName(userId: string): Promise<void> {
    const transactionsOfUserFromDb =
      await this.transactionService.getUserTransactions(userId);

    const categoriesOfUserFromDb = await this.categoryService.getUserCategories(userId);
    const nameOfCategories = new Map();

    categoriesOfUserFromDb.forEach((category) => {
      nameOfCategories.set(category.categoryId, category.name);
    });

    const processedTransactions: DisplayTransactionInterface[] =
      transactionsOfUserFromDb.map((transaction) => {
        let date: Date = new Date();
        if (transaction.date instanceof Timestamp) {
          date = (transaction.date as Timestamp).toDate();
        }

        let categoryName = nameOfCategories.get(transaction.categoryId);

        return {
          transactionId: transaction.transactionId,
          userId: userId,
          date: date,
          amount: transaction.amount,
          transactionName: transaction.description,
          categoryId: transaction.categoryId,
          categoryName: categoryName,
        } as DisplayTransactionInterface;
      });

    this.transactions.set(processedTransactions);
  }

  navigateToAddTransaction() {
    this.router.navigateByUrl('/main/transactions/add');
  }

  editTransaction(id:string){
    // this.router.navigateByUrl('/main/transactions/edit');
    this.router.navigate(['/main/transactions/edit',id])
  }
}
