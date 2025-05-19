import { inject, Injectable, signal } from '@angular/core';
import { Auth, signInWithEmailAndPassword, signOut, updateProfile, user } from '@angular/fire/auth';
import { createUserWithEmailAndPassword } from '@firebase/auth';
import { from, Observable } from 'rxjs';
import { UserInterface } from '../models/user.interface';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { Firestore } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  db = getFirestore();

  firebaseAut = inject(Auth)

  user$ = user(this.firebaseAut)
  currentUserLoggedIn = signal< UserInterface | null | undefined>(undefined);

  constructor(private firestore: Firestore) { }

  loginUser(email:string, password:string):Observable<void> {
    const promise = signInWithEmailAndPassword(this.firebaseAut, email, password).then(() => {});
    return from(promise);
  }

  registerUser(email:string, password:string, username:string) {

    const promise = createUserWithEmailAndPassword(this.firebaseAut, email, password).then((response) => {
      const user = response.user

      return updateProfile(user, {displayName: username}).then(() => {
        const userId = user.uid;
        const referenceOfDoc = doc(this.db, 'users', userId)
        const userData: UserInterface = {
          uid: userId!,
          email: user.email!,
          username: user.displayName!,
          currency: "$"
        }

        //setDoc() guarda los datos
        return setDoc(referenceOfDoc, userData)
      })
    })

    return from(promise);
  }

  logOutUser() {
    const promise = signOut(this.firebaseAut)
    return from(promise)

  }
}
