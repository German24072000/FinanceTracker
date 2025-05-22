import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-main',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss'
})
export class MainComponent implements OnInit {
authService = inject(AuthService);

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
