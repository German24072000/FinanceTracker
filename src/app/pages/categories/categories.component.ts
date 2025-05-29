import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { CategoryService } from '../../services/category.service';
import { CategoryInterface } from '../../models/category.interface';
import { NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-categories',
  imports: [CommonModule, NgbDropdownModule],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss',
})
export class CategoriesComponent implements OnInit {
  authService = inject(AuthService);

  categories = signal<CategoryInterface[]>([]);

  private userId = "";

  constructor(
    private categoryService: CategoryService,
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.currentUserLoggedIn()!.uid
    this.addCategoriesOfUserInTable(this.userId);
  }

  navigateToAddCategory() {
    this.router.navigateByUrl('/main/categories/add');
  }

  editCategory(categoryId: string) {
    this.router.navigate(['/main/categories/edit', categoryId]);
  }

  deleteCategory(transactionId: string) {
    this.categoryService.deleteCategory(this.userId,transactionId).subscribe({
      next: () => {
        this.addCategoriesOfUserInTable(this.userId);
        this.alertService.sendMessage("Category has been deleted successfully")
      },
      error: (err) => {
        console.log(err);
      },
    });
  }

  addCategoriesOfUserInTable(userId: string) {
    this.categoryService
      .getUserCategories(userId)
      .then((categoriesFromFb) => {
        this.categories.set(categoriesFromFb);
      });
  }
}
