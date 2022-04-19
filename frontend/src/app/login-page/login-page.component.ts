import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpService } from '../http.service';
import { UserService } from '../user.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.css']
})
export class LoginPageComponent implements OnInit {
  username: string = "";
  password: string = "";

  constructor(
    private http: HttpService,
    private user: UserService,
    private router: Router,
    public authService: AuthService,
    public auth: AngularFireAuth
  ) { }

  ngOnInit(): void {
  }

  loginRegular() {
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
