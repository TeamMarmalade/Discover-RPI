import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  update_user: any;
  user_observable = new Observable<string>((observer) => {
    this.update_user = (new_val: string) => {
      observer.next(new_val);
    }
  })
  username: string = "";

  constructor() { }

  getUserObservable() {
    return this.user_observable;
  }

  setUser(name: string) {
    this.update_user(name);
  }

  logout() {
    this.username = '';
  }
}
