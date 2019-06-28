import { Component, OnInit,ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppComponent} from '../app.component';


@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
  details: UserDetails;
  fullname: String;
  email: string;
  userid: string;
  data: any;
  contactdata: any;
  contactdetail: any;
  checkedmails: any;
  digitalpath: string;
  checkedid= [];
  isSelected = false;
  updatedcontacts: any;
  myupdatedcontacts: any;
  @ViewChild('contactupemail') contactupemail: any;
  @ViewChild('fname') fname: any;
  @ViewChild('lname') lname: any;
  @ViewChild('address') address: any;
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private spinnerService: Ng4LoadingSpinnerService,
    private AppComponent: AppComponent
  ) {}

  ngOnInit() {
    this.digitalpath = localStorage.getItem('digitalpath')
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.fullname = this.details.name;
      this.email = this.details.email;
      this.userid = this.details._id;
      this.http.get(this.AppComponent.BASE_URL+ '/api/mycontacts/' + this.userid)
      .subscribe(data => {
        this.data = data;
        this.contactdetail = this.data.data;
      });
    })
  }


  updatecontact(id) {
    this.http.post(this.AppComponent.BASE_URL+'/api/updatemycontact', {fname:this.fname.nativeElement.value,email:this.contactupemail.nativeElement.value,lname:this.lname.nativeElement.value,address:this.address.nativeElement.value,id:id})
    .subscribe(data => {
      this.updatedcontacts = data;
      this.myupdatedcontacts = this.updatedcontacts.message;
      if(this.myupdatedcontacts == 'Success') {
        this.http.get(this.AppComponent.BASE_URL+'/api/mycontacts/'+ this.userid)
        .subscribe(data => {
          alert('Updated successfully');
          this.contactdata = data;
          this.contactdetail = this.contactdata.data;
        });
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

  checkAll(ev) {
    this.contactdetail.forEach(x => x.selected = ev.target.checked);
    this.isSelected = true;
    // alert(this.isSelected)
  }

  isAllChecked() {
    if(this.isSelected == true)
    return this.contactdetail.every(_ => _.selected);
  }

  deletecontact() {
    this.checkedmails = this.contactdetail.filter(_ => _.selected);
    if ( this.checkedmails.length == 0 ) {
      alert('Please Check At Least One Record');
    }
    else {
      if (confirm('Are you sure to delete the selected records')) {
        this.checkedid = [];
       for ( let i = 0; i < this.checkedmails.length; i++) {
        this.checkedid.push({id: this.checkedmails[i]._id});
       }
       this.http.post(this.AppComponent.BASE_URL + '/api/deletemycontact', {contactid: this.checkedid})
       .subscribe(data => {
        this.http.get(this.AppComponent.BASE_URL + '/api/mycontacts/' + this.userid)
        .subscribe(data => {
          //this.contactModal.close();
          this.contactdata = data;
          this.contactdetail = this.contactdata.data;
        });
       });
    }

    }
  }

}
