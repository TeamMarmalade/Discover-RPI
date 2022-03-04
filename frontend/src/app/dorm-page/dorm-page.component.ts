import { Component, Input, OnInit } from '@angular/core';
import { HttpParams } from '@angular/common/http'
import { Dorm } from 'src/dorm_interface';
import { ActivatedRoute } from '@angular/router';
import { HttpService } from '../http.service';

@Component({
  selector: 'app-dorm-page',
  templateUrl: './dorm-page.component.html',
  styleUrls: ['./dorm-page.component.css']
})
export class DormPageComponent implements OnInit {
  dorm_name: string = "";
  dorm: Dorm | null = null;
  img: string[] = [];
  slideIndex: number = 0;
  slides: string[] = ["none", "none", "none"]

  constructor(private route: ActivatedRoute, private http: HttpService) {
    this.route.queryParams.subscribe(params => {
      this.dorm_name = params['dorm'];
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
    if(this.dorm_name !== "") {
      this.http.get('/dorms').subscribe((data: any) => {
        data['dorms'].map((dorm: any) => {
          if(dorm.name.common == this.dorm_name) {
            this.dorm = dorm;
            this.img = dorm['image'];
            console.log(this.dorm);
          }
        });
      });
    }

    setInterval(() => {
      this.showSlides();
    }, 6000);
  }

}
