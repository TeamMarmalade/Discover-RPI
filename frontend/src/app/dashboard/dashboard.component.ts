import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Dorm } from 'src/dorm_interface';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dorms: Dorm[] = [];

  constructor(private http: HttpService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.http.get('/dorms').subscribe((data: any) => {
      this.dorms = data['dorms'];
      for (let i = 0; i < this.dorms.length; i++) {
        this.dorms[i].retrieved = true;
        this.dorms[i].reviews = [];
        this.http.get(`/dorms/${this.dorms[i].name.common}/reviews`).subscribe((data: any) => {
          data.reviews.map((review: any) => {
            this.dorms[i].reviews.push({
              user: review.name,
              msg: review.review.content,
              stars: review.review.stars,
              upvotes: review.review.upvotes
            });
          });
          this.dorms.sort((a, b) => parseInt(this.getAverageRating(b)) - parseInt(this.getAverageRating(a)));
        });
      }
    });
  }

  getAverageRating(dorm: Dorm): string {
    let average = 0;
    let count = 0;
    dorm.reviews.map((review) => {
      average += review.stars;
      count += 1;
    });

    return count !== 0 ? Math.ceil(average / count).toString() : "0";
  }

  navigate(dorm: string) {
    this.router.navigateByUrl(`dorm?dorm=${dorm}`);
  }
}
