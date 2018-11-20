import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.scss'],
})
export class MainPageComponent {

  public filterNumber: number = 1;
  public listFilter: any = {};
  public displaySidebar: boolean = false;

  constructor() { }

  public onSidebarFilter(filter: any): void {
    this.listFilter = filter;
    this.filterNumber++;
  }

  public toggleSidebar(value: boolean): void {
    this.displaySidebar = value;
  }

}
