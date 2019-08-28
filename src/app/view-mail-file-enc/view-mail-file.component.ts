import { Component, OnInit,ElementRef, ViewChild } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload } from '../authentication.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppComponent } from '../app.component';
import { Location } from '@angular/common';
@Component({
  selector: 'app-view-mail-file-enc',
  templateUrl: './view-mail-file.component.html',
  styleUrls: ['./view-mail-file.component.css']
})
export class ViewEncMailFileComponent implements OnInit {
  details: UserDetails;
  fullname: String;
  userid: string;
  email: string;
  data: any;
  fromemail: string;
  toemail: string;
  forwardtoemail: string;
  subject: string;
  date: string;
  innerhtml: any;
  attachment: string;
  filename: string;
  emailerror: string;
  filesToUpload: Array<File> = [];
  filesname = [];
  editorContent: string
  loading = false;
  noofattachment: number;
  formData: FormData = new FormData();
  forwardmsg = false;
  attachmentLINK: any;
  hide=false;
  delname: any;
  result: any;
  showsearch: boolean;
  serchedmail: any;
  selectedMails: any[];
    @ViewChild('toemails') toemails: ElementRef;
   @ViewChild('subjects') subjects: ElementRef;
   @ViewChild('message') message: ElementRef;
   @ViewChild('ccemail') ccemail: ElementRef;
  ccemailerror: string;
  show: boolean = true;
  password: string;
  cc: any;
  suberror: string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthenticationService,
    private AppComponent: AppComponent,
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
        this.http.get(this.AppComponent.BASE_URL + '/api/getencreadmail/' + mailid)
          .subscribe(data => {
            this.data = data;
            // console.log(this.data.data)
            // this.data=this.data
            this.delname= this.data.data[0].attachment;
            this.attachment = this.data.data[0].attachment+'_ency.pdf';
            this.fromemail = this.email;
            this.toemail = this.data.data[0].to;
            this.password = this.data.data[0].password;
            this.cc = this.data.data[0].cc;

            this.subject = this.data.data[0].subject;
            this.date = this.data.data[0].dateadded;
            this.innerhtml = this.data.data[0].mailcontent;
            this.attachmentLINK =  this.data.data[0].attachment+'/'+this.data.data[0].attachment+'_ency.pdf';
          });
      })
    })
  }

 update(value: string) {
     this.password = value; 
    }
  backClicked() {
    this._location.back();
  }

  forwardmessage() {
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
    for (let i = 0; i < files.length; i++) {
      this.formData.append("uploads[]", files[i], files[i]['name']);
    }
    for (var i = 0; i < fileList.length; i++) {
      const file: File = fileList[i];
      this.filesname.push({ filename: file.name });
    }
  }

  removeattachment(name) {
// alert(this.attachment.length)
    for (var i = 0; i < this.attachment.length; i++) {
      if (this.data.data[0].attachment === name) {
        this.data.message.splice(i, 1)
      }
    }
  
  }

ccvalidateemail() {
    var emails = this.ccemail.nativeElement.value;
    // alert(emails)
    if(emails==''){
      return false;
    }
    var emailArray = emails.split(",");
    var invEmails = "";
    for(var i = 0; i <= (emailArray.length - 1); i++){
      if(this.checkEmail(emailArray[i])){
        this.ccemailerror = ''
            } else{
              invEmails += emailArray[i] + "\n";
      }
    }
    if(invEmails != ""){
      this.ccemailerror = 'Invalid Email: ' + invEmails
     // alert("Invalid emails:\n" + invEmails);
    }
   } 
  checkEmail(email) {
    var regExp = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regExp.test(email);
  }

  validateemail() {
    var emails = this.toemail;
    // alert(JSON.stringify(emails))
    var emailArray = emails.split(",");
    var invEmails = "";
    for (var i = 0; i <= (emailArray.length - 1); i++) {
      if (this.checkEmail(emailArray[i])) {
        this.emailerror = ''
      } else {
        invEmails += emailArray[i] + "\n";
      }
    }
    if (invEmails != "") {
      this.emailerror = 'Invalid Email: ' + invEmails
    }
  }

  sendsmartmail() {
    if (this.toemail == '') {
      this.emailerror = 'Enter a valid Email'
    }
    else {
      var emails = this.toemail;
      var emailArray = emails.split(",");
      var invEmails = "";
      for (var i = 0; i <= (emailArray.length - 1); i++) {
        if (this.checkEmail(emailArray[i])) {

        } else {
          invEmails += emailArray[i] + "\n";
        }
      }
      if (invEmails != "") {
        this.emailerror = 'Invalid Email: ' + invEmails
      } else {
          if(this.toemails.nativeElement.value === '')
      {
      this.emailerror = 'Enter a valid Email'
      return false;
      }
      // if(this.subjects.nativeElement.value === '')
      // {
      // this.suberror = 'Subject is Required'
      // return false;
      // }
        this.loading = true;

        this.formData.append('from', this.userid);
        this.formData.append('data', this.innerhtml);
        // this.formData.append('fromemail', this.email);
        // this.formData.append('toemail', this.toemail);
         this.formData.append('to',this.toemails.nativeElement.value);
            this.formData.append('cc',this.ccemail.nativeElement.value);
            this.formData.append('content',this.message.nativeElement.value);
            this.formData.append('subject',this.subjects.nativeElement.value);
        this.formData.append('subject', "FW - "+this.subject);
        this.formData.append('filelink', this.attachmentLINK);
        this.formData.append('file', this.delname);
        this.formData.append('cc', this.cc);
        this.formData.append('userId', this.userid);



        this.formData.append('password', this.password);


        this.http.post(this.AppComponent.BASE_URL + '/api/frowardEncMail', this.formData)
          .subscribe(data => {
            this.loading = false;
            alert('Mail Sent Successfully');
            this.router.navigateByUrl('/sentencmail');
          });
      }

    }
  }


  selectmail(email) {
    // console.log("as")
    this.selectedMails = [];
    var str = this.toemails.nativeElement.value.toLowerCase();
    this.selectedMails = str.split(",");
    this.selectedMails.pop();
    // console.log("---",email)
    if (this.selectedMails.indexOf(email) === -1) {
      this.selectedMails.push(email);
      console.log(this.selectedMails.join())
      this.toemails.nativeElement.value = this.selectedMails.join();
      this.emailerror = '';
    }
    this.serchedmail = [];
    this.showsearch = false;

  }



  search(email) {
    var mailarray = email.split(',');
    email = mailarray[mailarray.length - 1];
    if (email != '') {
      this.http.post(this.AppComponent.BASE_URL + '/api/serchEncmail', { email: email ,userId:this.userid })
        .subscribe(data => {
          this.result = data;
          if(this.result.result.length>0){
      this.showsearch = true;

          this.serchedmail = this.result.result;

          }
          else{
  this.showsearch = false;
          }
          
        });
    } else {
      this.showsearch = false;
      this.serchedmail = []
    }

  }










}
