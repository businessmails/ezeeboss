import { Component, OnInit, Inject, ViewChild, ElementRef, Input, Pipe, PipeTransform, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService, UserDetails, TokenPayload } from '../authentication.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { AppComponent } from '../app.component';
import { timer } from 'rxjs/observable/timer'; // (for rxjs < 6) use 'rxjs/observable/timer'
import { take, map } from 'rxjs/operators';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';


let RecordRTC = require('recordrtc/RecordRTC.min');
let signcount = 0;
let signeddocid;
@Pipe({ name: 'noSanitize' })
@Component({
  selector: 'app-signpdf',
  templateUrl: './newsignpdf.component.html',
  styleUrls: ['./newsignpdf.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class NewsignpdfComponent implements OnInit {
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
  html: any;
  documenthtml: SafeHtml;
  details: UserDetails;
  userid: string;
  userId: string;
  useremail: String;
  username: String;
  eligibility: any;
  eligible: Number;
  unknownimage: any;
  documentid: any;
  usertosign: any;
  location: any;
  cityname: string;
  loading = true;
  camera = null;
  userinitials: any;
  imagecaptured = null;
  image1captured = null;
  imgcap = null;
  webcamImage: WebcamImage = null;
  webcamImageCapture: WebcamImage = null;

  showWebcam = false;
  showWebcamcapture = false;

  faceresponse: any;
  error = null;
  showpdf = true;
  withimage = true;
  showdownload = false;
  fileslength: any; noofpages: number; countDown
  clas = null;
  conveniancecount: any;
  stream: MediaStream;
  recordRTC: any;
  type: any;
  classarray: any;
  trigger: Subject<void> = new Subject<void>();
  @ViewChild('video') video;
  @ViewChild('gethtml') gethtml: any;
  @ViewChild('initialModal') initialModal: any;
  method: any;
  comparetext: any;
  clikStatus = false;
  template: string = `<img src="../../assets/img/ezgif.com-gif-maker.gif" style="margin-left:200px"/>`
  clicks: any;
  num: any = 1;
  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private auth: AuthenticationService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService,
    private sanitized: DomSanitizer,
    private AppComponent: AppComponent

  ) { }
  getCount() {
    this.conveniancecount = $('.' + this.clas).length;
    if (this.clikStatus) {
      this.clicks = parseInt(this.conveniancecount) - parseInt(this.num);
      this.num++;
    } else {
      this.clicks = this.conveniancecount;
    }
    this.clikStatus = true;
  }
  ngOnInit() {
    var ip = window.location.origin;
    this.conveniancecount = 0;
    this.activatedRoute.params.subscribe((params: Params) => {
      const documentid = params['documentid'];
      const userid = params['userid'];
      this.userId = params['userid'];
      const usertosign = params['usertosign'];
      this.type = params['type'];
      if (this.type == "ni") {
        this.method = this.http.get('https://ezeeboss.com:3001/api/finduser/' + usertosign)
      }
      else {
        this.method = this.auth.profile()
      }
      this.method.subscribe(user => {
        if (this.type == "ni") {
          this.details = user.data[0]
        }
        else {
          this.details = user;
        }
        this.userid = this.details._id;
        this.useremail = this.details.email;
        this.username = this.details.name;
        this.userinitials = this.username.match(/\b\w/g) || [];
        this.userinitials = ((this.userinitials.shift() || '') + (this.userinitials.pop() || '')).toUpperCase();
        this.documentid = documentid;
        this.usertosign = usertosign;
        this.http.get('https://ezeeboss.com:3001/api/checkeligibility/' + this.useremail + '/' + documentid + '/' + userid)
          .subscribe(data => {
            this.eligibility = data;
            this.eligible = this.eligibility.data;

            if (this.eligible !== 1) {
              this.router.navigateByUrl('/');
            } else {
              this.http.get('https://ezeeboss.com:3001/api/getdocument/' + this.userid + '/' + documentid)
                .subscribe(
                  data => {
                    this.html = data;
                    this.documenthtml = this.html.data.documenthtml;
                    if (this.html.data.actionrequired == 'Signed') {
                      this.router.navigateByUrl('/completed');
                    }
                    if (this.html.data.actionrequired == 'Rejected') {
                      this.router.navigateByUrl('/rejectedmassage');
                    } else {
                      this.withimage = this.html.data.withimage;
                      this.http.post('https://ezeeboss.com:3001/api/pdfdetail', { pdfid: this.html.data.documentid })
                        .subscribe(data => {
                          let i: number;
                          this.fileslength = data;
                          this.noofpages = this.fileslength.fileslength;
                        });
                      if (this.withimage === true) {
                        this.showpdf = false;
                        this.loading = false;
                      } else {
                        this.showpdf = true;
                        this.loading = false;

                        this.initialModal.open();
                        setTimeout(() => {
                          $(document).on('blur', '.gettext', function () {
                            $(this).html($(this).val() as any)
                          });
                          var number = 0;
                          var clickarray = [];
                          this.conveniancecount = 13;
                          const pathname = window.location.pathname; // Returns path only
                          const url = window.location.href;
                          const lastslashindex = url.lastIndexOf('/');
                          this.clas = url.substring(lastslashindex + 1);
                          const result = this.clas;
                          var clickLength = $('.' + result).length;


                          var divs = document.getElementsByClassName(result);
                          var classarray = []
                          for (var i = 0; i < divs.length; i++) {
                            var data = divs[i].className.trim();
                            var classname = data.split(" ").splice(-1);
                            this.comparetext = classname;
                            if (this.comparetext == 'initialsign') {
                              var s = data.split(" ").splice(-2);
                              var ss = s.toString()
                              var indexvalue = ss.indexOf(',');
                              var streetaddress = ss.substr(0, indexvalue);
                              classarray.push([streetaddress]);
                            }
                            else {
                              classarray.push(classname);

                            }


                          }
                          this.classarray = classarray
                          $('div.' + result).show();
                          $('div.appended').not('.' + result).hide();
                          $('.signed').show();
                          $('div.hideme').hide();
                          $('textarea').not('.' + result).prop('disabled', true);

                          const numItems = $('.' + result).length;

                          $('.dell').remove();
                          $('.' + classarray[0] + ' div div').append('<br><button type="button" class="signbutton removeme"  style="    background-color: #715632; width: 178px; font-size: 16px !important; padding: 8px 12px;color: white; font-style: unset;border: none; box-shadow: -1px 0px 5px 0px #191919;margin-top:-16px;"><b>Click to Sign</b></button><br>');

                          this.conveniancecount = $('.' + result).length;
                          var clickLength = $('.' + result).length;
                          const y = $('.' + classarray[0]).position();

                          $('html, body').animate({

                            scrollTop: ($('.' + classarray[0]).offset().top + y.top - 50)
                          }, 500);
                          $(document).on('click', '.signbutton', function () {

                            if ($(this).parent().prev('textarea').hasClass('gettext')) {
                              $(this).parent().prev('textarea').prev('.form-group').css('opacity', 0);
                            }
                            signcount++;
                            ++number;
                            if (signcount == clickLength) {
                              $('#senddocbtn').show();
                            }
                            $(this).parent().css({
                              'text-transform': 'lowercase'

                            });
                            $(this).closest('.' + result).css('border', 'none');
                            const strng = $(this).text();

                            let res = strng.replace('Click to Sign', '');
                            $(this).parent().append('<div style="word-wrap: break-word;text-align: left;font-size: 18px !important; font-style:unset;font-weight: 400;color: rgb(20, 83, 148);">' + res + '</div>');

                            if ($('.' + classarray[number]).hasClass('gettext')) {
                              $('.' + classarray[number]).next('div').append('<br><button type="button" class="signbutton removeme" style="background-color: #715632; width:170px; font-size: 18px !important; font-style:unset;padding: 8px 12px; color: white; border: none; box-shadow: -1px 0px 5px 0px #191919;margin-top: -15px;float: left;"><b>Click to Sign</b></button><br>');
                            }
                            $('.' + classarray[number] + ' div div').append('<br><button type="button" class="signbutton removeme" style="background-color: #715632; width:170px; font-size: 18px !important;font-style:unset; padding: 8px 12px; color: white; border: none; box-shadow: -1px 0px 5px 0px #191919;margin-top: -5px;float: left;"><b>Click to Sign</b></button><br>');
                            const x = $('.' + classarray[number]).position();
                            if (number < clickLength) {
                              $('html, body').animate({
                                scrollTop: ($('.' + classarray[number]).offset().top + x.top - 100)
                              }, 500);
                            }
                              $('#checkCount').click()

                            const now = new Date();
                            const year = '' + now.getFullYear();
                            let month = '' + (now.getMonth() + 1); if (month.length === 1) { month = '0' + month; }
                            let day = '' + now.getDate(); if (day.length === 1) { day = '0' + day; }
                            let hour = '' + now.getHours(); if (hour.length === 1) { hour = '0' + hour; }
                            let minute = '' + now.getMinutes(); if (minute.length === 1) { minute = '0' + minute; }
                            let second = '' + now.getSeconds(); if (second.length === 1) { second = '0' + second; }
                            const signdate = month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second;

                            if ($(this).closest('.appended').hasClass('signhere')) {
                              $(this).prev('br').remove();
                              $(this).closest('.appended').addClass('signed');
                              $(this).parent().append(signdate);
                            }
                            if ($(this).parent().prev('textarea').hasClass('gettext')) {
                              $(this).parent().prev('textarea').addClass('signed');
                              $(this).parent().prev('textarea').prev('.form-group').css('opacity', 0);
                              $(this).parent().prev('textarea').css('border', 'hidden');

                            }
                            $(this).closest('.appended').addClass('signed');
                            $(this).closest('.appended').prev('.form-group').css('opacity', 0);
                            $(this).remove();

                          });

                          $('#checkCount').click()
                        }, 300);

                      }
                    }
                  });
            }
          });
      },
        error => {
          if (error.status == 401) {
            this.router.navigateByUrl('/');
          }
        });
    }

    );

  }

  ngAfterViewInit() {
    // set the initial state of the video
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = false;
    video.controls = true;
    video.autoplay = false;
  }



  downloadpdf() {
    var htmlString = $('.inthis').html();
    this.http.post('https://ezeeboss.com:3001/api/genratehtmlfile', {
      html: htmlString,

    }).subscribe((res: any) => {
      alert("sucess");

    }, (err: any) => {
      console.log(err)
    })
  }

  toggleControls() {
    let video: HTMLVideoElement = this.video.nativeElement;
    video.muted = !video.muted;
    video.controls = !video.controls;
    video.autoplay = !video.autoplay;
  }

  successCallback(stream: MediaStream) {

    var options = {
      mimeType: 'video/webm', // or video/webm\;codecs=h264 or video/webm\;codecs=vp9
      audioBitsPerSecond: 128000,
      videoBitsPerSecond: 128000,
      bitsPerSecond: 128000 // if this line is provided, skip above two
    };
    this.stream = stream;
    this.recordRTC = RecordRTC(stream, options);
    this.recordRTC.startRecording();
    let video: HTMLVideoElement = this.video.nativeElement;
    video.srcObject = stream;
    const captureduration = this.noofpages * 30 * 1000 / 2;
    const tekescreenshot = captureduration + 5 * 1000;
    setTimeout(() => {
      this.toggleWebcamCapture();
    }, captureduration);
    setTimeout(() => {
      this.triggerSnapshotCapture();
    }, tekescreenshot);
    this.toggleControls();
  }

  errorCallback() {
    //handle error here
  }

  processVideo(audioVideoWebMURL) {
    let video: HTMLVideoElement = this.video.nativeElement;
    let recordRTC = this.recordRTC;
    video.src = audioVideoWebMURL;
    this.toggleControls();
    var recordedBlob = recordRTC.getBlob();
    var fileName = 'abc';

    var file = new File([recordedBlob], fileName, {
      type: 'video/webm'
    });
    const formData: FormData = new FormData();
    formData.append('filetoupload', file);
    formData.append('userid', this.usertosign);
    formData.append('docid', this.documentid);
    formData.append('user', this.userid)
    this.http.post('https://ezeeboss.com:3001/api/uploadvideofile', formData)
      .subscribe(data => {
      });
    recordRTC.getDataURL(function (dataURL) { });
  }

  startRecording() {
    let mediaConstraints: any;
    mediaConstraints = {
      video: {
        mandatory: {
          maxWidth: 320,
          maxHeight: 240
        }
      }, audio: true
    };
    navigator.mediaDevices
      .getUserMedia(mediaConstraints)
      .then(this.successCallback.bind(this), this.errorCallback.bind(this));


  }

  stopRecording() {
    let recordRTC = this.recordRTC;
    recordRTC.stopRecording(this.processVideo.bind(this));
    let stream = this.stream;
    stream.getAudioTracks().forEach(track => track.stop());
    stream.getVideoTracks().forEach(track => track.stop());
  }

  toggleWebcam(): void {
    this.error = null;
    this.camera = true;
    this.imagecaptured = null;
    // console.log('im');
    this.showWebcam = !this.showWebcam;
    if (this.webcamImage) {
      this.webcamImage = null;
    }
  }

  toggleWebcamCapture(): void {
    this.error = null;
    this.camera = true;
    this.image1captured = null;
    // console.log('ims');
    this.showWebcamcapture = !this.showWebcamcapture;

    if (this.webcamImageCapture) {
      this.webcamImageCapture = null;
    }
  }

  triggerSnapshot(): void {
    this.trigger.next();
    this.camera = null;
    this.imagecaptured = true;
  }

  triggerSnapshotCapture(): void {
    this.trigger.next();
    this.camera = null;
    this.imagecaptured = true;
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.useremail = this.details.email;
      this.http.post('https://ezeeboss.com:3001/api/email', {
        email: this.useremail,
        image: this.imgcap
      }).subscribe((res: any) => {
        // tslint:disable-next-line:max-line-length
        this.unknownimage = res.unknownimage;
        const req = this.http.get('https://ezeeboss.com:5000/api/recognize?knownfilename=' + res.knownimage + '&unknownfilename=' + res.unknownimage + '.jpg')
          .subscribe(
            // tslint:disable-next-line:no-shadowed-variable
            res => {
              this.faceresponse = res;
              // console.log(this.faceresponse);
              if (this.faceresponse.message === 'No Face Found') {
                alert('No Face Found');
                this.router.navigateByUrl('/landing');
              } else if (this.faceresponse.message === 'Match Not Found') {
                alert('Person Changed');
                this.router.navigateByUrl('/landing');
              } else {
                // alert('Matched');
              }
            });
      });
    });
  }

  handleImage(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    this.webcamImage = webcamImage;
    // console.log(JSON.stringify(webcamImage));
    this.credentials.image = webcamImage.imageAsDataUrl;
    this.credentials.imag = 'image';
    this.showWebcam = false;
  }
  handleImageCapture(webcamImage: WebcamImage): void {
    // console.info('received webcam image', webcamImage);
    this.webcamImageCapture = webcamImage;
    // console.log(JSON.stringify(webcamImage));
    this.imgcap = webcamImage.imageAsDataUrl;
    this.showWebcamcapture = false;

    // this.credentials.imag = 'image';
    // this.showWebcam = false;
  }

  public get triggerObservable(): Observable<void> {
    return this.trigger.asObservable();
  }

  verifyuser() {

    this.loading = true;
    this.auth.profile().subscribe(user => {
      this.details = user;
      this.useremail = this.details.email;
      this.http.post('https://ezeeboss.com:3001/api/email', {
        email: this.useremail,
        image: this.credentials.image
      }).subscribe((res: any) => {
        // tslint:disable-next-line:max-line-length
        this.unknownimage = res.unknownimage;
        const req = this.http.get('https://ezeeboss.com:5000/api/recognize?knownfilename=' + res.knownimage + '&unknownfilename=' + res.unknownimage + '.jpg')
          .subscribe(
            res => {
              this.faceresponse = res;
              if (this.faceresponse.message === 'No Face Found') {
                this.loading = false;
                this.error = 'Your Face Was Not Detected.Please Try Again';
              } else if (this.faceresponse.message === 'Match Not Found') {
                this.loading = false;
                this.error = 'Failed To Recognise You.Please Try Again';
              } else {
                this.initialModal.open();

                alert("Identity Matched");
              
                const req = this.http.post('https://ezeeboss.com:3001/api/signeduserimage', { userid: this.usertosign, docid: this.documentid, imagename: this.unknownimage }).subscribe(res => {

                });

                this.showpdf = true;
                this.loading = false;
                setTimeout(() => {
                  $(document).on('blur', '.gettext', function () {
                    $(this).html($(this).val() as any)
                  });
                  var number = 0;
                  this.conveniancecount = 13;
                  const pathname = window.location.pathname; // Returns path only
                  const url = window.location.href;
                  const lastslashindex = url.lastIndexOf('/');
                  this.clas = url.substring(lastslashindex + 1);

                  const result = this.clas;


                  var clickLength = $('.' + result).length;


                  var divs = document.getElementsByClassName(result);
                  var classarray = []
                  for (var i = 0; i < divs.length; i++) {
                    var data = divs[i].className.trim();
                    var classname = data.split(" ").splice(-1);
                    this.comparetext = classname;
                    if (this.comparetext == 'initialsign') {
                      var s = data.split(" ").splice(-2);
                      var ss = s.toString()
                      var indexvalue = ss.indexOf(',');
                      var streetaddress = ss.substr(0, indexvalue);
                      classarray.push([streetaddress]);
                    }
                    else {
                      classarray.push(classname);
                    }
                  }
                  this.classarray = classarray
                  $('div.' + result).show();
                  $('div.appended').not('.' + result).hide();
                  $('.signed').show();
                  $('div.hideme').hide();
                  $('textarea').not('.' + result).prop('disabled', true);
                  const numItems = $('.' + result).length;
                  $('.dell').remove();
                  $('.' + classarray[0] + ' div div').append('<br><button type="button" class="signbutton removeme" style="background-color: #715632; width:140px; font-size: 18px !important; padding: 8px 12px; color: white;font-style:unset; border: none; box-shadow: -1px 0px 5px 0px #191919;"><b>Click to Sign</b></button><br>');
                  this.conveniancecount = $('.' + result).length;
                  const y = $('.' + classarray[0]).position();
                  $('html, body').animate({
                    scrollTop: ($('.' + classarray[0]).offset().top + y.top - 50)
                  }, 500);
                  $(document).on('click', '.signbutton', function () {
                    if ($(this).parent().prev('textarea').hasClass('gettext')) {
                      $(this).parent().prev('textarea').prev('.form-group').remove();
                    }
                    signcount++;
                    ++number;
                    if (signcount == clickLength) {
                      $('#senddocbtn').show();
                      $('#downloaddocbtn').show();

                      $('#downloaddiv').show();
                    }
                    $(this).parent().css({
                      'text-transform': 'lowercase'
                    });
                    $(this).closest('.' + result).css('border', 'none');
                    const strng = $(this).text();
                    let res = strng.replace('Click to Sign', '');
                    $(this).parent().append('<div style="word-wrap: break-word;text-align: left;font-size: 24px;font-weight: 400;color: rgb(20, 83, 148);">' + res + '</div>');
                    const num = number + 1;
                    if ($('.' + classarray[number]).hasClass('gettext')) {
                      $('.' + classarray[number]).next('div').append('<br><button type="button" class="signbutton removeme" style="background-color: #715632; width:160px; font-size: 18px !important; padding: 8px 12px; color: white;font-style:unset; border: none; box-shadow: -1px 0px 5px 0px #191919;"><b>Click to Sign</b></button><br>');
                    }
                    $('.' + classarray[number] + ' div div').append('<br><button type="button" class="signbutton removeme" style="background-color: #715632; width:160px; font-size: 18px !important; padding: 8px 12px; color: white;font-style:unset; border: none; box-shadow: -1px 0px 5px 0px #191919;"><b>Click to Sign</b></button><br>');

                    const x = $('.' + classarray[number]).position();
                    if (number < clickLength) {
                      $('html, body').animate({
                        scrollTop: ($('.' + classarray[number]).offset().top + x.top - 100)
                      }, 500);
                    }

                    const now = new Date();
                    const year = '' + now.getFullYear();
                    let month = '' + (now.getMonth() + 1); if (month.length === 1) { month = '0' + month; }
                    let day = '' + now.getDate(); if (day.length === 1) { day = '0' + day; }
                    let hour = '' + now.getHours(); if (hour.length === 1) { hour = '0' + hour; }
                    let minute = '' + now.getMinutes(); if (minute.length === 1) { minute = '0' + minute; }
                    let second = '' + now.getSeconds(); if (second.length === 1) { second = '0' + second; }
                    const signdate = month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second;

                    if ($(this).closest('.appended').hasClass('signhere')) {
                      $(this).closest('.appended').addClass('signed');
                      $(this).prev('br').remove();
                      $(this).parent().append(signdate);
                    }
                    if ($(this).parent().prev('textarea').hasClass('gettext')) {
                      $(this).parent().prev('textarea').addClass('signed');
                      $(this).parent().prev('textarea').prev('.form-group').css('opacity', 0);
                      $(this).parent().prev('textarea').css('border', 'hidden');

                    }
                    $(this).closest('.appended').addClass('signed');
                    $(this).closest('.appended').prev('.form-group').css('opacity', 0);
                    $(this).remove();
                  });
                }, 300);
              }
            },
            err => {
              this.loading = false;
              this.error = 'Failed To Recognise You';
              console.log('Error occured');
            });
      });
    });
  }


  rejectdocument() {
    this.loading = true;
    this.activatedRoute.params.subscribe((params: Params) => {
      const documentid = params['documentid'];
      // alert(documentid)
      this.http.post('https://ezeeboss.com:3001/api/rejectdoc', { docid: documentid, name: this.username })
        .subscribe(
          data => {
            this.loading = false;
            alert('document rejected Successfully');
            this.router.navigateByUrl('/rejectedmail');
            this.stopRecording();
          });
    });
  }



  updatesignature() {

    if (this.withimage === true) {
      this.stopRecording();
    }
    this.loading = true;
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
            this.activatedRoute.params.subscribe((params: Params) => {
              const documentid = params['documentid'];
              signeddocid = documentid
              const usertosign = params['usertosign'];
              this.http.post('https://ezeeboss.com:3001/api/updatedoc', { html: $('.gethtml').html(), userid: this.userId, docid: documentid, usertosign: this.usertosign, reciptemail: this.useremail, location: this.cityname })
                .subscribe(
                  data => {
                    const userid = params['userid'];
                    $('.divsize img').each(function () {
                      const $img = $(this);
                      const imgsrc = $(this).attr('src');
                      var dimens = newFunction(imgsrc);
                      const xhr = new XMLHttpRequest();
                      xhr.responseType = 'arraybuffer';
                      xhr.open('GET', imgsrc);
                      xhr.onload = function () {
                        let base64, binary, bytes, mediaType;
                        bytes = new Uint8Array(xhr.response);
                        binary = [].map.call(bytes, function (byte) {
                          return String.fromCharCode(byte);
                        }).join('');
                        mediaType = xhr.getResponseHeader('content-type');
                        base64 = [
                          'data:',
                          mediaType ? mediaType + ';' : '',
                          'base64,',
                          btoa(binary)
                        ].join('');
                        $img.attr('src', base64);
                      };
                      xhr.send();
                    });
                    const element = document.getElementById('gethtml');

                    element.scrollIntoView();
                    const options = { pagesplit: true };
                    const pdf = new jsPDF('p', 'pt', 'letter');
                    setTimeout(() => {

                      var check = localStorage.getItem("imgheight")
                      if (check <= "3300" && check >= "2550") {
                        pdf.internal.scaleFactor = 1.39;
                      }
                      else if (check <= "3508" && check >= "2480") {
                        pdf.internal.scaleFactor = 1.7;
                      }
                      else if (check <= "4367" && check >= "2833") {
                        pdf.internal.scaleFactor = 1.62;
                      }
                      else if (check <= "2700" && check >= "2250") {
                        pdf.internal.scaleFactor = 1.37;
                      }

                      else {
                        pdf.internal.scaleFactor = 1.36;
                      }

                      pdf.addHTML($('.inthis'), 0, 0, options, function () {
                        pdf.save('Document.pdf');
                      });
                      // this.loading = false;
                      pdf.addHTML($('.inthis'), 0, 0, options, function () {
                        const blob = pdf.output('blob');
                        const xhr = new XMLHttpRequest();
                        xhr.open('post', 'https://ezeeboss.com:3001/api/download/' + userid + '/' + signeddocid, true);
                        xhr.setRequestHeader('Content-Type', 'application/pdf');
                        xhr.send(blob);
                        xhr.onreadystatechange = function () {
                          if (this.readyState == 4 && this.status == 200) {
                            alert('Document Sent Successfully');
                            window.location.href = '/completed';
                          }
                        };
                      });
                    }, 3000);
                  });
            });
          })
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }

  }

  applypdf() {

    $('.divsize img').each(function () {
      const $img = $(this);
      const imgsrc = $(this).attr('src');


      var dimens = newFunction(imgsrc);
      const xhr = new XMLHttpRequest();
      xhr.responseType = 'arraybuffer';
      xhr.open('GET', imgsrc);
      xhr.onload = function () {
        let base64, binary, bytes, mediaType;
        bytes = new Uint8Array(xhr.response);
        binary = [].map.call(bytes, function (byte) {
          return String.fromCharCode(byte);
        }).join('');
        mediaType = xhr.getResponseHeader('content-type');
        base64 = [
          'data:',
          mediaType ? mediaType + ';' : '',
          'base64,',
          btoa(binary)
        ].join('');
        $img.attr('src', base64);
      };
      xhr.send();
    });

    const element = document.getElementById('gethtml');
    element.scrollIntoView();
    const options = { pagesplit: true };
    const pdf = new jsPDF('p', 'pt', 'letter');
    setTimeout(() => {
      pdf.internal.scaleFactor = 1.37;
      pdf.addHTML($('.inthis'), 0, 0, options, function () {
        pdf.save('Document.pdf');
        window.location.href = '/landing';
      });
    }, 3000);
  }


  applyinitials() {
    this.initialModal.close();
    if (this.withimage === true) {
      this.startRecording();
      const interval = 1000;
      const duration = this.noofpages * 30 * 1000;
      const stream$ = Observable.timer(0, interval)
        .finally(() => {
          this.stopRecording();
          if (this.router.url.includes('newsign')) {
            alert('Your Session has expired..Please Start a new Session.');
          }
          this.router.navigateByUrl('/landing');
        })
        .takeUntil(Observable.timer(duration + interval))
        .map(value => duration - value * interval);
      stream$.subscribe(value => this.countDown = value / 1000)
    }
  }
}

function newFunction(imgsrc: string) {
  // getdim(imgsrc);

  var img = new Image();

  img.onload = function () {
    var height = img.height;
    var width = img.width;
    localStorage.setItem("imgheight", height + "," + width);
    return "asd"
  }

  img.src = imgsrc;
}
