import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-upvotes',
  templateUrl: './upvotes.component.html',
  styleUrls: ['./upvotes.component.css']
})
export class UpvotesComponent implements OnInit {
  @Input() dorm_name: string = "";
  @Input() reviews: any = {};
  selected: boolean = false;

  constructor(private http: HttpService, private auth: AuthService) { }

  ngOnInit(): void {
  }

  submit() {
    if (this.auth.googleIsLoggedIn()) {
      var currentUser = this.auth.googleGetUserDisplayName();
      this.selected = !this.selected;
      if (this.containsUser(currentUser) && this.selected == false) {
        this.reviews.upvotes.splice(this.reviews.upvotes.indexOf(currentUser));
        console.log(this.reviews);
        // this.http.put(`/dorms/${this.dorm_name}/reviews/${currentUser}`, {
        //   "content": this.reviews.msg,
        //   "stars": this.reviews.stars,
        //   "upvotes": this.reviews.upvotes
        // }).subscribe((data) => {
        //   console.log(data);
        // });
      }

      else if (!this.containsUser(currentUser) && this.selected == true) {
        this.reviews.upvotes.push(currentUser);
        console.log(this.reviews);
        // this.http.put(`/dorms/${this.dorm_name}/reviews/${currentUser}`, {
        //   "content": this.reviews.msg,
        //   "stars": this.reviews.stars,
        //   "upvotes": this.reviews.upvotes
        // }).subscribe((data) => {
        //   console.log(data);
        // });
      }
    }
  }

  containsUser(currentUser: string) {
    for (let i = 0; i < this.reviews.upvotes.length; i++) {
      if (this.reviews.upvotes[i] == currentUser) {
        return true;
      }
    }

    return false;
  }
}
