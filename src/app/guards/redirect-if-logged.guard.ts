import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { openDB } from 'idb';

@Injectable({
    providedIn: 'root'
})
export class RedirectIfLoggedGuard implements CanActivate {

    constructor(private router: Router){}

    canActivate(): Promise<boolean> {
        return openDB('firebaseLocalStorageDb',1).then(db => {
            //The first then(), returns the db IndexedDB
            
            //print the name of Object store of db
            // console.log(db.objectStoreNames);
            
            return db.getAll('firebaseLocalStorage')
        }).then(users => {
            //The second then() return all users in db
            
            if(users.length > 0) {
                this.router.navigateByUrl('/dashboard')

                //return false: Guard not redirect us to loginPage or RegisterPage
                return false;
            } else {
                //return true: Guard redirect us to loginPage or RegisterPage
                return true;
            }
        }).catch(err => {
            console.log('Error to access IndexedDb', err);
            return true;
        })
    }
    
}