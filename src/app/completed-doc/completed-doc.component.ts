import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload} from '../authentication.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppComponent} from '../app.component';
import { Location } from '@angular/common';

@Component({
  selector: 'app-completed-doc',
  templateUrl: './completed-doc.component.html',
  styleUrls: ['./completed-doc.component.css']
})
export class CompletedDocComponent implements OnInit {
   details: UserDetails;
   fullname: String;
   userid: String;
   useremail: String;
   location: any;
   cityname: String;
   sendername:string;
   signedlocation:string;
   signeddate:string;
   signedtime:string;
   signedip:string;
   documentdetail:any;
   documents:any;
   videourl:string;
    pageOfItems: Array<any>;
  checkeddocuments: any;
  checkedid: any[];
  isSelected: boolean;
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private AppComponent:AppComponent,
    private _location: Location


  ) { }
 onChangePage(pageOfItems: Array<any>) {
        // update current page of items
        this.pageOfItems = pageOfItems;
    }
  ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.fullname = this.details.name;
      this.userid = this.details._id;
      this.useremail = this.details.email;
      this.http.post(this.AppComponent.BASE_URL+'/api/doccompletedbyme' , {useremail :this.useremail})
      .subscribe(data => {
        this.documentdetail = data;
        this.documents = this.documentdetail.message.reverse();
      });
    });
  }


  setdetail(name,location,date,time,ip) {
   this.sendername = name;
   this.signedlocation = location;
   this.signeddate = date;
   this.signedtime = time;
   this.signedip = ip;
  }
  setvideourl(url) {
    this.videourl = url;
    }
    backClicked() {
      this._location.back();
    }
  checkAll(ev) {
    this.documents.forEach(x => x.selected = ev.target.checked);
    this.isSelected = true;
    //  alert(this.isSelected)
  }

  isAllChecked() {
    if(this.isSelected == true)
    // alert(this.isSelected)
    return this.documents.every(_ => _.selected);
  }
    deletedocument() {
      alert()
    this.checkeddocuments = this.documents.filter(_ => _.selected);
 
    if ( this.checkeddocuments.length == 0 ) {
      alert('Please Check At Least One Record');
    }
    else {
      if (confirm('Are you sure to delete the selected records')) {
        this.checkedid = [];
       for ( let i = 0; i < this.checkeddocuments.length; i++) {
        this.checkedid.push({_id: this.checkeddocuments[i]._id});
       }
       this.http.post( this.AppComponent.BASE_URL+'/api/deletemydocuments', {documentid: this.checkedid})
       .subscribe(data => {
        this.http.post(this.AppComponent.BASE_URL+'/api/doccompletedbyme' , {useremail :this.useremail})
        .subscribe(data => {
          console.log("...\...")
        this.documentdetail = data;
        this.documents = this.documentdetail.message.reverse();
          if(this.documents == ''){
            $('#checkId').hide();
            $('#DeleteID').hide();
            $('#completeRequiredId').hide();
           }
           else{
            $('#checkId').show();
            $('#DeleteID').show();
            $('#completeRequiredId').show();
          }
        });
        
       });
    }

    }
  }
}
