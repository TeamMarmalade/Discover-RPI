import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  current_user: string = ""

  constructor(private user: UserService, public auth: AuthService) { }

  ngOnInit(): void {
    this.user.getUserObservable().subscribe((user) => {
      this.current_user = user;
    })
  }

}
