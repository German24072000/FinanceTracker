import { Component, ElementRef, inject, OnInit, signal } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {Router,RouterLink,RouterLinkActive,RouterOutlet,} from '@angular/router';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-main',
  imports: [RouterLink, RouterOutlet, RouterLinkActive],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  authService = inject(AuthService);
  alertMessage = signal<string | null>('');

  constructor(
    private router: Router,
    private alertService: AlertService
  ) {}

  ngOnInit(): void {
    this.authService.user$.subscribe((user) => {
      if (user) {
        this.authService.currentUserLoggedIn.set({
          uid: user.uid,
          email: user.email!,
          username: user.displayName!,
          currency: '$',
        });

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
    });

    this.alertService.message$.subscribe((message) => {
      this.alertMessage.set(message);

      setTimeout(() => {
        this.alertMessage.set(null);
      }, 3000);
    });
  }

  logout() {
    this.authService.logOutUser();
    this.router.navigateByUrl('/login');
  }
}
