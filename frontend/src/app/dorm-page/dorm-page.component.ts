import { Component, Input, OnInit } from '@angular/core';
import { Dorm } from 'src/dorm_interface';

@Component({
  selector: 'app-dorm-page',
  templateUrl: './dorm-page.component.html',
  styleUrls: ['./dorm-page.component.css']
})
export class DormPageComponent implements OnInit {
  @Input() dorm: Dorm = { retrieved: false };

  constructor() { }

  ngOnInit(): void {
  }

}
