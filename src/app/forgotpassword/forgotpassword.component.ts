import { Component, OnInit , ViewChild, ElementRef } from '@angular/core';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';
import { HttpClient } from '@angular/common/http';
import { Router , ActivatedRoute, Params } from '@angular/router';
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {
  public password = null;
  public cpassword = null;
  public passworderror = null;
  public jagveer = false;
  public passworderrorr = null;
  public userid = null;

  @ViewChild('sucess') sucessmessage: any;
  // tslint:disable-next-line:max-line-length
  constructor( private activatedRoute: ActivatedRoute, public router: Router, private spinnerService: Ng4LoadingSpinnerService, private http: HttpClient) { }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      console.log('user-', params['userid'])
      this.userid = params['userid'];
      if (this.userid == null){
        this.router.navigate(['']);
      }
    });
  }
  isFocused() {
    this.jagveer = true;
  }
  success() {
    this.router.navigate(['login']);
  }
  opensuccesspop() {

    this.sucessmessage.open();
    setTimeout(() => {
      var el = document.querySelector('.modal-content');

// get the element's parent node
var parent = el.parentNode;

// move all children out of the element
// tslint:disable-next-line:curly
while (el.firstChild) parent.insertBefore(el.firstChild, el);

// remove the empty element
parent.removeChild(el);
    }, 1);
  }


  changepwd() {
    //  alert(this.userid)
      this.spinnerService.show();
      const req = this.http.post('https://ezeeboss.com:3001/api/chnagepwd', {
        password: this.password,
        id : this.userid
      })
        .subscribe((res: any) => {
          this.opensuccesspop();
          this.spinnerService.hide();
       
        },
          err => {
            this.spinnerService.hide();
 
            console.log('Error occured');
            localStorage.clear();
          });


  }
  checkpassword() {
 //   alert(this.password)
    var tests = [/[0-9]/, /[a-z]/, /[A-Z]/, /[^A-Z-0-9]/i]        // ^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&]{8,}
    const length = this.password.length;
    if (this.password == null)
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
      if (tests[i].test(this.password))
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
      this.passworderrorr = 'Strong';
    }

  }
  blurr() {
    if (this.passworderror === '') {
      this.jagveer = false;

    }
    else {
      const element: HTMLElement = document.getElementById('password') as HTMLElement;
      element.focus();
    }
  }
}
