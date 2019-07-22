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
// import { renderer2 } from '@angular/core';
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
  // webcam snapshot trigger
  private trigger: Subject<void> = new Subject<void>();
  template: string =`<img src="../../assets/img/ezgif.com-gif-maker.gif" style="margin-left:200px"/>`
  @ViewChild('top') public messagescroll: ElementRef;
  @ViewChild('sucess') sucessmessage: any;
  public triggerSnapshot(): void {
    this.trigger.next();
    this.Camera = null;
    this.recapture = true;
  

  }
  public toggleWebcam(): void {
    this.animatecamera=false;
    // this.withoutImage="selected"
    // alert(this.withoutImage)
    // alert()
    if (this.animatecamerabtn != true) {
      this.animatecamerabtn = true;
// alert("!")
    }
    else {
      // alert("d");
      //this.animatecamerabtn = false;
      this.animatebtn = false;

    }
    // if (this.animatecamera == true) {
    //   this.animatecamera = false;
    // }
    // else {
    //   this.animatecamera = true;
    // }
    this.Camera = 'true';
    this.recapture = false;
    // console.log("im");
    this.showWebcam = !this.showWebcam;
    if (this.webcamImage) {
      this.webcamImage = null;
    }
  }
  public handleImage(webcamImage: WebcamImage): void {

    //  console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    //  console.log(JSON.stringify(webcamImage));
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
    //alert()
    this.credentials.image="none";
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        //   alert(position)
        //   console.log(position.coords.latitude)
        return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng=" + position.coords.latitude + "," + position.coords.longitude + "&sensor=true&key=" + this.AppComponent.GOOGLE_MAP_KEY)
          .subscribe(data => {
            // console.log(data)
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
            //  console.log(cityname, statename)
            this.cityname = cityname;
            //     console.log(this.cityname)
          });
      });
    }
  }
  emptycheck() {
    if (this.credentials.fname !== "" && this.credentials.lname !== "" && this.credentials.password !== "" && this.credentials.cpassword !== "" && this.credentials.email && this.credentials.phonenumber !== '') {
      if (this.credentials.image == "none") {
        // alert("none")
        this.recapture = false;
     //   alert(this.credentials.image)
        this.animatebtn = true;
      }
      else if (this.credentials.image == '') {
        // this.animatecamerabtn=true;
        this.animatecamera = true;

        //   alert("empty")
      }
      else {
        //alert("string64")
        this.animatebtn = true;

      }


    }
    // else if(this.credentials.fname !=="" && this.credentials.lname !=="" && this.credentials.password !=="" && this.credentials.cpassword !=="" && this.credentials.image =="none" && this.credentials.email && this.credentials.phonenumber !== ''){
    //   alert("else")
    // }
  }
  registerwithoutimage() {
    // alert(this.withoutImage)
    // alert("this.withoutImage")
// return;
// alert(this.animatecamera);
if(this.animatecamera == false){
  this.animatecamera=true;
  this.Camera= false;
  this.recapture= false;
}
    if (this.withoutImage === 'Selected') {
// alert(this.animatebtn);

// if(this.animatebtn==true){
this.animatebtn=false;
// }
// else{
  // alert("failing")
// }

      this.withoutImage = null;
      this.credentials.image = null;
      // this.emptycheck()
    } else {
      this.withoutImage = 'Selected';
      this.credentials.image = 'none';
      this.emptycheck()
      // this.
    }

  }
  // this.credentials.lname =null;
  // this.credentials.email=null;
  // this.credentials.fname=null;
  // this.credentials.password=null;
  // this.credentials.cpassword=null;
  // this.credentials.phonenumber=null;
  // this.credentials.image=null;
  scrollToTop(element) {
    // console.log("element",element);
    this.scrollService.scrollTo(element);
  }
  checkmail() {
    // const element = this.credentials.selectRootElement('#input1');

    // setTimeout(() => element.focus(), 0);
    this.mailerror = '';
    const regex = /^([a-zA-Z0-9_.+-])+\@(([a-zA-Z0-9-])+\.)+([a-zA-Z0-9]{2,4})+$/;
    // console.log( regex.test(this.credentials.email));
    if (regex.test(this.credentials.email)) {
      this.mailerror = null;
      this.emptycheck()
    } else {

      this.mailerror = 'Please enter a valid email';
      const element: HTMLElement = document.getElementById('email') as HTMLElement;
      // element.focus();
    }

  }
  lname() {
    // alert('kkk')
    const empty = this.credentials.lname.length;
    if (empty < 1) {
      this.lnameerror = 'Please enter the Last Name';
      const element: HTMLElement = document.getElementById('lname') as HTMLElement;
      //  element.focus();
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
      //  element.focus();
    } else {
      this.fnameerror = null;
      this.emptycheck()
    }




  }
  password() {
    var tests = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^A-Z-0-9]/i]        // ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}
    // this.jagveer=false;
    const length = this.credentials.password.length;
    // if (length < 8) {
    //   this.passworderror = 'Please enter minimum 8 digit Password';
    //   const element: HTMLElement = document.getElementById('password') as HTMLElement;
    // //  element.focus();
    // }else {
    //   this.passworderror = null;

    // }
    if(this.credentials.password != null ){
      let format = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if(format.test(this.credentials.password)){
      this.specialChar = false;
    }
    else{
      this.specialChar= true;
    }
    
    let number =/[0-9]/;
    if(number.test(this.credentials.password)){
      this.onlyNumber = false;
    }
    else{
      this.onlyNumber = true;
    }
    let loweralpha = /[a-z]/;
    // if(loweralpha.test(this.credentials.password)){
    //   this.alphabets = false;
    // }
    // else{
    //   this.alphabets = true;
    // }
    let upperAlpha= /[A-Z]/;
    if(upperAlpha.test(this.credentials.password) && loweralpha.test(this.credentials.password)){
      this.UpperAlphabets = false;
      this.alphabets = false;
    }
    else{
      this.UpperAlphabets = true;
      this.alphabets = true;
    }
    if(length >= 8){
      this.eightCharacters = false;
    }
    else{
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
    // return s;
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
      //this.jagveer=false;
      this.passworderror = '';
      this.dropPasswordTips = false;
      this.passworderrorr = 'Strong';
      this.emptycheck()

    }
    else{
      this.dropPasswordTips = true;
    }
    //this.passworderror =s
    // console.log(s);
  }

  blurr() {
    if (this.passworderror === '') {
      this.jagveer = false;
      this.emptycheck()
    }
    else {
      const element: HTMLElement = document.getElementById('password') as HTMLElement;
      // element.focus();
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
        //  element.focus();
      } else {
        this.cpassworderror = null;
        this.emptycheck()
      }
    } else {
      // console.log(this.passworderrorr);
      this.cpassworderror = this.passworderrorr;
    }
    // if (this.credentials.password !== this.credentials.cpassword) {
    //   this.cpassworderror = 'Passwords does not match!';
    //   const element: HTMLElement = document.getElementById('cpassword') as HTMLElement;
    //   //  element.focus();
    // } else {
    //   this.cpassworderror = null;
    // }
  }
  number() {
    const length = this.credentials.phonenumber.length;
    if (length < 10) {
      this.phoneerror = 'Please enter minimum 10 digit Phone Number';
      const element: HTMLElement = document.getElementById('number') as HTMLElement;
      //  element.focus();
    } else {
      this.phoneerror = null;
      this.emptycheck()
    }
    // console.log(this.phoneerror)
  }
  register() {
    //  alert("this.withoutImage"+this.withoutImage)
    //  return;
    this.spinnerService.show();
    // console.log('im---');
    if (this.withoutImage != null) {

      this.credentials.image = 'none';
      // console.log('yoyo');
    }

    if (this.credentials.image === '') {

      this.imageerror = 'Image is required';
      this.spinnerService.hide();
      return false;
    } else {
      this.imageerror = null;
      //      }
      //  this.loading = true;
      // this.spinnerService.show();
      ///////// ------------------------- api to train bot------------------------////////////////
// console.log(JSON.stringify(this.credentials))
      this.auth.register(this.credentials).subscribe(

        user => {

          console.log("user",user);
          if (user.image == 'none') {
            // console.log('you');
            this.opensuccesspop();
            const newreq = this.http.post('https://ezeeboss.com:3001/api/sendmail', {
              id: user.id,
              // imageurl: user.imgurl.replace('mybitrade','ezeeboss'),
              imageurl: "none",
              to: user.to,
              name: user.name,
              location: this.cityname,
              // url: 'https://ezeeboss.com/confirm/' + user.id
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
                    const newreq = this.http.post('https://ezeeboss.com:3001/api/delete', { id: user.id })
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
                    const newreq = this.http.post('https://ezeeboss.com:3001/api/sendmail', {
                      id: user.id,
                      imageurl: user.imgurl,
                      to: user.to,
                      name: user.name,
                      location: this.cityname,
                      // url: 'https://ezeeboss.com/confirm/' + user.id
                      url: 'https://ezeeboss.com/confirm/' + user.id
                    })
                      .subscribe(
                        // tslint:disable-next-line:no-shadowed-variable
                        res => {
                          //  this.loading = false;
                          //this.error = 'Your Face Was Not Detected.Please Try Again';

                          this.userregistered = user.to;
                          localStorage.clear();

                          this.spinnerService.hide();

                          //   this.moveToSpecificView();
                        }
                      );
                    this.userregistered = user.to;
                    //     console.log(this.userregistered);
                    this.credentials.lname = null;
                    this.credentials.email = null;
                    this.credentials.fname = null;
                    this.credentials.password = null;
                    this.credentials.cpassword = null;
                    this.credentials.phonenumber = null;
                    this.credentials.image = null;
                    this.webcamImage = null;
                    localStorage.clear();
                    // this.scrollToTop(top);
                    // this.credentials = null;
                    // this.router.navigateByUrl('/digital_sign');
                  }
                }
                , (err) => {
                  this.error = 'Something Went Wrong.Please Try Again !!!';
                  localStorage.clear();
                  this.auth.logout();
                });
          }  // else
        }, (err) => {
          // this.spinnerService.hide();
          //   this.loading = false;
          this.data = err;
          // console.log(this.data);
          // console.error(this.data.error);
          console.error(this.data.error.err);
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
  isFocused() {
    this.jagveer = true;
  }
  show() {
    this.sucessmessage.open();
    setTimeout(() => {
      var el = document.querySelector('.modal-content');
      //alert(el)
      // get the element's parent node
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
      //alert(el)
      // get the element's parent node
      var parent = el.parentNode;

      // move all children out of the element
      while (el.firstChild) parent.insertBefore(el.firstChild, el);

      // remove the empty element
      parent.removeChild(el);
    }, 1);

  }
  success() {
    //alert();
    this.router.navigate(['login']);
  }

}
