import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Dorm } from 'src/dorm_interface';
import * as d3 from 'd3';

interface Review {
  name: string,
  review: number
}

@Component({
  selector: 'app-home-page',
  templateUrl: './home-page.component.html',
  styleUrls: ['./home-page.component.css']
})
export class HomePageComponent implements OnInit {
  dorms: Dorm[] = [];
  reviews: Review[] = [];

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.http.get('/dorms').subscribe((data: any) => {
      this.dorms = data['dorms'];
      for (let i = 0; i < this.dorms.length; i++) {
        this.dorms[i].retrieved = true;
        this.dorms[i].reviews = [];
        
        let total = 0;
        let count = 0;

        this.http.get(`/dorms/${this.dorms[i].name.common}/reviews`).subscribe((data: any) => {
          data.reviews.map((review: any) => {
            count += 1;
            this.dorms[i].reviews.push({
              user: review.name,
              msg: review.review.content,
              stars: review.review.stars,
              upvotes: review.review.upvotes
            });
            total += review.review.stars;
          });

          this.reviews.push({ name: this.dorms[i].name.common, review: count !== 0 ? Math.ceil(total / count) : 0 });
        });
      }
    });

    setTimeout(() => {
      this.reviews.sort((a, b) => a.name.charCodeAt(0) - b.name.charCodeAt(0));
      let span = d3.select("span").append("main").style("display", "flex").style("align-items", "flex-end");
      span.selectAll("main").data(this.reviews).join("span").style("min-height", "25px").style("height", (d) => `${d.review * 80}px`).style("width", "50px").style("background-color", "gold").style("margin", "5px").append("p").text((d) => d.review).style("color", "black").style("text-align", "center").lower();

      let key = d3.select("article").append("span").style("display", "flex").style("justify-content", "center");
      key.selectAll("span").data(this.reviews).join("span").text((d: any) => `${d.name}`).style("min-width", "50px").style("max-width", "50px").style("font-size", "10px").style("text-align", "center").style("margin", "5px");
    }, 3000);
  }

  redirect(url: string) {

  }

  getAverageRating(dorm: Dorm): number {
    let average = 0;
    let count = 0;
    dorm.reviews.map((review) => {
      average += review.stars;
      count += 1;
    });

    return count !== 0 ? Math.ceil(average / count) : 0;
  }

}
