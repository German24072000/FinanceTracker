import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  
fb = inject(FormBuilder);
router = inject(Router);
authService = inject(AuthService);

form = this.fb.nonNullable.group({
    email: ['', Validators.required],
    password: ['', Validators.required],
    username: ['', Validators.required]
  });
  
  onSubmit() {
    const valuesOfForm = this.form.getRawValue();

    this.authService.registerUser(valuesOfForm.email, valuesOfForm.password, valuesOfForm.username).subscribe({
      next: () => {
        this.router.navigateByUrl("/dashboard");
      }
      ,error: (err) => {
        console.log(err.code);
        
      }
    });

  }
}
