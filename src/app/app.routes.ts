import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RedirectIfLoggedGuard } from './guards/redirect-if-logged.guard';
import { TransactionsComponent } from './pages/transactions/transactions.component';
import { MainComponent } from './pages/main/main.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { CategoryFormComponent } from './pages/categories/category-form/category-form.component';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
    },
    {
        path: 'login',
        component: LoginComponent,
        //keep the CanActivate Guard
        canActivate: [RedirectIfLoggedGuard]
    },
    {
        path: 'register',
        component: RegisterComponent,
        //keep the CanActivate Guard
        canActivate: [RedirectIfLoggedGuard]
    },
    {
        path: 'main',
        component: MainComponent,
        children: [
            {path: 'dashboard', component: DashboardComponent,},
            {path: 'transactions', component: TransactionsComponent},
            {path: 'categories', component: CategoriesComponent},
            {path: 'categories/add', component: CategoryFormComponent},
            {path: 'categories/edit/:id', component: CategoryFormComponent}
        ]
    }
];
