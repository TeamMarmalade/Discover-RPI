import { Component, Input, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http'
import { Dorm } from 'src/dorm_interface';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';
import { AuthService } from '../auth.service';
import * as d3 from 'd3';
import { ASTWithName } from '@angular/compiler';

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

  constructor(private route: ActivatedRoute, private http: HttpService, private router: Router, public auth: AuthService) {
    this.route.queryParams.subscribe(params => {
      this.dorm_name = params['dorm'];
    });
  }

  showSlides() {
    for (let i = 0; i < 3; i++) {
      this.slides[i] = "none";
    }

    this.slides[this.slideIndex] = "block";

    this.slideIndex += 1;
    if (this.slideIndex > 1) {
      this.slideIndex = 0;
    }
  }

  ngOnInit(): void {
    this.currentUser = this.auth.googleIsLoggedIn();
    if (this.dorm_name && this.dorm_name !== "") {
      this.http.get('/dorms').subscribe((data: any) => {
        data['dorms'].map((dorm: any) => {
          if (dorm.name.common == this.dorm_name) {
            this.dorm = dorm;
            this.dorm.reviews = [];
            this.img = dorm['image'];

            this.http.get(`/dorms/${dorm.name.common}/reviews`).subscribe((data: any) => {
              let freq = [0, 0, 0, 0, 0];
              let index = [1, 2, 3, 4, 5];
              data.reviews.map((review: any) => {
                dorm.reviews.push({
                  user: review.name,
                  msg: review.review.content,
                  stars: review.review.stars,
                  upvotes: review.review.upvotes
                });

                freq[review.review.stars - 1] += 1;
              });

              let key = d3.select("article").append("div");
              key.selectAll("div").data(index).join("div").text((d) => `⭐ ${d}`).style("display", "flex").style("align-items", "center").style("justify-content", "flex-end").style("min-height", "30px").style("max-height", "30px").style("font-size", "14px").style("margin-left", "15px").style("margin-bottom", "7px");

              let span = d3.select("span").append("main");
              span.selectAll("main").data(freq).join("span").style("display", "flex").style("align-items", "center").style("justify-content", "flex-end").style("min-width", "25px").style("width", (d) => `${d * 150}px`).style("height", "30px").style("background-color", "gold").style("margin", "5px").append("p").text((d) => d).style("color", "black").style("text-align", "right").style("padding", "3px").style("padding-top", "15px").lower();
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
    if (this.currentReview !== "" && this.currentReview.length <= 200 && parseInt(this.currentStars) !== 0 && this.auth.googleIsLoggedIn()) {
      this.http.post(`/dorms/${this.dorm_name}/reviews`, {
        "user": this.auth.googleGetUserDisplayName(),
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
