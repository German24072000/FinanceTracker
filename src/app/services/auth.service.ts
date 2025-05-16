import { inject, Injectable, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { from, Observable } from 'rxjs';
import { UserInterface } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  firebaseAut = inject(Auth)

  user$ = user(this.firebaseAut)
  currentUserLoggedIn = signal< UserInterface | null | undefined>(undefined);

  constructor() { }

  loginUser(email:string, password:string):Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAut, email, password).then(() => {});
    return from(promise);
  }

  registerUser(email:string, password:string, username:string):Observable<void> {
    const promise = createUserWithEmailAndPassword(this.firebaseAut,email,password).then(
      (response) => {
        return updateProfile(response.user, {displayName: username}).then(
          () => {
            return response.user.reload();
          }
        )
      }
    );

    return from(promise);
  }

  logOutUser() {
    const promise = signOut(this.firebaseAut)
    return from(promise)

  }
}
