import { Component, OnInit } from '@angular/core';
import { HttpService } from '../http.service';
import { Dorm } from 'src/dorm_interface';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  dorms: Dorm[] = [];

  constructor(private http: HttpService) { }

  ngOnInit(): void {
    this.http.get('/dorms').subscribe((data: any) => {
      this.dorms = data['dorms'];
      for(let i = 0; i < this.dorms.length; i++) {
        this.dorms[i].retrieved = true;
      }
      console.log(this.dorms);
    })
  }

}
