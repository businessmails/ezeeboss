import { OnInit, Component, ViewChild, ElementRef } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../authentication.service';
import { Router } from '@angular/router';
import { WebCamComponent } from 'ack-angular-webcam';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { RequestOptions } from '@angular/http';
import { HttpHeaders } from '@angular/common/http';
import { Headers } from '@angular/http';
import { ScrollToService } from 'ng2-scroll-to-el';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { AppComponent } from '../app.component';
@Component({
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  credentials: TokenPayload = {
    email: '',
    name: '',
    password: '',
    image: '',
    imag: '',
    phonenumber: '',
    cpassword: '',
    lname: '',
    fname: '',
    rememberme: ''
  };
  public loading = false;
  public showWebcam = false;
  public error = null;
  public recapture = null;
  public phoneerror = null;
  public passworderror = null;
  public cpassworderror = null;
  public mailerror = null;
  public fnameerror = null;
  public lnameerror = null;
  public imageerror = null;
  public Camera = null;
  public location: any;
  public webcamImage: WebcamImage = null;
  public hideimg = null;
  public faceresponse: any;
  public data: any;
  public jagveer = false;
  public passworderrorr = null;
  public withoutImage = "Selected";
  public userregistered = null;
  public cityname = null;
  public animatebtn = false;
  public animatecamerabtn = false;
  public animatecamera = false;
  public eightCharacters = true;
  public specialChar = true;
  public onlyNumber = true;
  public alphabets = true;
  public dropPasswordTips = true;
  public UpperAlphabets = true;
  private trigger: Subject<void> = new Subject<void>();
  template: string = `<img src="../../assets/img/ezgif.com-gif-maker.gif" style="margin-left:200px"/>`
  @ViewChild('top') public messagescroll: ElementRef;
  @ViewChild('sucess') sucessmessage: any;
  public triggerSnapshot(): void {
    this.trigger.next();
    this.Camera = null;
    this.recapture = true;


  }
  public toggleWebcam(): void {
    this.credentials.image = null;

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
    this.credentials.image = webcamImage.imageAsDataUrl;
    this.credentials.imag = 'image';
    this.hideimg = 'hide';
    this.showWebcam = false;
    this.emptycheck()
  }
  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  // tslint:disable-next-line:max-line-length
  constructor(private AppComponent: AppComponent, private scrollService: ScrollToService, private auth: AuthenticationService, private router: Router, private http: HttpClient, private spinnerService: Ng4LoadingSpinnerService) {
    this.spinnerService.hide();
    if (auth.isLoggedIn()) {
      router.navigate(['digital_sign']);
    }
  }

  moveToSpecificView() {
    this.messagescroll.nativeElement.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'start' });

  }
  ngOnInit() {
    this.credentials.image = "none";
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&sensor=true&key=" + this.AppComponent.GOOGLE_MAP_KEY)
          .subscribe(data => {
            this.location = data;
            let cityname;
            let statename;
            for (var x = 0, length_1 = this.location.results.length; x < length_1; x++) {
              for (var y = 0, length_2 = this.location.results[x].address_components.length; y < length_2; y++) {
                var type = this.location.results[x].address_components[y].types[0];

                if (type === "administrative_area_level_1") {
                  statename = this.location.results[x].address_components[y].long_name;
                  if (cityname) break;
                } else if (type === "locality") {
                  cityname = this.location.results[x].address_components[y].long_name;
                  if (statename) break;
                }
              }
            }
            this.cityname = cityname;
          });
      });
    }
  }
  emptycheck() {
    if (this.credentials.fname !== "" && this.credentials.lname !== "" && this.credentials.password !== "" && this.credentials.cpassword !== "" && this.credentials.email && this.credentials.phonenumber !== '') {
      if (this.credentials.image == "none") {
        this.recapture = false;
        this.animatebtn = true;
      }
      else if (this.credentials.image == '') {
        this.animatecamera = true;
      }
      else {
        this.animatebtn = true;
      }
    }
  }
  registerwithoutimage() {
    if (this.animatecamera == false) {
      this.animatecamera = true;
      this.Camera = false;
      this.recapture = false;
    }
    if (this.withoutImage === 'Selected') {
      // console.log("without")
      //  this.recapture = true;
        this.showWebcam = false;
      if (this.webcamImage) {
        this.recapture = true;
        console.log("...in")
        // this.webcamImage = null;
        //  this.Camera = false;
      }
      this.animatebtn = false;
      this.withoutImage = null;
      this.credentials.image = null;
    } else {
       this.recapture = false;
      console.log("not null")
      this.withoutImage = 'Selected';
      this.credentials.image = 'none';
      this.emptycheck()
    }

  }
  scrollToTop(element) {
    this.scrollService.scrollTo(element);
  }
  checkmail() {
    this.mailerror = '';
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    if (regex.test(this.credentials.email)) {
      this.mailerror = null;
      this.emptycheck()
    } else {
      this.mailerror = 'Please enter a valid email';
      const element: HTMLElement = document.getElementById('email') as HTMLElement;
    }

  }
  lname() {
    const empty = this.credentials.lname.length;
    if (empty < 1) {
      this.lnameerror = 'Please enter the Last Name';
      const element: HTMLElement = document.getElementById('lname') as HTMLElement;
    } else {
      this.lnameerror = null;
      this.emptycheck()
    }
  }
  fname() {
    const empty = this.credentials.fname.length;
    if (empty < 1) {
      this.fnameerror = 'Please enter the First Name';
      const element: HTMLElement = document.getElementById('fname') as HTMLElement;
    } else {
      this.fnameerror = null;
      this.emptycheck()
    }
  }
  password() {
    var tests = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^A-Z-0-9]/i]
    const length = this.credentials.password.length;
    if (this.credentials.password != null) {
      let format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
      if (format.test(this.credentials.password)) {
        this.specialChar = false;
      }
      else {
        this.specialChar = true;
      }

      let number = /[0-9]/;
      if (number.test(this.credentials.password)) {
        this.onlyNumber = false;
      }
      else {
        this.onlyNumber = true;
      }
      let loweralpha = /[a-z]/;
      let upperAlpha = /[A-Z]/;
      if (upperAlpha.test(this.credentials.password) && loweralpha.test(this.credentials.password)) {
        this.UpperAlphabets = false;
        this.alphabets = false;
      }
      else {
        this.UpperAlphabets = true;
        this.alphabets = true;
      }
      if (length >= 8) {
        this.eightCharacters = false;
      }
      else {
        this.eightCharacters = true;
      }
    }

    if (this.credentials.password == null)
      return -1;
    var s = 0;
    if (length == 0) {
      this.passworderror = "Please input password ";
      this.passworderrorr = "Please input password ";
    }
    if (length < 8)
      this.passworderror = "Very Weak";
    this.passworderrorr = "Very Weak";
    this.jagveer = true;
    for (let i in tests)
      if (tests[i].test(this.credentials.password))
        s++;
    if (s == 0) {
      this.passworderror = 'Very Weak';
      this.passworderrorr = 'Very Weak';
      this.jagveer = true;
    }
    else if (s == 2) {
      this.passworderror = 'Weak';
      this.passworderrorr = 'Weak';
      this.jagveer = true;
    }
    else if (s == 3) {
      this.passworderror = 'Good';
      this.passworderrorr = 'Good';
      this.jagveer = true;
    }
    else if (s == 4 && length >= 8) {
      this.passworderror = '';
      this.dropPasswordTips = false;
      this.passworderrorr = 'Strong';
      this.emptycheck()
    }
    else {
      this.dropPasswordTips = true;
    }
  }
  blurr() {
    if (this.passworderror === '') {
      this.jagveer = false;
      this.emptycheck()
    }
    else {
      const element: HTMLElement = document.getElementById('password') as HTMLElement;
      this.jagveer = false;
    }
  }

  onlynumber(event: any) {
    const pattern = /[0-9\+\-\ ]/;

    let inputChar = String.fromCharCode(event.charCode);
    if (event.keyCode != 8 && !pattern.test(inputChar)) {
      event.preventDefault();
    }
  }

  cpassword() {
    if (this.passworderror === '') {

      if (this.credentials.password !== this.credentials.cpassword) {
        this.cpassworderror = 'Passwords does not match!';
        const element: HTMLElement = document.getElementById('cpassword') as HTMLElement;
      } else {
        this.cpassworderror = null;
        this.emptycheck()
      }
    } else {
      this.cpassworderror = this.passworderrorr;
    }
  }
  number() {
    const length = this.credentials.phonenumber.length;
    if (length < 10) {
      this.phoneerror = 'Please enter minimum 10 digit Phone Number';
      const element: HTMLElement = document.getElementById('number') as HTMLElement;
    } else {
      this.phoneerror = null;
      this.emptycheck()
    }
  }
  register() {
    this.spinnerService.show();
    if (this.withoutImage != null) {
      this.credentials.image = 'none';
    }
    if (this.credentials.image === '') {
      this.imageerror = 'Image is required';
      this.spinnerService.hide();
      return false;
    } else {
      this.imageerror = null;
      this.auth.register(this.credentials).subscribe(
        user => {
          if (user.image == 'none') {
            this.opensuccesspop();
            const newreq = this.http.post('http://localhost:3001/api/sendmail', {
              id: user.id,
              imageurl: "none",
              to: user.to,
              name: user.name,
              location: this.cityname,
              url: 'https://ezeeboss.com/confirm/' + user.id
            })
              .subscribe(
                res => {
                  this.userregistered = user.to;
                  localStorage.clear();
                  this.spinnerService.hide();
                }
              );
            this.spinnerService.hide();
            this.userregistered = user.to;
            this.credentials.lname = null;
            this.credentials.email = null;
            this.credentials.fname = null;
            this.credentials.password = null;
            this.credentials.cpassword = null;
            this.credentials.phonenumber = null;
            this.credentials.image = null;
            this.webcamImage = null;
            localStorage.clear();
          } else {
            const userimage = user.image + '.jpg';
            const req = this.http.get('https://ezeeboss.com:5000/api/detect?filename=' + userimage)

              .subscribe(
                res => {
                  this.faceresponse = res;
                  if (this.faceresponse.message === 'Face Not Found') {
                    // tslint:disable-next-line:no-shadowed-variable
                    const newreq = this.http.post('http://localhost:3001/api/delete', { id: user.id })
                      .subscribe(
                        // tslint:disable-next-line:no-shadowed-variable
                        res => {
                          this.spinnerService.hide();
                          this.error = 'Your Face Was Not Detected.Please Try Again';
                          localStorage.clear();
                        }
                      );
                  } else {
                    this.opensuccesspop();
                    const newreq = this.http.post('http://localhost:3001/api/sendmail', {
                      id: user.id,
                      imageurl: user.imgurl,
                      to: user.to,
                      name: user.name,
                      location: this.cityname,
                      url: 'https://ezeeboss.com/confirm/' + user.id
                    })
                      .subscribe(
                        // tslint:disable-next-line:no-shadowed-variable
                        res => {
                          this.userregistered = user.to;
                          localStorage.clear();
                          this.spinnerService.hide();
                        }
                      );
                    this.userregistered = user.to;
                    this.credentials.lname = null;
                    this.credentials.email = null;
                    this.credentials.fname = null;
                    this.credentials.password = null;
                    this.credentials.cpassword = null;
                    this.credentials.phonenumber = null;
                    this.credentials.image = null;
                    this.webcamImage = null;
                    localStorage.clear();
                  }
                }
                , (err) => {
                  this.error = 'Something Went Wrong.Please Try Again !!!';
                  localStorage.clear();
                  this.auth.logout();
                });
          }  // else
        }, (err) => {
          this.data = err;
          if (this.data.error.err.code === 11000) {
            this.mailerror = 'User With Email or Phone Number Already Registered !!!';
          } else {
            this.error = 'Something Went Wrong.Please Try Again !!!';
            localStorage.clear();
          }

        });
    }
    // }
  }
  hideerror() {
    setTimeout(function () {
      this.error = !this.error;
    }, 6000);
  }
  isFocused() {
    this.jagveer = true;
  }
  show() {
    this.sucessmessage.open();
    setTimeout(() => {
      var el = document.querySelector('.modal-content');
      var parent = el.parentNode;
      // move all children out of the element
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      // remove the empty element
      parent.removeChild(el);
    }, 1);
  }
  opensuccesspop() {
    this.sucessmessage.open();
    setTimeout(() => {
      var el = document.querySelector('.modal-content');
      // get the element's parent node
      var parent = el.parentNode;
      // move all children out of the element
      while (el.firstChild) parent.insertBefore(el.firstChild, el);
      parent.removeChild(el);
    }, 1);

  }
  success() {
    this.router.navigate(['login']);
  }
}
