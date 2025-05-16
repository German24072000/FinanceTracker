import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RedirectIfLoggedGuard } from './guards/redirect-if-logged.guard';

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
        path: 'dashboard',
        component: DashboardComponent
    }
];
