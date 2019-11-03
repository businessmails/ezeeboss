import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { INgxMyDpOptions, IMyDateModel } from 'ngx-mydatepicker';

@Component({
  selector: 'app-documentdetail',
  templateUrl: './documentdetail.component.html',
  styleUrls: ['./documentdetail.component.css']
})

export class DocumentdetailComponent implements OnInit {
  digitalpath: any;
  documents: any;
  documentdetail: any;
   details: any;
   fullname: any;
   showvideo= true;
   userid: string;
   filterarray:any;
   x:any;
   fromdate:any;
   todate:any;
   filteredarray:any;
   @ViewChild('videoPlayer') videoplayer: any;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private auth: AuthenticationService
  ) { }

  ngOnInit() {
    this.digitalpath = localStorage.getItem('digitalpath');
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.fullname = this.details.name;
      this.userid = this.details._id;
    });

    this.activatedRoute.params.subscribe((params: Params) => {
      const documentid = params['documentid'];

      this.http.get('https://ezeeboss.com:3001/api/documentdetail/' + documentid)
        .subscribe(data => {
          this.documentdetail = data;
          this.documents = this.documentdetail.data.reverse();
          this.filterarray=this.documents;
           console.log(this.documents)
          if(this.documents[0].uservideo == "" && this.documents[0].image == ""){
            this.showvideo= false;
          }
        });
    });
  }


  toggleVideo(event: any) {
    this.videoplayer.nativeElement.play();
}


/////////////////////////////////////////////////////////////////////////////////////////
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
}

onDateChanged(event: IMyDateModel): void {
  localStorage.setItem('expdate', event.formatted);
}

ondateChanged(event: IMyDateModel): void {
  localStorage.setItem('Date', event.formatted);
}
/////////////////////////////////////////////////////////////////////////////////////////////
searchDocument(){
  this. x = document.getElementById("searchaction");
  // console.log(this.x)
  //  alert(this.x.value)
if(this.x.value == ""){
this.documents=this.filterarray
//  alert("done")
}
  for(let i=0 ; i< this.filterarray.length;i++){
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
     
  }//end of inner if(i.e.n==true)
  else{
  
  }
  if(i==this.filterarray.length-1){
    this.documents = this.filteredarray;
  }
  else{
    
  }
 
  }//end of for
  // this.documents= this.filterarray
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


}
