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

  constructor(private route: ActivatedRoute, private http: HttpService) {
    this.route.queryParams.subscribe(params => {
      this.dorm_name = params['dorm'];
    });
  }

  ngOnInit(): void {
    if(this.dorm_name !== "") {
      this.http.get('/dorms').subscribe((data: any) => {
        data['dorms'].map((dorm: any) => {
          if(dorm.name.common == this.dorm_name) {
            console.log('set');
            this.dorm = dorm;
            console.log(this.dorm);
          }
        })
      });
    }
  }

}
