import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails, TokenPayload} from '../authentication.service';
import { AppComponent} from '../app.component';
import { UploadEvent, UploadFile, FileSystemFileEntry } from 'ngx-file-drop';
import { Router } from '@angular/router'
@Component({
  selector: 'app-dicom-viewer',
  templateUrl: './dicom-viewer.component.html',
  styleUrls: ['./dicom-viewer.component.css']
})
export class DicomViewerComponent implements OnInit {
  details: UserDetails;
  fullname: String;
  userid: string;
  useremail:string;
  email: string;
  files: UploadFile[] = [];
  pdfname:any;
  name:any;
  
  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private AppComponent:AppComponent,
    private router: Router
  ) { }

  ngOnInit() {
    this.auth.profile().subscribe(user => {
      // console.log(user);
      this.details = user;
      this.fullname = this.details.name;
      this.userid = this.details._id;
      this.email = this.details.email;

    });
  }

  uploadDocument(event){
    const fileList: FileList = event.target.files;
    //  console.log(event.target.files);
     this.pdfname = event.target.files[0].name;
    // console.log(this.pdfname)
    var extension = event.target.files[0].type;
    // console.log(extension);
    if (fileList.length > 0) {
      // this.pdferror = '';
      const file: File = fileList[0];
      const formData: FormData = new FormData();
      formData.append('filetoupload', file, file.name);
      this.http.post('https://ezeeboss.com:3001/api/uploaddicomfile/'+this.userid, formData).subscribe(data=>{
        console.log(data);
        // this.name=data.filename;
        // console.log("nn",this.name)
        localStorage.setItem('filename', JSON.stringify(this.name));
   alert("uploaded")
      })
  }

}
}