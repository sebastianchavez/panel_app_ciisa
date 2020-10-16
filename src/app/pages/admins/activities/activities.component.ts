import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-activities',
  templateUrl: './activities.component.html',
  styleUrls: ['./activities.component.css']
})
export class ActivitiesComponent implements OnInit {

  mytime: Date = new Date();
  mytime2: Date = new Date();

  constructor() { }

  ngOnInit(): void {
  }

}
