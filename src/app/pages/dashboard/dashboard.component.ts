import { Component, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { TransactionsComponent } from "../transactions/transactions.component";
import { getAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-dashboard',
  imports: [TransactionsComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
  authService = inject(AuthService);

  //variable for to send TransactionComponent with Input
  // userId = signal('');
  
  constructor(private router:Router){}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if(user) {
        this.authService.currentUserLoggedIn.set({
          uid: user.uid,
          email: user.email!, 
          username: user.displayName!,
          currency: '$'
        })

        // this.userId.set(this.authService.currentUserLoggedIn()!.uid)
        // console.log(this.userId());
        
      } else {
        this.authService.currentUserLoggedIn.set(null);
      }
      console.log(this.authService.currentUserLoggedIn());
      
      /*At the moment I get rid of this code because
      I can get the data of new user by signal currentUserLoggedIn() */
      //const registeredUser = this.authService.firebaseAut.currentUser
      // console.log(registeredUser);
      
      
    })
  }

  logout() {
    this.authService.logOutUser();
    this.router.navigateByUrl('/login')
  }

}
