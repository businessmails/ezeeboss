import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload } from '../authentication.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-trashmail',
  templateUrl: './filetrashmail.component.html',
  styleUrls: ['./filetrashmail.component.css']
})
export class FileTransferTrashmailComponent implements OnInit {
  details: UserDetails;
  fullname: String;
  userid: string;
  useremail: string;
  checkedmails: any;
  checkedid = [];
  mails: any;
  email: string;
  trashmails: any;
  isSelected = false;
  searchdata: any;
  page = 0;
  limit = 10;
  lastpage: any;
  showprev: boolean = true;
  shownext: boolean = true;
  records: any;
  empty: Object;
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private AppComponent: AppComponent,
    private _location: Location

  ) { }

  backClicked() {
    this._location.back();
  }

  ngOnInit() {
    this.getmails(this.page, this.limit)
  }




  pageination(move) {
    if (move == 'p') {
      this.page = this.page - 1;
    }
    else if (move == 'n') {
      this.page = this.page + 1;
    }
    console.log(this.page, this.limit)
    this.getmails(this.page, this.limit)
  }

  getmails(page, limit) {

    if (page == 0) {
      this.showprev = false;
    } else {
      this.showprev = true;
    }

    this.auth.profile().subscribe(user => {
      this.details = user;
      this.fullname = this.details.name;
      this.userid = this.details._id;
      this.email = this.details.email;
      // console.log(this.useremail)
      this.http.post(this.AppComponent.BASE_URL + '/api/gettrashmailtransfer/' + page + '/' + limit, { userid: this.userid })
        .subscribe(data => {

          if (data != "NO records Found") {
            this.mails = data;
            this.trashmails = this.mails.data;
            this.empty = ""
            this.records = this.mails.count;
            console.log("this.mails.count"), this.mails.count
            this.lastpage = Math.ceil(this.records / limit);
            if (page == (this.lastpage - 1)) {
              this.shownext = false;
            }
            else {
              this.shownext = true;
            }
          }
          else {
            this.shownext = false;
            this.showprev = false;
            this.empty = "No records found";
          }

        });
    });
  }
  logout() {
    this.auth.logout();
  }
  checkAll(ev) {
    this.trashmails.forEach(x => x.selected = ev.target.checked);
    this.isSelected = true;
  }

  isAllChecked() {
    if (this.isSelected == true)
      return this.trashmails.every(_ => _.selected);
  }

  movetosent() {
    this.checkedmails = this.trashmails.filter(_ => _.selected);
    if (this.checkedmails.length == 0) {
      alert('Please Check At Least One Record')
    }
    else {
      if (confirm("Are you sure to move the selected records")) {
        this.checkedid = [];
        for (let i = 0; i < this.checkedmails.length; i++) {
          this.checkedid.push({ id: this.checkedmails[i]._id });
        }
        this.http.post(this.AppComponent.BASE_URL + '/api/movefilemailstosent', { mailid: this.checkedid })
          .subscribe(data => {

            this.getmails(this.page, this.limit)

          });
      }

    }
  }

  deletesmartmail() {
    this.checkedmails = this.trashmails.filter(_ => _.selected);
    if (this.checkedmails.length == 0) {
      alert('Please Check At Least One Record')
    }
    else {
      if (confirm("Are you sure to empty the trash")) {
        this.checkedid = [];
        for (let i = 0; i < this.checkedmails.length; i++) {
          this.checkedid.push({ id: this.checkedmails[i]._id });
        }
        this.http.post(this.AppComponent.BASE_URL + '/api/deletefiletransfermail', { mailid: this.checkedid })
          .subscribe(data => {
            // this.http.post(this.AppComponent.BASE_URL + '/api/gettrashmail', { userid: this.userid })
            //   .subscribe(data => {
            //     this.mails = data;
            //     this.trashmails = this.mails.data;
            //   });

            this.getmails(this.page, this.limit)

          });
      }

    }
  }

  filterarray() {
    var search = this.searchdata;
    if (search != '') {
      var filteredarray = this.mails.data.filter(function (el) {
        // return el.fromemail == search || el.toemail == search || el.subject == search
        console.log('search', search)
        return el.fromemail.indexOf(search) > -1 || el.toemail.indexOf(search) > -1 || el.subject.indexOf(search) > -1
      });
      this.trashmails = filteredarray;
    }
    else {
      this.trashmails = this.mails.data;
    }

  }
  emptytrash() {
    this.http.post(this.AppComponent.BASE_URL + '/api/emptyfiletransfermailtrash', { userid: this.userid })
      .subscribe(data => {
        this.mails = data;
        this.trashmails = this.mails.data;
      });
  }

}
