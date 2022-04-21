import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user: any = null;

  constructor(
    public auth: AngularFireAuth
  ) {
    this.auth.authState.subscribe((authState) => {
      this.user = authState;
    })
   }

  googleLogin() {
    this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
  }
  googleLogout() {
    this.auth.signOut();
  }
  googleIsLoggedIn() {
    if(this.user) return true;
    return false;
  }
  googleGetUserDisplayName() {
    return this.user.displayName;
  }
  googleGetUserUid() {
    return this.user.uid;
  }
  googleGetUsername() {
    return this.user.username;
  }
}
