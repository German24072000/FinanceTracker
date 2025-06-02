import { Component, inject, input, Input, OnInit, signal } from '@angular/core';
import { TransactionInterface } from '../../models/transaction.interface';
import { TransactionService } from '../../services/transaction.service';
import { Timestamp } from '@angular/fire/firestore'; // Import the Timestamp type
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'app-transactions',
  imports: [CommonModule, NgbDropdownModule ],
  templateUrl: './transactions.component.html',
  styleUrl: './transactions.component.scss'
})
export class TransactionsComponent implements OnInit {

  private userId : string = ""

  authService = inject(AuthService)

  constructor(private transactionService: TransactionService, private router: Router){}

  transactions = signal<TransactionInterface[]>([]);

  ngOnInit(): void {
      this.userId = this.authService.currentUserLoggedIn()!.uid;
      this.transactionService.getUserTransactions(this.userId).then((transactionsFromFireBase) => {

      this.transactions.set(transactionsFromFireBase)
      
      this.transactions.update((transactions) => {
        return transactions.map((transaction) => {
            if(transaction.date instanceof Timestamp) {
              transaction.date = transaction.date.toDate()
            }
            return {...transaction} as TransactionInterface
        })
      })  
      console.log(this.transactions());
      
    })
  }

  navigateToAddTransaction() {
    this.router.navigateByUrl("/main/transactions/add")
  }

}
