import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload } from '../authentication.service';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';

// import { Math } from 'es6-shim';
@Component({
  selector: 'app-readmail',
  templateUrl: './readmail.component.html',
  styleUrls: ['./readmail.component.css']
})
export class ReadmailComponent implements OnInit {


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
  id: any;
  data2: any;
  length: any;
  records: any;
  page = 0;
  limit = 10;
  lastpage: any;
  showprev: boolean = true;
  shownext: boolean = true;
  empty: boolean = false;
  emptyMsg: string;
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private AppComponent: AppComponent,
    private _location: Location

  ) { }

  backClicked() {
    this._location.back();
  }
  getReadMails(page, limit) {
    if (page == 0) {
      this.showprev = false;
    } else {
      this.showprev = true;
    }
    // console.log(page, limit)
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.fullname = this.details.name;
      this.userid = this.details._id;
      this.email = this.details.email;
      this.http.post(this.AppComponent.BASE_URL + '/api/getreadmail/' + page + '/' + limit, { userid: this.userid })
        .subscribe(data => {
          if (data != "NO records Found") {

            this.empty = false;
            this.mails = data;
            this.records = this.mails.count;
            this.sentmails = this.mails.data;
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
            this.empty = true;
            this.emptyMsg = "No records found";
          }
        });
    });
  }
  ngOnInit() {
    // alert()
    this.getReadMails(this.page, this.limit)

    // this.getReadMails()
  }

  pageination(move) {
    if (move == 'p') {
      this.page = this.page - 1;
    }
    else if (move == 'n') {
      this.page = this.page + 1;
    }
    this.getReadMails(this.page, this.limit)


  }
  clickme(idd) {
    //alert(id)
    this.http.get(this.AppComponent.BASE_URL + '/api/getreadmail/' + idd._id)
      .subscribe(data => {
        this.id = data;
        this.data2 = this.id.data[0]
        this.fromemail = this.data2.fromemail;
        this.toemail = this.data2.toemail;
        this.subject = this.data2.subject;
        this.mailcontent = this.data2.mailcontent;
        this.mailread = this.data2.mailread;
        this.mailtrash = this.data2.mailtrash;
        this.dateadded = this.data2.dateadded;
        // var res = this.dateadded.split("T");
        // this.date=res[0];
        this.readdate = this.data2.readdate;
        this.firstreaddate = this.data2.firstreaddate;
        if(parseInt(this.data2.readcount)!=1){
 this.readcount = (parseInt(this.data2.readcount) - 1);
        }
       else{
 this.readcount = (parseInt(this.data2.readcount));

       }
        this.ip = this.data2.ip;
        this.lastreadip = this.data2.lastreadip;
        this.length = this.id.attachmets.length
        this.info.open();

      });

  }
  logout() {
    this.auth.logout();
  }
  close() {
    this.info.close();
  }
  filterarray() {
    var search = this.searchdata;
    if (search != '') {
      var filteredarray = this.mails.data.filter(function (el) {
        // return el.fromemail == search || el.toemail == search || el.subject == search
        return el.fromemail.indexOf(search) > -1 || el.toemail.indexOf(search) > -1 || el.subject.indexOf(search) > -1
      });
      this.sentmails = filteredarray;
    }
    else {
      this.sentmails = this.mails.data;
    }

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
        this.http.post(this.AppComponent.BASE_URL + '/api/movesmartmailstotrash', { mailid: this.checkedid })
          .subscribe(data => {
            this.getReadMails(this.page, this.limit);

          });
      }

    }
  }


}
