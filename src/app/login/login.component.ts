import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'angular2-cookie/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  credentials: TokenPayload = {
    email: '',
    password: '',
    image: '',
    phonenumber: '',
    cpassword: '',
    fname: '',
    lname: '',
    rememberme: ''
  };
  public forgotemail = null;
  public error = null;
  public teaser_1 = null;
  public loginbtn = null;
  public withoutimage = null;
  public showWebcam = false;
  public loading = false;
  public button = false ;
  public Camera = null;
  public shwlogin = null;
  // latest snapshot
  public pulsereg = null;
  public webcamImage: WebcamImage = null;
  public mailerror = null;
  public faceresponse: any;
  public recapture = false;
  public useremail = null;
  public hideimage = null;
  public forgetresponse = null;
  public forgeterrorclass = null;
  public highlight_login = false;
  loginerror: any;
  @ViewChild('forgetpassword') forgetpassword: any;
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();

  public triggerSnapshot(): void {
    this.trigger.next();
    this.Camera = null;
    this.shwlogin = 'true';
    this.recapture = true;
  }
  public toggleWebcam(): void {
    this.teaser_1 = false;
    this.loginbtn = true;
    if(this.pulsereg ==true){
      this.pulsereg = false;
    }
    this.Camera = 'true';
    this.shwlogin = null;
    this.recapture = false;
    // console.log("im");
    this.showWebcam = !this.showWebcam;
    if (this.webcamImage) {
      this.webcamImage = null;
    }
  }
  public handleImage(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    // console.log(JSON.stringify(webcamImage));
    this.credentials.image = webcamImage.imageAsDataUrl;
    var e = this.credentials.email;
    var p = this.credentials.password;
    if (e != '' && p != '') {
      this.pulsereg = true;
    }

    this.credentials.imag = 'image';
    this.showWebcam = false;
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }
  ngOnInit() {
    this.useremail = localStorage.getItem('useremail');
    if (this.useremail != null) {
      this.credentials.email = this.useremail;
    }
    this.noimage() 
    this.withoutimage="Selected";
    this.credentials.image="none";
  }
  noimage() {
    // alert()
    // this.Camera = 'false';
   // alert(this.recapture)
    if(this.recapture == true){
      this.recapture=false;
    }
    // else{
    //   this.recapture=true;
    // }
    this.pulsereg=false;
    if (this.hideimage === 'hide') {
      this.withoutimage = '';
      this.hideimage = '';
      this.credentials.image = null;
    } else {
      this.withoutimage = 'hide';
      this.hideimage = 'hide';
      this.credentials.image = 'none';
      var e = this.credentials.email;
      var p = this.credentials.password;
      if (e != '' && p != '') {
        this.pulsereg = true;
      }
    }
    // this.withoutimage = 'hide';
    // this.credentials.image = 'none';
    // this.hideimage = 'hide';
  }
  checkmail() {
    this.mailerror = '';
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (regex.test(this.credentials.email)) {
      this.mailerror = null;
      this.checkEmpty();
    } else {
      this.mailerror = 'Please enter a valid email';
      const element: HTMLElement = document.getElementById('email') as HTMLElement;
      // element.focus();
    }
  }

  checkEmpty() {
    console.log('called');
    var ema = this.credentials.email;
    var pwd = this.credentials.password;

    if (pwd != '' && ema != '') {
 
      this.teaser_1 = true;
      // [ngClass]="{'teaser': !teaser_1 }"
      if(this.credentials.image!=""){
        this.pulsereg=true;
      }
    }   else {


      this.teaser_1 = null;
      //  const element: HTMLElement = document.getElementById('per') as HTMLElement;
      //  element.focus();
      //  return;
    }

  }
  checkchnage(){
  //  alert(this.credentials.password)
    if (this.credentials.password != '' && this.credentials.email != '') {
   //   alert('!')
      this.teaser_1 = true;
      this.highlight_login = true;
      // [ngClass]="{'teaser': !teaser_1 }"
    }
  }

  // tslint:disable-next-line:max-line-length
  constructor(private auth: AuthenticationService, private router: Router, private http: HttpClient, private _cookieService: CookieService, private spinnerService: Ng4LoadingSpinnerService) {
    this.spinnerService.hide();
    if (auth.isLoggedIn()) {
      router.navigate(['landing']);
    }
    if (_cookieService.get('remember')) {
      this.credentials.email = this._cookieService.get('email');
      this.credentials.password = this._cookieService.get('password');
      this.credentials.rememberme = this._cookieService.get('remember');
    }
  }
  opensuccesspop() {
    this.forgetpassword.open();
    setTimeout(() => {
      var el = document.querySelector('.modal-content');

      // get the element's parent node
      var parent = el.parentNode;

      // move all children out of the element
      while (el.firstChild) parent.insertBefore(el.firstChild, el);

      // remove the empty element
      parent.removeChild(el);
    }, 1);

  }
  forgetpass() {
    // this.spinnerService.show();
    if (this.forgotemail !== null) {
      const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
      if (!regex.test(this.forgotemail)) {
       // alert(this.forgotemail);
        // console.log('dsd');
        this.forgeterrorclass = 'text-danger font-b'
        this.forgetresponse = 'Please enter a valid email';
        // this.spinnerService.hide();
      } else {
        const req = this.http.post('https://ezeeboss.com:3001/api/getuserid', {
          email: this.forgotemail,
        })
          .subscribe((res: any) => {
          //  alert(res.id);
            this.spinnerService.hide();
            this.forgeterrorclass = 'text-success  font-b';
            this.forgetresponse = 'Please check your email and reset the password!';
            this.button =  true;
          },
            err => {
              this.spinnerService.hide();
              this.forgeterrorclass = 'text-danger  font-b';
              this.forgetresponse = 'User Not Found';
              console.log('Error occured');
              localStorage.clear();
            });
      }
    } else {
      this.forgeterrorclass = 'text-danger  font-b';
      this.forgetresponse = 'Email Can`t be empty';
      this.spinnerService.hide();
    }
  }
  login() {
    // this.loading = true;
    // this.spinnerService.show();
    this.auth.login(this.credentials).subscribe(
      // tslint:disable-next-line:no-shadowed-variable
      res => {
        if (this.credentials.image === 'none') {
          if (this.credentials.rememberme) {
            this._cookieService.put('email', this.credentials.email);
            this._cookieService.put('password', this.credentials.password);
            this._cookieService.put('remember', this.credentials.rememberme);
          }
          this.router.navigateByUrl('/landing');
        } else {
          const req = this.http.post('https://ezeeboss.com:3001/api/email', {
            email: this.credentials.email,
            image: this.credentials.image
          })
            // tslint:disable-next-line:no-shadowed-variable
            .subscribe((res: any) => {
              // tslint:disable-next-line:max-line-length
              const req = this.http.get('https://ezeeboss.com:5000/api/recognize?knownfilename=' + res.knownimage + '&unknownfilename=' + res.unknownimage + '.jpg')
                .subscribe(
                  // tslint:disable-next-line:no-shadowed-variable
                  res => {
                    this.faceresponse = res;
                    if (this.faceresponse.message === 'No Face Found') {
                      // this.loading = false;
                      this.spinnerService.hide();
                      this.error = 'Your Face Was Not Detected.Please Try Again';
                      localStorage.clear();
                    } else if (this.faceresponse.message === 'Match Not Found') {
                      // this.loading = false;
                      this.spinnerService.hide();
                      this.error = 'Failed To Recognise You.Please Try Again';
                      // this.auth.logout();
                      localStorage.clear();
                    } else {
                      if (this.credentials.rememberme) {
                        this._cookieService.put('email', this.credentials.email);
                        this._cookieService.put('password', this.credentials.password);
                        this._cookieService.put('remember', this.credentials.rememberme);
                      }
                      this.router.navigateByUrl('/landing');
                    }
                  },
                  err => {
                    // localStorage.setItem(user:'')
                    //  this.loading = false;
                    this.spinnerService.hide();
                    this.error = 'Failed To Recognise You';
                    //  this.auth.logout();
                    console.log('Error occured');
                    localStorage.clear();
                  });
            });
        }
      }, (err) => {
        //  this.loading = false;
        this.spinnerService.hide();
        this.loginerror = err;
        console.log(this.loginerror);
        console.log(this.loginerror.error.message);
        if (this.loginerror.error.message === 'Password is wrong') {
          this.error = 'Invalid Password';
        } else if (this.loginerror.error.message === 'User not found') {
          this.error = 'Invalid Email Address';
        } else if (this.loginerror.error.error === 'unverified') {
          this.error = 'Account Is not Verified yet';
        } else {
          this.error = 'Something Went Wrong.Please Try Again !!!';
        }

        // }
      });

  }

}
