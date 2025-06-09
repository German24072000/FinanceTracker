import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { CategoryInterface } from '../../../models/category.interface';
import { AuthService } from '../../../services/auth.service';
import { TransactionService } from '../../../services/transaction.service';
import { AlertService } from '../../../services/alert.service';
import { Timestamp } from '@angular/fire/firestore';
import { TransactionInterface } from '../../../models/transaction.interface';

@Component({
  selector: 'app-transaction-form',
  imports: [ReactiveFormsModule],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss',
})
export class TransactionFormComponent implements OnInit {
  formTransactions = new FormGroup({
    transactionId: new FormControl(''),
    userId: new FormControl(''),
    date: new FormControl(''),
    amount: new FormControl(0),
    description: new FormControl(''),
    category: new FormControl(''),
  });

  categoriesOfUser = signal<CategoryInterface[]>([]);
  transactionId: string | null = null;
  isEditMode = signal(false);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private authService: AuthService,
    private transactionService: TransactionService,
    private alertService: AlertService
  ) {}
  private userId = '';

  async ngOnInit() {

    this.userId = this.authService.currentUserLoggedIn()!.uid;

    this.route.paramMap.subscribe((params) => {
      this.transactionId = params.get('id');

      this.fillSelectFieldCategories();
    });

    if (this.isTransactionUpdated()) {
      this.isEditMode.set(true);

      let transactionToUpdate = await this.transactionService.getTransactionById(
          this.userId,
          this.transactionId!
        );

      let dateOfTransactionFormatted = this.convertDateToString(transactionToUpdate);

      this.formTransactions.patchValue({
        transactionId: transactionToUpdate.transactionId,
        userId: transactionToUpdate.userId,
        amount: transactionToUpdate.amount,
        description: transactionToUpdate.description,
        category: transactionToUpdate.categoryId,
        date: dateOfTransactionFormatted,
      });
    } else {
      this.isEditMode.set(false);
    }
  }

  convertDateToString(transaction: TransactionInterface){
    let date: Date = new Date();
    if (transaction.date instanceof Timestamp) {
      date = (transaction.date as Timestamp).toDate();
      return date.toISOString().substring(0, 10);
    } else {
      return new Date().toISOString().substring(0, 10);
    }
  }

  isTransactionUpdated() {
    if (this.transactionId) {
      return true;
    } else {
      return false;
    }
  }

  fillSelectFieldCategories() {
    this.categoryService.getUserCategories(this.userId).then((categories) => {
      this.categoriesOfUser.set(categories);
    });
  }

  executeSubmit() {
    let data = this.formTransactions.getRawValue();
    let dateToDate: Date;

    if (this.isTransactionUpdated()) {
      dateToDate = new Date(data.date!);
      this.transactionService.updateTransaction(this.userId, data.description!,dateToDate, data.amount! ,data.category!, data.transactionId!).subscribe({
          next: () => {
            this.alertService.sendMessage(
              'Transaction has been updated successfully'
            );
            this.router.navigateByUrl('main/transactions');
          },
          error: (err) => {
            console.log(err);
          },
        });

    } else {

      dateToDate = new Date(data.date!);
      this.transactionService
        .saveTransaction(
          this.userId,
          dateToDate,
          data.amount!,
          data.description!,
          data.category!,
          'tipo'
        )
        .subscribe({
          next: () => {
            this.alertService.sendMessage(
              'Transaction has been saved successfully'
            );
            this.router.navigateByUrl('main/transactions');
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  goToCategoriesPage() {
    this.router.navigateByUrl('/main/transactions');
  }
}
