import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload} from '../authentication.service';
import { AppComponent} from '../app.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-user-home-dashboard',
  templateUrl: './user-home-dashboard.component.html',
  styleUrls: ['./user-home-dashboard.component.css']
})
export class UserHomeDashboardComponent implements OnInit {
details:UserDetails;
userid:String;
documentdetail:any;
documents:any;
digitalpath: String;
fullname:String;
email:String;
pendingdocuments:any;
image: String;
  today: string;
  documentdetail_pen: any;
  pendingdocuments_pen: any;
  nodoc: boolean =false;
constructor(
  private http: HttpClient,
  private auth: AuthenticationService,
  private AppComponent: AppComponent,
  private router: Router,
) { }

datechange(e){
   this.http.post(this.AppComponent.BASE_URL+'/api/mydocuments/'+ this.userid, {date :e.target.value})
      .subscribe(data => {
      this.documentdetail_pen = data;
      this.pendingdocuments_pen = this.documentdetail_pen.data.reverse();
      if(this.pendingdocuments_pen.length<=0){
        this.nodoc =true;
      }else{
        this.nodoc =false;
      }
      });



}
  ngOnInit() {
    //  this.today = new Date().toISOString().split('T')[0];
    this.digitalpath = localStorage.getItem('digitalpath');
    
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.fullname = this.details.name;
      this.email = this.details.email;
      this.userid = this.details._id;
      this.image = user.image;
      this.http.post(this.AppComponent.BASE_URL+'/api/doccompletedbyme' , {useremail :this.email})
      .subscribe(data => {
        this.documentdetail = data;
        this.documents = this.documentdetail.message.reverse();
      });

      this.http.post(this.AppComponent.BASE_URL+'/api/docpendingbyme' , {useremail :this.email})
      .subscribe(data => {
      this.documentdetail = data;
      this.pendingdocuments = this.documentdetail.message.reverse();
      });
            
    });
  }
  }

