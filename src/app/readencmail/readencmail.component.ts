import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload } from '../authentication.service';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-readmail',
  templateUrl: './readencmail.component.html',
  styleUrls: ['./readencmail.component.css']
})
export class ReadmailencComponent implements OnInit {


  details: UserDetails;
  fullname: String;
  userid: string;
  useremail: string;
  mails: any;
  sentmails: any;
  checkedmails: any;
  checkedid = [];
  isSelected = false;
  searchdata: string;
  email: string;

  fromemail: any;
  toemail: any;
  subject: any;
  mailcontent: any;
  mailread: any;
  mailtrash: any;
  dateadded: any;
  readdate: any;
  firstreaddate: any;
  readcount: any;
  ip: any;
  lastreadip: any;
  time: any;
  date: any;
  lasttime: any;
  lastdate: any;
  @ViewChild('info') info: any;
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
  getMails(page, limit) {

    if (page == 0) {
      this.showprev = false;
    } else {
      this.showprev = true;
    }

    this.http.post(this.AppComponent.BASE_URL + '/api/getencreadmail/' + page + '/' + limit, { userid: this.userid })
      .subscribe(data => {
        if (data != "NO records Found") {
          this.mails = data;
          this.empty = ""
          this.sentmails = this.mails.data;
          this.records = this.mails.count;
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
  }
  pageination(move) {
    if (move == 'p') {
      this.page = this.page - 1;
    }
    else if (move == 'n') {
      this.page = this.page + 1;
    }

    this.getMails(this.page, this.limit)


  }
  ngOnInit() {
    // alert()
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.fullname = this.details.name;
      this.userid = this.details._id;
      this.email = this.details.email;
      this.getMails(this.page, this.limit)
      // console.log(this.useremail)
      // this.http.post(this.AppComponent.BASE_URL + '/api/getencreadmail', { userid: this.userid })
      //   .subscribe(data => {
      //     this.mails = data;
      //     this.sentmails = this.mails.data;
      //   });
    });
  }

  clickme(id) {
    //alert(id)
    console.log('clicked',id)

    this.fromemail = id.fromemail;
    this.toemail = id.to;
    this.subject = id.subject;
    this.mailcontent = id.mailcontent;
    this.mailread = id.mailread;
    this.mailtrash = id.mailtrash;
    this.dateadded = id.dateadded;
    // var res = this.dateadded.split("T");
    // this.date=res[0];
    this.readdate = id.readdate;
    this.firstreaddate = id.firstreaddate;
    this.readcount = id.readcount-1;
    this.ip = id.ip;
    this.lastreadip = id.lastreadip;
    this.info.open();
  }
  logout() {
    this.auth.logout();
  }
  close() {
    console.log('clicked')
    this.info.close();
  }
  filterarray() {
    var search = this.searchdata;
    var filteredarray = this.mails.data.filter(function (el) {
      // return el.fromemail == search || el.toemail == search || el.subject == search

      return el.fromemail.indexOf(search) > -1 || el.toemail.indexOf(search) > -1 || el.subject.indexOf(search) > -1
    });
    this.sentmails = filteredarray;
  }

  checkAll(ev) {

    this.sentmails.forEach(x => x.selected = ev.target.checked);
    this.isSelected = true;
  }

  isAllChecked() {
    if (this.isSelected == true)
      return this.sentmails.every(_ => _.selected);
  }
  movetotrash() {
    this.checkedmails = this.sentmails.filter(_ => _.selected);
    if (this.checkedmails.length == 0) {
      alert('Please Check At Least One Record')
    }
    else {
      if (confirm("Are you sure to delete the selected records")) {
        this.checkedid = [];
        for (let i = 0; i < this.checkedmails.length; i++) {
          this.checkedid.push({ id: this.checkedmails[i]._id });
        }
        this.http.post(this.AppComponent.BASE_URL + '/api/removeencmail', { mailid: this.checkedid })
          .subscribe(data => {
            // this.http.post(this.AppComponent.BASE_URL+'/api/getencreadmail', {userid:this.userid})
            // .subscribe(data => {
            //   this.mails = data;
            //   this.sentmails= this.mails.data;
            // });
            this.page = 0;
            this.getMails(this.page, this.limit)
          });
      }

    }
  }


}
