import {
  Component,
  EventEmitter,
  OnInit,
  output,
  Output,
  signal,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { AuthService } from '../../../services/auth.service';
import { CategoryInterface } from '../../../models/category.interface';
import { AlertService } from '../../../services/alert.service';

@Component({
  selector: 'app-category-form',
  imports: [ReactiveFormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss',
})
export class CategoryFormComponent implements OnInit {
  formCategories = new FormGroup({
    categoryId: new FormControl(''),
    name: new FormControl(''),
    type: new FormControl(''),
    userId: new FormControl(''),
  });

  transactionId: string | null = null;
  isEditMode = signal(false);
  // isEditMode: boolean = false;
  category: CategoryInterface | null = null;

  private userId = "";

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private authService: AuthService,
    private alertService: AlertService
  ) {}

  ngOnInit() {
    this.userId = this.authService.currentUserLoggedIn()!.uid
    this.route.paramMap.subscribe((params) => {
      this.transactionId = params.get('id');
      if (this.transactionId) {
        this.isEditMode.set(true);
        this.loadCategory(this.transactionId);
      } else {
        this.isEditMode.set(false);
        this.formCategories.reset({
          type: 'expense',
        });
      }
    });
  }

  executeSubmit() {
    const valuesOfForm = this.formCategories.getRawValue();

    if (this.isEditMode()) {
      this.categoryService
        .updateCategory(
          valuesOfForm.categoryId!,
          valuesOfForm.name!,
          valuesOfForm.type!,
          this.userId
        )
        .subscribe({
          next: () => {
            this.alertService.sendMessage(
              'Category has been updated successfully'
            );
            this.router.navigateByUrl('main/categories');
          },
          error: (err) => {
            console.log(err);
          },
        });
    } else {
      this.categoryService
        .saveCategory(
          valuesOfForm.name!,
          valuesOfForm.type!,
          this.userId
        )
        .subscribe({
          next: () => {
            this.alertService.sendMessage(
              'Category has been saved successfully'
            );
            this.router.navigateByUrl('main/categories');
          },
          error: (err) => {
            console.log(err);
          },
        });
    }
  }

  goToCategoriesPage() {
    this.router.navigateByUrl('main/categories');
  }

  loadCategory(transactionId: string) {
    this.categoryService
      .getCategoryById(this.userId,transactionId)
      .then((categoryFromDb) => {
        this.formCategories.reset({
          categoryId: categoryFromDb.categoryId,
          name: categoryFromDb.name,
          type: categoryFromDb.type,
          userId: categoryFromDb.userId,
        });
      });
  }
}
