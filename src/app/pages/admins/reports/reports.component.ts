import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.css']
})
export class ReportsComponent implements OnInit {

  menuSelected: string = '';

  constructor() { }

  ngOnInit(): void {
  }

  changeMenu(menu: string){
    this.menuSelected = menu;
  }

}
