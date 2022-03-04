import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { UserService } from '../user.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  username: string = "";
  password: string = "";

  constructor(private http: HttpService, private user: UserService, private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    console.log(`${this.username} ${this.password}`);
    if(this.username !== "" && this.password !== "") {
      this.http.get(`/login?uname=${this.username}&pass=${this.password}`).subscribe((data: any) => {
        console.log(data);
        if(data['logged']) {
          this.user.setUser(data['username']);
          this.router.navigateByUrl('');
        }
      })
    }
  }
}
