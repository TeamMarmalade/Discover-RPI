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
      for(let i = 0; i < this.dorms.length; i++) {
        this.dorms[i].retrieved = true;
      }
      console.log(this.dorms);
    })
  }

  getAverageRating(dorm: Dorm): string {
    if(dorm.ratings) {
      let avg: number = 0;
      for(let i = 0; i < dorm.ratings?.length; i++) {
        avg += dorm.ratings[i];
      }

      return Math.ceil(avg/dorm.ratings.length).toString();
    }

    return "";
  }

  navigate(dorm: string) {
    console.log('clicked');
    this.router.navigateByUrl(`dorm?dorm=${dorm}`);
  }

}
