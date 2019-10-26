import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload} from '../authentication.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppComponent} from '../app.component';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
import { Location } from '@angular/common';

@Component({
  selector: 'app-actionrequired',
  templateUrl: './actionrequired.component.html',
  styleUrls: ['./actionrequired.component.css']
})
export class ActionrequiredComponent implements OnInit {
   details: UserDetails;
   fullname: String;
   email: string;
   userid: String;
   documents: any;
   documentdetail: any;
   digitalpath: String;
   expdate: false;
   Date: false;
   isSelected = false;
   documentdata: any;
   checkeddocuments: any;
   checkedid= [];
   doc: any;
   searched:any;
   Search: String;
   fromdate: any;
   todate: any;
   filterarray=[];
   filteredarray =[];
   olddocuments: any;
   documentid: any;
   x:any;
  
      //all items to be paged
      items: Array<any>;
      //current page of items
      pageOfItems: Array<any>;

   constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private AppComponent: AppComponent,
    private router: Router,
  private _location: Location

  ) { }
 backClicked() {
    this._location.back();
  }

  ngOnInit() {
    this.digitalpath = localStorage.getItem('digitalpath');
    //   console.log(this.documents);
    // alert(this.digitalpath);
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.fullname = this.details.name;
      this.email = this.details.email;
      this.userid = this.details._id;
      this.http.get(this.AppComponent.BASE_URL + '/api/mydocuments/' + this.userid)
      .subscribe(data => {
       this.documentdetail = data;
       this.documents = this.documentdetail.data;
       this.documents.sort((a, b)=>{
        var keyA = a.date,
            keyB = b.date;
        // Compare the 2 dates
        if(keyA < keyB) return 1;
        if(keyA > keyB) return -1;
        return 0;
    });
       this.doc = this.documents;
    
this.items= this.doc;
// console.log(this.items);

       this.filterarray =this.doc;
       if(this.documents == ''){
        $('#checkDocId').hide();
        $('#DeleteID').hide();
        $('#actionRequiredId').hide();
       }
       else{
         $('#checkDocId').show();
         $('#DeleteID').show();
         $('#actionRequiredId').show();
       }
      
            });
            
    });

   
  }


  remind(docid){
    // alert(docid)
this.http.post(this.AppComponent.BASE_URL + '/api/remind', {docid:docid})
       .subscribe((data:any) => {
         console.log("data-->",data)
         if(data.success=="Mail Sent"){
alert("Reminder Sent SucessFully");
         }
         else{
alert("Failed to send Reminder");
         }
       })
  }
  
//   needToSignDocument(){
//   console.log(this.details._id)
//   console.log(localStorage.getItem('digitalpath'));
//     this.http.post('http://localhost:3001/api/resendEmail', { 
//     pdfid: localStorage.getItem('pdfid'), userid: this.details._id,notImage: localStorage.getItem('digitalpath'),pdfpath: localStorage.getItem('pdfpath') }).subscribe(data => {
// alert("email sent successfully");
//     })
//   }

  onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.documents = pageOfItems;
}

  checkAll(ev) {
    this.documents.forEach(x => x.selected = ev.target.checked);
    this.isSelected = true;
    // alert(this.isSelected)
  }

  isAllChecked() {
    if(this.isSelected == true)
    // alert(this.isSelected)
    return this.documents.every(_ => _.selected);
  }

  
  deletedocument() {
    this.checkeddocuments = this.documents.filter(_ => _.selected);
    if ( this.checkeddocuments.length == 0 ) {
      alert('Please Check At Least One Record');
    }
    else {
      if (confirm('Are you sure to delete the selected records')) {
        this.checkedid = [];
       for ( let i = 0; i < this.checkeddocuments.length; i++) {
        this.checkedid.push({id: this.checkeddocuments[i].id});
       }
       this.http.post(this.AppComponent.BASE_URL + '/api/deletemydocuments', {documentid: this.checkedid})
       .subscribe(data => {
        this.http.get(this.AppComponent.BASE_URL + '/api/mydocuments/' + this.userid)
        .subscribe(data => {
          //this.contactModal.close();
          this.documentdetail = data;
          this.documents = this.documentdetail.data;
          if(this.documents == ''){
            $('#checkDocId').hide();
            $('#DeleteID').hide();
            $('#actionRequiredId').hide();
           }
           else{
            $('#checkDocId').show();
            $('#DeleteID').show();
            $('#actionRequiredId').show();
          }
        });

       });
       
    }

    }
  }

  searchDocument(){
    this. x = document.getElementById("searchaction");
    // console.log(this.x)
    //  alert(this.x.value)
if(this.x.value == ""){
  this.documents=this.filterarray
  // alert("done")
}
    for(let i=0 ; i< this.filterarray.length;i++){
        var str = this.filterarray[i].documentname;
        var checkdate = this.filterarray[i].date;
    var n = str.includes(this.x.value);
    if(n==true){
        if(this.dateCheck(this.fromdate.formatted,this.todate.formatted,checkdate))
{
this.filteredarray.push(this.filterarray[i])
}
    
else{
    // alert("Not Availed");
    

}
       
    }//end of inner if(i.e.n==true)
    else{
    
    }
    if(i==this.filterarray.length-1){
      this.documents = this.filteredarray;
    }
    else{
      
    }
   
    }//end of for
  }
  dateCheck(from,to,check) {

    let fDate,lDate,cDate;
    fDate = Date.parse(from);
    lDate = Date.parse(to);
    cDate = Date.parse(check);
    
    if((cDate <= lDate && cDate >= fDate)) {
        return true;
    }
    return false;
    }

  logout() {
    this.auth.logout();
  }

  defauldate(event) {
    if (event.target.checked) {
      const date = new Date();
      let dd = date.getDate();
      let mm = date.getMonth() + 1; //January is 0!
      const yyyy = date.getFullYear();
      if (dd < 10) {
        // dd = '0' + dd;
      }
      if (mm < 10) {
        // mm = '0' + mm;
      }
      const today = mm + '-' + dd + '-' + yyyy;
      localStorage.setItem('expdate', today);
      localStorage.setItem('Date', today);
    } else {
      localStorage.setItem('expdate', '');
      localStorage.setItem('Date', '');
    }
    // this.expirationdate = today;
    // console.log(this.expirationdate);
  }

  onDateChanged(event: IMyDateModel): void {
    localStorage.setItem('expdate', event.formatted);
    // console.log(event.formatted);
  }

  ondateChanged(event: IMyDateModel): void {
    localStorage.setItem('Date', event.formatted);
    // console.log(event.formatted);
  }
}
