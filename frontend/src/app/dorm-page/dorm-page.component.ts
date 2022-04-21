import { Component, Input, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http'
import { Dorm } from 'src/dorm_interface';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-dorm-page',
  templateUrl: './dorm-page.component.html',
  styleUrls: ['./dorm-page.component.css']
})
export class DormPageComponent implements OnInit {
  dorm_name: string = "";
  dorm: Dorm = {
    address: "",
    bathroom: "",
    class: [""],
    dining_hall: "",
    floors: 0,
    image: [""],
    kitchen: "",
    name: { common: "", official: "" },
    price: 0,
    ratings: [],
    retrieved: false,
    reviews: [],
    room_types: [""],
    shuttle_stop: false
  };
  img: string[] = [];
  slideIndex: number = 0;
  slides: string[] = ["none", "none", "none"]
  currentReview: string = ""
  currentStars: string = "1";
  currentUser: boolean = false;

  constructor(private route: ActivatedRoute, private http: HttpService, private router: Router, private auth: AuthService) {
    this.route.queryParams.subscribe(params => {
      this.dorm_name = params['dorm'];
      this.currentUser = this.auth.googleIsLoggedIn();
    });
  }

  showSlides() {
    for(let i = 0; i < 3; i++) {
      this.slides[i] = "none";
    }

    this.slides[this.slideIndex] = "block";

    this.slideIndex += 1;
    if (this.slideIndex > 1) {
      this.slideIndex = 0;
    }
  }

  ngOnInit(): void {
    if(this.dorm_name && this.dorm_name !== "") {
      this.http.get('/dorms').subscribe((data: any) => {
        data['dorms'].map((dorm: any) => {
          if(dorm.name.common == this.dorm_name) {
            this.dorm = dorm;
            this.dorm.reviews = [];
            this.img = dorm['image'];
            
            this.http.get(`/dorms/${dorm.name.common}/reviews`).subscribe((data: any) => {
              data.reviews.map((review: any) => {
                dorm.reviews.push({
                  user: review.name,
                  msg: review.review.content,
                  stars: review.review.stars,
                  upvotes: review.review.upvotes
                })
              });
            });
          }
        });

        console.log(this.dorm);
      });
    }

    else {
      this.router.navigateByUrl('/dashboard');
    }

    setInterval(() => {
      this.showSlides();
    }, 6000);
  }

  getAverageRating(): string {
    let average = 0;
    let count = 0;
    this.dorm.reviews.map((review) => {
      average += review.stars;
      count += 1;
    });

    return count !== 0 ? Math.ceil(average / count).toString() : "0";
  }

  submitReview() {
    if(this.currentReview !== "" && this.currentReview.length <= 200 && parseInt(this.currentStars) !== 0 && this.auth.googleIsLoggedIn()) {
      this.http.post(`/dorms/${this.dorm_name}/reviews`, {
        "user": this.auth.googleGetUsername(),
        "content": this.currentReview,
        "stars": parseInt(this.currentStars),
        "upvotes": []
      }).subscribe((data) => {
        console.log(data);
        window.location.reload();
      })
    }
  }

}
