import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

import { openDB } from 'idb';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, RouterModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {

fb = inject(FormBuilder);
router = inject(Router);
authService = inject(AuthService)

form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required]
  });

  constructor(){}
  ngOnInit(): void {
    // openDB('firebaseLocalStorageDb', 1).then((db) =>{
    //   return db.getAll("fbase_key")
    // }).then((users) => {
    //   if(users.length > 0) {
    //     this.router.navigateByUrl("/dashboard");
    //   } else {
    //     console.log("no hay usuarios");
    //   }
    // }).catch((error) => {
    //   console.log("error to entry indexdb", error);
      
    // })
  }

  onSubmit() {
    const credentialsOfForm = this.form.getRawValue()

    this.authService.loginUser(credentialsOfForm.email, credentialsOfForm.password).subscribe({
      next: () => {
        this.router.navigateByUrl("/main/dashboard");
      },
      error: (err) => {
        console.log(err.code);
        
      }
    })
  }
}
