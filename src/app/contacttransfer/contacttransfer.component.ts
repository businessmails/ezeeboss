import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload} from '../authentication.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Angular5Csv } from 'angular5-csv/Angular5-csv';
import { AppComponent} from '../app.component';
import { Identifiers, identifierName } from '@angular/compiler';
import { Location } from '@angular/common';

@Component({
  selector: 'app-contacttransfer',
  templateUrl: './contacttransfer.component.html',
  styleUrls: ['./contacttransfer.component.css']
})
export class ContacttransferComponent implements OnInit {
  details: UserDetails;
  fullname: String;
  userid: string;
  name:string;
  email:string;
  contactemail:string;
  contact:string;
  company:string;
  nameerror:string;
  emailerror:string;
  filetransfercontact:any;
  checkedmails:any;
  checkedid=[];
  myfiletransfercontact:any;
  updatedcontacts:any;
  myupdatedcontacts:any;
  detail:any;
  isSelected = false;
  message:string;
  @ViewChild('contactModal') contactModal: any;
  @ViewChild('contactupemail') contactupemail: any;
  @ViewChild('name') contactname: any;
  @ViewChild('company') contactcompany: any;
  @ViewChild('contact') contactcontact: any;
  showprev: boolean;
  res: boolean;
  empty: string;
  csvcontacts: any;
  mycsvcontact: any;
  records: any;
  lastpage: number;
    page = 0;
  limit = 10;
  shownext: boolean;
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private AppComponent:AppComponent,
    private _location: Location

  ) { }
 backClicked() {
    this._location.back();
  }
  ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.fullname = this.details.name;
      this.userid = this.details._id;
      this.email = this.details.email;
     // console.log(this.useremail)

       this.getmails(this.page, this.limit)
    //  this.http.post(this.AppComponent.BASE_URL+'/api/getfiletransfercontacts', {userid:this.userid})
    //  .subscribe(data => {
    //    this.filetransfercontact = data;
    //    this.myfiletransfercontact = this.filetransfercontact.data;
    //  });
    });
  }
  checkAll(ev) {
    this.myfiletransfercontact.forEach(x => x.selected = ev.target.checked);
    this.isSelected = true;
  }
  
  isAllChecked() {
    if(this.isSelected == true)
    return this.myfiletransfercontact.every(_ => _.selected);
  }

  validatename() {
    if(this.name != null) {
      this.nameerror = ''
    } 
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
      this.http.post(this.AppComponent.BASE_URL + '/api/getfiletransfercontacts/' + page + '/' + limit, { userid: this.userid })
        .subscribe(data => {
          this.res=true;
           if (data != "NO records Found") {
             this.empty =""
          this.csvcontacts = data;
          this.mycsvcontact = this.csvcontacts.data;
          this.myfiletransfercontact = this.csvcontacts.data;
            this.records = this.csvcontacts.count;
            // console.log("this.csvcontacts.count"),this.csvcontacts.count
          this.lastpage = Math.ceil(this.records / limit);
          if (page == (this.lastpage - 1)) {
            this.shownext = false;
          }
          else {
            this.shownext = true;
          }
           }
            else{
             this.shownext = false;
             this.showprev =false;
             this.empty="No records found";
          }
        });
    });

  }

  pageination(move) {
    if (move == 'p') {
      this.page = this.page - 1;
    }
    else if (move == 'n') {
      this.page = this.page + 1;
    }
    this.getmails(this.page, this.limit)
  }

  checkEmail(email) {
    var regExp = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regExp.test(email);
    }
    
   validateemail() {
    var emails = this.contactemail;
    var emailArray = emails.split(",");
    var invEmails = "";
    for(var i = 0; i <= (emailArray.length - 1); i++){
      if(this.checkEmail(emailArray[i])){
        this.emailerror = ''
            } else{
              invEmails += emailArray[i] + "\n";
      }
    }
    if(invEmails != ""){
      this.emailerror = 'Invalid Email: ' + invEmails
     // alert("Invalid emails:\n" + invEmails);
    }identifierName
   } 

  updatecontact(id,name,company,contact,email) {
 
    this.http.post(this.AppComponent.BASE_URL+'/api/updatefiletransfercontact', {name:name,email:email,company:company,contact:contact,id:id})
    .subscribe(data => {
      this.updatedcontacts = data;
      this.myupdatedcontacts = this.updatedcontacts.message;
      if(this.myupdatedcontacts == 'Success') {
          this.getmails(this.page, this.limit)

        // this.http.post(this.AppComponent.BASE_URL+'/api/getfiletransfercontacts', {userid:this.userid})
        // .subscribe(data => {
        //   alert('Updated successfully');
        //   this.filetransfercontact = data;
        //   this.myfiletransfercontact = this.filetransfercontact.data;
        // });
      } else {
        alert('Something Went Wrong.Please try Again')
      }
      // this.detail = data;
      // this.message = this.detail.message;
      // if(this.message == 'Email Exists') {
      //   alert('Contact with Email Alredy Exists');
        
      // //  this.contactModal.close();
      // }
      // else {
      // }
    })
  } 

  addcontact() {
    if(this.name == null) {
      this.nameerror = 'Please Enter a Valid Name'

    }
    else if(this.contactemail == null)
    {
    this.emailerror = 'Please Enter a Valid Email'
    } else {
    this.http.post(this.AppComponent.BASE_URL+'/api/addfiletransfercontact', {name:this.name,email:this.contactemail,company:this.company,contact:this.contact,userid:this.userid})
    .subscribe(data => {
      this.detail = data;
      this.message = this.detail.message;
      if(this.message == 'Email Exists') {
        alert('Contact with Email Alredy Exists');
        
      //  this.contactModal.close();
      }
      else {
        alert('Contact Added Successfully');
        this.name = '';
        this.contactemail = '';
        this.company = '';
        this.contact = '';
        this.http.post(this.AppComponent.BASE_URL+'/api/getfiletransfercontacts', {userid:this.userid})
        .subscribe(data => {
          this.contactModal.close();
          this.filetransfercontact = data;
          this.myfiletransfercontact = this.filetransfercontact.data;
        });

      }
    //  alert('Record Update Successfully');
      // this.http.post(this.AppComponent.BASE_URL+'/api/getcsvcontacts', {userid:this.userid})
      // .subscribe(data => {
      //   this.csvcontacts = data;
      //   this.mycsvcontact = this.csvcontacts.data;
      // });
            });
          }
  }

  deletecontact() {
    this.checkedmails= this.myfiletransfercontact.filter(_ => _.selected);
    if(this.checkedmails.length == 0 ) {
      alert('Please Check At Least One Record')
    }
    else {
      if(confirm("Are you sure to delete the selected records")) {
        this.checkedid = [];
       for( let i = 0;i<this.checkedmails.length;i++) {
        this.checkedid.push({id:this.checkedmails[i]._id});
       }
       this.http.post(this.AppComponent.BASE_URL+'/api/deletefiletransfercontacts', {id:this.checkedid})
       .subscribe(data => {
        // this.http.post(this.AppComponent.BASE_URL+'/api/getfiletransfercontacts', {userid:this.userid})
        // .subscribe(data => {
        //   //this.contactModal.close();
        //   this.filetransfercontact = data;
        //   this.myfiletransfercontact = this.filetransfercontact.data;
        // });
          this.getmails(this.page, this.limit)

       });  
    }

    }
  }

  logout() {
    this.auth.logout();
  }
}
