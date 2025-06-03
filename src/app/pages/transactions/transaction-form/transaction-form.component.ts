import { Component, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { CategoryInterface } from '../../../models/category.interface';
import { AuthService } from '../../../services/auth.service';
import { TransactionService } from '../../../services/transaction.service';
import { AlertService } from '../../../services/alert.service';

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
    amount: new FormControl(''),
    description: new FormControl(''),
    category: new FormControl(''),
    // type: new FormControl(''),
  });

  categoriesOfUser = signal<CategoryInterface[]>([])
  transactionId: string | null = null;
  isEditMode = signal(false);

  constructor(private router: Router, private route: ActivatedRoute, private categoryService: CategoryService, private authService: AuthService, private transactionService: TransactionService, private alertService: AlertService) {}
  private userId = ""

  ngOnInit() {
    this.userId = this.authService.currentUserLoggedIn()!.uid;
    this.route.paramMap.subscribe((params)=> {
      this.transactionId = params.get('id');
      if(this.transactionId) {
        this.isEditMode.set(true);
      } else {
        this.isEditMode.set(false)
        this.categoryService.getUserCategories(this.userId).then((categories) =>{
          this.categoriesOfUser.set(categories)
        });
      }
    })
  }

  executeSubmit() {
    if(this.isEditMode()) {

    } else {
      const data = this.formTransactions.getRawValue();
      
      const dateToDate = new Date(data.date!)

      this.transactionService.saveTransaction(this.userId, dateToDate, parseFloat(data.amount!), data.description!, data.category!, "tipo").subscribe({
        next:()=>{
          
          this.alertService.sendMessage("Transaction has been saved successfully")
          this.router.navigateByUrl('main/transactions')
        },
        error:(err) => {
          console.log(err);
        }
      })
    }
  }

  goToCategoriesPage() {
    this.router.navigateByUrl('/main/transactions');
  }
}
