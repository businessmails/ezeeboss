import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { RequestOptions,ResponseContentType } from '@angular/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AppComponent} from '../app.component';
import {saveAs} from 'file-saver/FileSaver';

@Component({
  selector: 'app-filepassword',
  templateUrl: './filepassword.component.html',
  styleUrls: ['./filepassword.component.css']
})
export class FilepasswordComponent implements OnInit {
  message:any;
  password: string;
  passwordmatch = false;
  data:any;
  detail:any;
  fromemail:string;
  date:string;
  constructor(
    private activatedRoute: ActivatedRoute,
    private http: HttpClient,
    private AppComponent:AppComponent,
    private router: Router
  ) { }

  ngOnInit() {
  }

  checkpassword() {
    this.activatedRoute.params.subscribe((params: Params) => {
      const documentid = params['id'];
      // alert(documentid)
      // alert(this.password)
     // this.loading = true;
      this.http.post(this.AppComponent.BASE_URL+'/api/checkfiletransferpassword', { id: documentid, password: this.password})
        .subscribe(
          data => {
            this.message= data;
          //  alert(this.message.message)
            if(this.message.message == 'Invalid Password') {
              alert('Invalid Password')
            } else {
            this.passwordmatch = true;
            this.data = data;
            this.detail = this.data.message;
            this.fromemail = this.detail[0].fromemail;
            this.date = this.detail[0].date
            }
          
          });
    });

  }

  downloadfile(fileURL,fileName) {
    // alert(fileURL)
  this.downloadFile2(fileURL).subscribe(data => saveAs(data, fileName));
  }

  downloadFile2(id) {
      //  return this.http.get(this.AppComponent.BASE_URL + '/mailattachments/' + id, 
      return this.http.get("https://ezeeboss.com/assets/filetransfer/" + id, 

        {responseType: 'blob'});
}
}
