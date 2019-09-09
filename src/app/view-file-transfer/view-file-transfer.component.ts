import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails} from '../authentication.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AppComponent} from '../app.component';
import {Location} from '@angular/common';

@Component({
  selector: 'app-view-transfer-file',
  templateUrl: './view-file-transfer.component.html',
  styleUrls: ['./view-file-transfer.component.css']
})
export class ViewFileComponent implements OnInit {
  details: UserDetails;
  fullname: String;
  userid: string;
  email: string;
  data:any;
  fromemail:string;
  toemail:string;
  forwardtoemail:string;
  subject:string;
  date:string;
  innerhtml:any;
  attachment:string;
  filename:string;
  emailerror:string;
  filesToUpload: Array<File> = [];
  filesname = [];
  editorContent: string
  loading= false;
  noofattachment:number;
  formData: FormData = new FormData();
  forwardmsg = false;
    @ViewChild('toemails') toemails: ElementRef;
  @ViewChild('subjects') subjects: ElementRef;
  @ViewChild('datas') datas: ElementRef;
  @ViewChild('password') password: ElementRef;
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthenticationService,
    private AppComponent:AppComponent,
    private router: Router,
    private _location: Location


  ) { }

  ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.fullname = this.details.name;
      this.userid = this.details._id;
      this.email = this.details.email;  
      this.activatedRoute.params.subscribe((params: Params) => {
      const mailid = params['mailid'];
      // this.http.get(this.AppComponent.BASE_URL+'/api/viewsmartmail/'+ mailid)
      this.http.get(this.AppComponent.BASE_URL + '/api/viewfilemail/' + mailid)
      .subscribe(data => {
       this.data = data;
       this.attachment = this.data.message;
       this.fromemail = this.data.message[0].fromemail;
       this.toemail = this.data.message[0].toemail;
       this.subject= this.data.message[0].subject;
      //  console.log(this.subject)
       this.date = this.data.message[0].date;
       this.innerhtml = this.data.message[0].data;
       this.noofattachment = this.data.message[0].noofattachments;
    });
  })
  })
} 

 logout() {
    this.auth.logout();
  }
 backClicked() {
    this._location.back();
  }

  
forwardmessage(){
this.forwardmsg = true;
}
back(){
this.forwardmsg = true;
}
print(printSectionId: string) {
  window.print();
       let popupWinindow
        let innerContents = document.getElementById(printSectionId).innerHTML;
        popupWinindow.document.open();
        popupWinindow.document.write('<html><head><link rel="stylesheet" href="https://ezeeboss.com/assets/css/bootstrap.min.css"><link rel="stylesheet" type="text/css" href="https://ezeeboss.com/assets/css/view-mail-file.component.css" /></head><body onload="window.print()">' + innerContents + '</html>');
        popupWinindow.document.close();
}

fileChange(fileInput: any) {
  this.filesToUpload = <Array<File>>fileInput.target.files;
  const fileList: FileList = fileInput.target.files;
  const files: Array<File> = this.filesToUpload;
for(let i =0; i < files.length; i++){
   this.formData.append("uploads[]", files[i], files[i]['name']);
}
  for(var i = 0;i<fileList.length;i++) {
  const file: File = fileList[i];
  this.filesname.push({filename:file.name});
  }
}

removeattachment(name) {

  for(var i = 0; i< this.attachment.length; i++) {
    if(this.data.message[i].attachmentname === name) {
      this.data.message.splice(i,1)
       }
  }
     
}

checkEmail(email) {
var regExp = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
return regExp.test(email);
}

validateemail() {
var emails = this.toemail;
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
}
} 

// sendsmartmail() {
//  if(this.toemail == '')
//  {
//  this.emailerror = 'Enter a valid Email'
//  }
//  else {
//    var emails = this.toemail;
//    var emailArray = emails.split(",");
//    var invEmails = "";
//    for(var i = 0; i <= (emailArray.length - 1); i++){
//      if(this.checkEmail(emailArray[i])){
       
//            } else{
//              invEmails += emailArray[i] + "\n";
//      }
//    }
//    if(invEmails != ""){
//      this.emailerror = 'Invalid Email: ' + invEmails
//    } else {
//        this.loading = true;
//        this.formData.append('from',this.userid);
//        this.formData.append('data',this.innerhtml);
//        this.formData.append('fromemail',this.email);
//        this.formData.append('toemail',this.toemail);
//        this.formData.append('subject',this.subject);
//        this.http.post(this.AppComponent.BASE_URL+'/api/sendsmartmail', this.formData)
//            .subscribe(() => {
//        this.loading = false;
//        alert('Mail Sent Successfully');
//        this.router.navigateByUrl('/sentmail');
//            });
//    }

// }
// }

sendsmartmail() {
    //  console.log(this.editorContent)
 

          if(this.toemails.nativeElement.value === '')
      {
      this.emailerror = 'Enter a valid Email'
      }
      else {
        var emails = this.toemails.nativeElement.value;
        var emailArray = emails.split(",");
        var invEmails = "";
        for(var i = 0; i <= (emailArray.length - 1); i++){
          if(this.checkEmail(emailArray[i])){
            
                } else{
                  invEmails += emailArray[i] + "\n";
          }
        }
        if(invEmails != ""){
          this.emailerror = 'Invalid Email: ' + invEmails
         // alert("Invalid emails:\n" + invEmails);
        } else {
          this.loading = true;
          this.formData.append('from',this.userid);
          this.formData.append('data',this.datas.nativeElement.value);
          this.formData.append('fromemail',this.email);
          this.formData.append('toemail',this.toemails.nativeElement.value);
          this.formData.append('subject',this.subjects.nativeElement.value);
          this.formData.append('password',this.password.nativeElement.value);
          this.http.post(this.AppComponent.BASE_URL+'/api/sendfiletransfermail', this.formData)
              .subscribe(data => {
                this.loading = false;
                alert('Mail Sent Successfully');
                this.router.navigateByUrl('/senttransfer');
              });
        }
    
  }

    }


}
