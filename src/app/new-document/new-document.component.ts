import { Component, OnInit } from '@angular/core';
import { Router} from '@angular/router';
import { Location } from '@angular/common';


@Component({
  selector: 'app-new-document',
  templateUrl: './new-document.component.html',
  styleUrls: ['./new-document.component.css']
})
export class NewDocumentComponent implements OnInit {
  hide: any;
  hideme:any;
  constructor(
        private router: Router,
        private _location: Location

  ) { }

  ngOnInit() {
  }
  hideshow() {
    if (this.hide == null) {
      this.hide = 'hide';

    } else {
      this.hide = null;
    }
  }
  hidealso() {
    if (this.hideme == null) {
      this.hideme = 'hide';

    } else {
      this.hideme = null;
    }
  }
  backClicked() {
    this._location.back();
  }
  opendocument(path) {
    this.router.navigateByUrl('/digital_sign/'+path);
    localStorage.setItem('digitalpath',path)
  }
}
