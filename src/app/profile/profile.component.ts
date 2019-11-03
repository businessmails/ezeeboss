import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebcamImage } from 'ngx-webcam';
import { Observable } from 'rxjs/Observable';

import { Component } from '@angular/core';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { Subject } from 'rxjs/Subject';

@Component({
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  details: UserDetails;
  public res: any;
  public response = false;
  public msg: any;
  public class: any;
  public test: any;
  public token: '';
  public fullname: string;
  public firstname: string;
  public lastname: string;
  public shortname: string;
  public image: string;
  private trigger: Subject<void> = new Subject<void>();

  public webcamImage: WebcamImage = null;

  public hideimg = null;
  public Camera = null;
  public recapture = null;
  public showWebcam = false;

  imag: string;
  public animatebtn = false;
  public animatecamerabtn = false;
  public animatecamera = false;
  withoutImage: string = 'Selected';
  credentials: any;
  toggel: boolean = true;
  oldimage: string;
  text: string = 'Capture New Image';
  constructor(
    private auth: AuthenticationService,
    private http: HttpClient,
    private spinnerService: Ng4LoadingSpinnerService
  ) { }



  public triggerSnapshot(): void {
    this.trigger.next();
    this.Camera = null;
    this.recapture = true;


  }
  registerwithoutimage() {
    if (this.animatecamera == false) {
      // this.text= '1';
      this.toggel = false;
      this.animatecamera = true;
      this.Camera = false;
      this.recapture = false;
    }
    if (this.withoutImage === 'Selected') {
      this.text = 'Cancel';
      this.toggel = false;
      this.showWebcam = false;
      if (this.webcamImage) {
        this.recapture = true;
        // console.log("...in")
      }
      this.animatebtn = false;
      this.withoutImage = null;
      this.image = this.oldimage;
    } else {
      this.text = 'Capture New Image';
      this.toggel = true;
      this.recapture = false;
      // console.log("not null")
      this.withoutImage = 'Selected';
      this.image = this.oldimage;
    }

  }

  public toggleWebcam(): void {
    this.toggel = false;
    // alert()ttoggleWebcamoggleWebcam
    this.image = null;

    this.animatecamera = false;
    if (this.animatecamerabtn != true) {
      this.animatecamerabtn = true;
    }
    else {
      this.animatebtn = false;
    }
    this.Camera = 'true';
    this.recapture = false;
    this.showWebcam = !this.showWebcam;
    if (this.webcamImage) {
      this.webcamImage = null;
    }
  }
  public handleImage(webcamImage: WebcamImage): void {

    this.webcamImage = webcamImage;
    this.image = webcamImage.imageAsDataUrl;
    // console.log("image : ", this.image)
    this.imag = 'image';
    this.hideimg = 'hide';
    this.showWebcam = false;
    // this.emptycheck()
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }


  ngOnInit() {
    // this.spinnerService.show();
    this.auth.profile().subscribe(user => {
      this.details = user;
      localStorage.setItem('user_id', this.details._id);
      //this.details.sec_email =this.details.secEmail
      this.spinnerService.hide();
      var fullName = this.details.name;
      this.fullname = this.details.name;
      this.image = 'https://ezeeboss.com:3001/images/' + this.details._id + '/' + user.image;
      this.oldimage = this.image;
      var nameArr = [];
      var lastName = '';
      var nameArr = [];

      if (fullName) {
        nameArr = fullName.split(' ');

        if (nameArr.length > 2) {
          lastName = nameArr.pop();
          this.details.first_name = nameArr.join(' ');
          this.firstname = nameArr.join(' ');
          this.lastname = lastName;
          this.details.last_name = lastName;
        } else {
          this.firstname = nameArr[0];
          this.lastname = nameArr[nameArr.length - 1];
          this.details.first_name = nameArr[0];
          this.firstname = nameArr[0];
          this.details.last_name = nameArr[nameArr.length - 1];
        }
      }
      //this.spinnerService.hide();
    }, (err) => {
      console.error(err);
      //   this.spinnerService.hide();
    });
  }
  clear() {
    setTimeout(function () {
      // console.log('cleR');
      this.response = false;
      this.class = "";
      this.msg = ""
    }, 0);
  }

  logout() {
    this.auth.logout();
  }

  update() {
    let img = '';
    if (!this.toggel) {
      img = this.image;
    } else {
      img = 'none'
    }
    this.spinnerService.show();
    const req = this.http.post('https://ezeeboss.com:3001/api/update', {
      user_id: localStorage.getItem('user_id'),
      phonenumber: this.details.phonenumber,
      email: this.details.email,
      name: this.details.first_name + " " + this.details.last_name,
      secEmail: this.details.secEmail,
      image: img
    })
      .subscribe(
        res => {
          // console.log(res);
          this.response = true;
          this.class = "alert alert-success";
          this.msg = "Data updated Sucessfully"
          //   window.location.reload();
          setTimeout(function () {
            // alert('cleR');
            this.response = false;
            this.class = "";
            this.msg = ""
          }, 3000);

          this.ngOnInit();
          this.registerwithoutimage();
          this.webcamImage = null
          this.toggel = true
          this.spinnerService.hide();
          let element: HTMLElement = document.getElementById('hidemsg') as HTMLElement;
          element.click();
        },
        err => {
          this.response = true;
          this.class = "alert alert-danger";
          this.msg = "Failed to update data "
          //   console.log("Error occured");
          setTimeout(function () {
            //    console.log('cleR');
            this.response = null;
            this.class = "";
            this.msg = ""
          }, 9000);
        }
      );
    //done but some feilds miss match with backend
  }

}
