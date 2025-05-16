import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAGpex6c4Vi_XCUYGB92RmvDJbRLWcM0is",
  authDomain: "financetracker-firebase-19dd1.firebaseapp.com",
  projectId: "financetracker-firebase-19dd1",
  storageBucket: "financetracker-firebase-19dd1.firebasestorage.app",
  messagingSenderId: "77376166248",
  appId: "1:77376166248:web:df6142e587b86140045edd"
};


export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes),([provideFirebaseApp(()=> initializeApp(firebaseConfig)),provideAuth(() => getAuth())])]
};
