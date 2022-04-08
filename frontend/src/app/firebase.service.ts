import { Injectable } from '@angular/core';
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
  app: any
  analytics: any

  constructor() {
    // Import the functions you need from the SDKs you need
    // TODO: Add SDKs for Firebase products that you want to use
    // https://firebase.google.com/docs/web/setup#available-libraries

    // Your web app's Firebase configuration
    // For Firebase JS SDK v7.20.0 and later, measurementId is optional
    const firebaseConfig = {
      apiKey: "AIzaSyB6BmLVmMP5QT7170d5Y3OADCG7r9Oy5RI",
      authDomain: "discover-rpi.firebaseapp.com",
      projectId: "discover-rpi",
      storageBucket: "discover-rpi.appspot.com",
      messagingSenderId: "685287629879",
      appId: "1:685287629879:web:a36d89e365e2773b92cbb2",
      measurementId: "G-4J5TXM08RL"
    };

// Initialize Firebase
    this.app = initializeApp(firebaseConfig);
    this.analytics = getAnalytics(this.app);
  }
}
