import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);
  
  constructor(private router:Router){}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if(user) {
        this.authService.currentUserLoggedIn.set({
          email: user.email!, 
          username: user.displayName!
        })
      } else {
        this.authService.currentUserLoggedIn.set(null);
      }
      console.log(this.authService.currentUserLoggedIn());
      
    })
  }

  logout() {
    this.authService.logOutUser();
    this.router.navigateByUrl('/login')
  }

}
