import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class DashbordHeaderComponent implements OnInit {
  private _location: Location;
  constructor() {
    
   }

  ngOnInit() {
  }
  backClicked() {
 
    this._location.back();
  }
}
