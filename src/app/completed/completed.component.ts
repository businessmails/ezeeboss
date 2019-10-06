import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload} from '../authentication.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { AppComponent} from '../app.component';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';
import { timingSafeEqual } from 'crypto';

@Component({
  selector: 'app-completed',
  templateUrl: './completed.component.html',
  styleUrls: ['./completed.component.css']
})
export class CompletedComponent implements OnInit {
  details: UserDetails;
  fullname: String;
  userid: String;
  email: String;
  documents: any;
  users: any;
  expdate: false;
  isSelected = false;
  Date: false;
  digitalpath: String;
  documentdetail: any;
  checkedid = [];
  checkeddocuments: any;
  filterarray: any;
  x: any;
  fromdate:any;
  todate: any;
  filteredarray=[];
  Search: any;
  checkId = true;

  //all items to be paged
  items: Array<any>;
  //current page of items
  pageOfItems: Array<any>;



  constructor(
   private http: HttpClient,
   private auth: AuthenticationService
 ) { }
  // constructor() { }

  ngOnInit() {
    this.digitalpath = localStorage.getItem('digitalpath');
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.email = this.details.email;
      this.fullname = this.details.name;
      this.userid = this.details._id;
      this.digitalpath = localStorage.getItem('digitalpath');
      // console.log(this.userid);

      this.http.get('http://localhost:3001/api/mycompleteddocuments/' + this.userid)
      .subscribe(data => {
       this.documentdetail = data;
       this.documents = this.documentdetail.data;
       this.items= this.documents;
       this.documents.sort((a, b)=>{
        var keyA = a.date,
            keyB = b.date;
        // Compare the 2 dates
        if(keyA < keyB) return 1;
        if(keyA > keyB) return -1;
        return 0;
    });
          this.filterarray= this.documents;
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
   // ------------------------------------------

   onChangePage(pageOfItems: Array<any>) {
    // update current page of items
    this.documents = pageOfItems;
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
  searchDocument(){
    this. x = document.getElementById("search");
    if(this.x.value){
      this.documents= this.filterarray
    }
  
    for(let i=0 ; i< this.filterarray.length;i++)
    {
        var str = this.filterarray[i].documentid;
        var checkdate = this.filterarray[i].signedTime.substr(0,10);
    var n = str.includes(this.x.value);
    if(n==true){
        if(this.dateCheck(this.fromdate.formatted,this.todate.formatted,checkdate))
{
this.filteredarray.push(this.filterarray[i])
}
    
else{
    // alert("Not Availed");

}
       
    }
    else{

    }
    if(i==this.filterarray.length-1){
      this.documents = this.filteredarray;
    }
    }

// console.log(this.doc.includes(this.Search));
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
       this.http.post( 'http://localhost:3001/api/deletemycompleteddocuments', {documentid: this.checkedid})
       .subscribe(data => {
        this.http.get('http://localhost:3001/api/mycompleteddocuments/' + this.userid)
        .subscribe(data => {
          //this.contactModal.close();
          this.documentdetail = data;
          // console.log(this.documentdetail)
          this.documents = this.documentdetail.data;
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
