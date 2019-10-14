import { Component, OnInit,ViewChild, ElementRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload} from '../authentication.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppComponent} from '../app.component';
import { Router } from '@angular/router'
import { Location } from '@angular/common';

@Component({
  selector: 'app-composemail',
  templateUrl: './composemailencrypted.component.html',
  styleUrls: ['./composemailencrypted.component.css']
})

export class ComposemailencryptedComponent implements OnInit {
   details: UserDetails;
   fullname: String;
   userid: string;
   useremail:string;
   email: string;
  // ccemail: string;
  password:string;
  filerror:string;
   loading = false;
   filename:string;
   emailerror:string;
   ccemailerror:string;
   show=true;
   filesToUpload: Array<File> = [];
   filesname = [];
   editorContent: string
   formData: FormData = new FormData();
   @ViewChild('toemail') toemail: ElementRef;
   @ViewChild('subject') subject: ElementRef;
   @ViewChild('message') message: ElementRef;
   @ViewChild('ccemail') ccemail: ElementRef;
  hide: boolean = true;
  selectedMails: any[];
  serchedmail: any[];
  showsearch: boolean;
  result: any =[];
  //  @ViewChild('password') password: ElementRef;
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private AppComponent:AppComponent,
    private router: Router,
    public _location: Location

  ) { }

  ngOnInit() {
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.fullname = this.details.name;
      this.userid = this.details._id;
      this.email = this.details.email;

    });
  }
  backClicked() {
    this._location.back();
  }
  fileChange(fileInput: any) {
   if(this.filerror !=""){
    this.filerror ="";
   }
       this.filesToUpload = <Array<File>>fileInput.target.files;
       const fileList: FileList = fileInput.target.files;
       const files: Array<File> = this.filesToUpload;
    for(let i =0; i < files.length; i++){
        this.formData.append("uploads[]", files[i], files[i]['name']);
    }
       for(var i = 0;i<fileList.length;i++) {
         this.hide=false;
         
       const file: File = fileList[i];
       this.filesname.push({filename:file.name});
       console.log("file",this.filesname)
       }
  }

  removeattachment(name) {
    var attachfiles=[];
    attachfiles=this.formData.getAll("uploads[]"); 
  
    for(var i=0;i<attachfiles.length;i++) {
    //  alert(this.filesname[i].filename)
      if(this.filesname[i].filename === name) {
        this.filesname.splice(i,1);
      }
			if(attachfiles[i].name === name) {
				attachfiles.splice(i,1);
				break;
      }
     
    }
      this.formData.delete("uploads[]");
      for(let i =0; i < attachfiles.length; i++){
        this.formData.append("uploads[]", attachfiles[i], attachfiles[i]['name']);
    }     
  }

  checkEmail(email) {
    var regExp = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    return regExp.test(email);
    }
    
   validateemail() {
    var emails = this.toemail.nativeElement.value;
    if(emails==''){
      return false
    }
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
   autopass(event) {
    if ( event.target.checked ) {
      this.show=false;
      this.password="auto";
    //  this.password.nativeElement.value = "auto";
    } else {
      this.show=true;
      this.password=""
  //    this.password.nativeElement.value = "";
    }
  }
  update(value: string) {
     this.password = value; 
    }
    logout() {
      this.auth.logout();
    }
  sendsmartmail() {
var x =this.formData.getAll("uploads[]")

    if(x.length==0){
      this.filerror="Please Select File"
    //  alert(this.formData.getAll("uploads[]"))
    }
    else{
    this.filerror='';
      if(this.toemail.nativeElement.value === '')
      {
      this.emailerror = 'Enter a valid Email'
      }
      else {
        var emails = this.toemail.nativeElement.value;
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
            this.formData.append('to',this.toemail.nativeElement.value);
            this.formData.append('cc',this.ccemail.nativeElement.value);
            this.formData.append('content',this.message.nativeElement.value);
            this.formData.append('subject',this.subject.nativeElement.value);
            this.formData.append('password',this.password);
            this.formData.append('userId',this.userid);
            this.formData.append('email',this.email);

            
            this.http.post(this.AppComponent.BASE_URL+'/api/encryptfile', this.formData)
                .subscribe(data => {
            this.loading = false;
            alert('Mail sent successfully');
           this.router.navigateByUrl('/sentencmail');
                });
        }
    
  }
}
// alert("else")
}



  selectmail(email) {
    // console.log("as")
    this.selectedMails = [];
    var str = this.toemail.nativeElement.value.toLowerCase();
    this.selectedMails = str.split(",");
    this.selectedMails.pop();
    // console.log("---",email)
    if (this.selectedMails.indexOf(email) === -1) {
      this.selectedMails.push(email);
      console.log(this.selectedMails.join())
      this.toemail.nativeElement.value = this.selectedMails.join();
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
