import { Component, OnInit, Inject, ViewChild, ElementRef, Input, Pipe, PipeTransform, ViewEncapsulation } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { AuthenticationService, UserDetails, TokenPayload } from '../authentication.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { WebcamImage } from 'ngx-webcam';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { AppComponent} from '../app.component';
import { timer } from 'rxjs/observable/timer'; // (for rxjs < 6) use 'rxjs/observable/timer'
import { take, map } from 'rxjs/operators';
import * as jsPDF from 'jspdf';
import * as html2canvas from 'html2canvas';


let RecordRTC = require('recordrtc/RecordRTC.min');
let signcount = 0;
let signeddocid;
//const url = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/0.9.0rc1/jspdf.min.js';

// tslint:disable-next-line:use-pipe-transform-interface
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
    rememberme:''
  };
  html: any;
  documenthtml: SafeHtml;
  details: UserDetails;
  userid: string;
  userId:string;
  useremail: String;
  username: String;
  eligibility: any;
  eligible: Number;
  unknownimage: any;
  documentid: any;
  usertosign: any;
  location:any;
  cityname:string;
  loading = true;
  camera = null;
  userinitials:any;
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
  showdownload= false;
  fileslength: any;  noofpages : number;countDown
  clas = null;
  conveniancecount: Number;
  stream: MediaStream;
  recordRTC: any;
  type: any;
  trigger: Subject<void> = new Subject<void>();
  @ViewChild('video') video;
  @ViewChild('gethtml') gethtml: any;
  @ViewChild('initialModal') initialModal: any;
  method: any;

  constructor(
    private http: HttpClient,
    private activatedRoute: ActivatedRoute,
    private auth: AuthenticationService,
    private router: Router,
    private sanitized: DomSanitizer,
    private AppComponent:AppComponent

  ) { }

  ngOnInit() {
  //  this.loadscript();
    var ip = window.location.origin;
   // console.log('ip here->', ip);
    // alert(pathname);
    // alert(url);

    this.conveniancecount = 0;
    // this.loading = true;
    this.activatedRoute.params.subscribe((params: Params) => {

      const documentid = params['documentid'];
     // alert(documentid)
      const userid = params['userid'];
      this.userId = params['userid'];
      const usertosign = params['usertosign'];
      this.type= params['type'];usertosign
      if(this.type=="ni"){
   this.method=this.http.get('https://ezeeboss.com:3001/api/finduser/' + usertosign )

      }
      else{
      this.method= this.auth.profile()

      }
      this.method.subscribe(user => {
      //  console.log('mani'+user)
      if(this.type=="ni"){
        // console.log(user)
       this.details = user.data[0]
      // console.log("jagveer: ",this.details)

      }
      else{
        this.details = user;

      }
        this.userid = this.details._id;
        this.useremail = this.details.email;
        this.username = this.details.name;
        // console.log(this.details.name)
        this.userinitials = this.username.match(/\b\w/g) || [];
        this.userinitials = ((this.userinitials.shift() || '') + (this.userinitials.pop() || '')).toUpperCase();
        this.documentid = documentid;
        this.usertosign = usertosign;
        // alert(this.documentid)
        this.http.get('https://ezeeboss.com:3001/api/checkeligibility/' + this.useremail + '/' + documentid + '/' + userid)
          .subscribe(data => {
            this.eligibility = data;
            this.eligible = this.eligibility.data;
            console.log(this.eligibility)
            if (this.eligible !== 1) {
              this.router.navigateByUrl('/');
            } else {
              this.http.get('https://ezeeboss.com:3001/api/getdocument/' + this.userid + '/' + documentid)
                .subscribe(
                  // tslint:disable-next-line:no-shadowed-variable
                  data => {


                    this.html = data;
                    // console.log(this.html.data)
                    this.documenthtml = this.html.data.documenthtml;
                    if(this.html.data.actionrequired == 'Signed'){
                      this.router.navigateByUrl('/completed');
                    }
                    if(this.html.data.actionrequired == 'Rejected') {
                      this.router.navigateByUrl('/rejectedmassage');
                   } else {
                    this.withimage = this.html.data.withimage;
                    this.http.post('https://ezeeboss.com:3001/api/pdfdetail', { pdfid: this.html.data.documentid })
                    .subscribe(data => {
                      // this.pdfimages = data;
                      let i: number;
                      this.fileslength = data;
                      this.noofpages = this.fileslength.fileslength;
                    });
                    // alert(this.type)
                    if(this.withimage === true){
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
                        this.conveniancecount = 13;
                        const pathname = window.location.pathname; // Returns path only
                        const url = window.location.href;
                        const lastslashindex = url.lastIndexOf('/');
                        this.clas = url.substring(lastslashindex + 1);
                        const result = this.clas;
                        $('div.'+result).show();
                        $('div.appended').not('.'+result).hide();
                        $('.signed').show();
                        $('div.hideme').hide();
                        // if (!$('textarea').hasClass(result)) {
                        //   $('textarea').prop('disabled', true);
                        // }

                        $('textarea').not('.'+result).prop('disabled', true);

                      //  alert(result)
                        const numItems = $('.' + result).length;
                      //  console.log(numItems);
                        // tslint:disable-next-line:max-line-length
                        $('.dell').remove();
                        // $('.gethtml').find('.dell').remove();
                        $('.' + result + '1 div div').append('<br><button type="button" class="signbutton removeme"  style="background-color: #715632; width:170px; font-size: 18px;font-style:unset ; padding: 8px 12px; color: white; border: none; box-shadow: -1px 0px 5px 0px #191919;"><b>Click to Sign</b></button><br>');
                        //  $('.' + result + ' div div').css('pointer-events', 'none');
                        //  $('.' + result + ' div div button').css('cursor', 'pointer');
      
                        // $('.' + result + '1 div div').css('pointer-events', 'none');
                        // alert(this.clas);
                        this.conveniancecount = $('.' + result).length;
      
                        //   alert(this.conveniancecount);
                        // }, 3000);
                        // this.conveniancecount = 56;
                        const y = $('.' + result + '1').position();
                        //alert(y.top)
                        $('html, body').animate({
                          scrollTop: ($('.' + result + '1' ).offset().top + y.top-50)
                        }, 500)
                     //   $('.' + result).click(function () {
                        //   alert(result);
                          // this.conveniancecount=  this.conveniancecount -1;
                          $(document).on('click','.signbutton',function(){
                          //  alert($('.' + result).length)
                           // alert('hd')
                            if($(this).parent().prev('textarea').hasClass('gettext')) {
                              $(this).parent().prev('textarea').prev('.form-group').css('opacity',0);
                              // $(this).parent().addClass('ase')
                            }
                            // if($(this).prev('div').prev('textarea').hasClass('gettext')) {
                            //   //$(this).prev('br').remove();
                            //   alert('maniz')
                            //  $(this).prev('div').remove();
                            //   }
                            signcount++;
                      if(signcount == $('.' + result).length) {
                        $('#senddocbtn').show();
                      //  $('#downloaddocbtn').show();
                      //  $('#downloaddiv').show();
                        // $('#downloaddoc').show();
                      }
                          number++;
                          // let inc = number + 1;
                          $(this).parent().css({
                           
                            // 'font-family': 'serif',
                            'text-transform': 'lowercase'
                          });
                          $(this).closest('.' + result).css('border', 'none');
                          // alert($(this).text());
                          const strng = $(this).text();
                          // alert(strng)
                          let res = strng.replace('Click to Sign', '');
                          // alert(res)
                          // tslint:disable-next-line:max-line-length
                          $(this).parent().append('<div style="word-wrap: break-word;text-align: left;font-size: 18px !important; font-style:unset;font-weight: 400;color: rgb(20, 83, 148);">' + res + '</div>');
                          // $(this).closest('.removeme').css('display', 'none');
                          //   $('html, body').animate({
                          //     'scrollTop' : $(this).closest('.'+result).position().top;
                          //     alert()
                          // });
                          const num = number + 1;
                          // tslint:disable-next-line:max-line-length
                          if($('.' + result + '' + num).hasClass('gettext')) {
                           // alert('hi')
                            $('.' + result + '' + num).next('div' ).append('<br><button type="button" class="signbutton removeme" style="background-color: #715632; width:170px; font-size: 18px !important; font-style:unset;padding: 8px 12px; color: white; border: none; box-shadow: -1px 0px 5px 0px #191919;"><b>Click to Sign</b></button><br>');
                          }
                          $('.' + result + '' + num + ' div div').append('<br><button type="button" class="signbutton removeme" style="background-color: #715632; width:170px; font-size: 18px !important;font-style:unset; padding: 8px 12px; color: white; border: none; box-shadow: -1px 0px 5px 0px #191919;"><b>Click to Sign</b></button><br>');
      
                        //  console.log('-->.' + result + '' + num);
                          const x = $('.' + result + '' + num).position();
                          if (number < numItems) {
                            $('html, body').animate({
                              scrollTop: ($('.' + result + '' + num).offset().top + x.top - 100)
                            }, 500);
                          }
      
                          // let next;
                          // next = $(this).nextAll('.' + result).next();
                          // alert(next);
                          // $('html,body').scrollTop(next);
                          // const date = Date.now();
                          // console.log(this.datePipe.transform(date, 'yyyy-MM-dd'));
                          const now = new Date();
                          const year = '' + now.getFullYear();
                          let month = '' + (now.getMonth() + 1); if (month.length === 1) { month = '0' + month; }
                          let day = '' + now.getDate(); if (day.length === 1) { day = '0' + day; }
                          let hour = '' + now.getHours(); if (hour.length === 1) { hour = '0' + hour; }
                          let minute = '' + now.getMinutes(); if (minute.length === 1) { minute = '0' + minute; }
                          let second = '' + now.getSeconds(); if (second.length === 1) { second = '0' + second; }
                          const signdate = month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second;
                         // alert($(this).parent())
                        // console.log($(this).prev('div:eq(2)').attr("class"));
                         
                         if($(this).closest('.appended').hasClass('signhere')) {
                           $(this).prev('br').remove();
                           $(this).closest('.appended').addClass('signed');
                          $(this).parent().append(signdate);
                           }
                           if($(this).parent().prev('textarea').hasClass('gettext')) {
                            $(this).parent().prev('textarea').addClass('signed');
                            $(this).parent().prev('textarea').prev('.form-group').css('opacity',0);
                            $(this).parent().prev('textarea').css('border', 'none');

                         // $(this).parent().addClass('ase')
                          }
                          //  alert(JSON.stringify($(this).html()));
                          $(this).closest('.appended').addClass('signed');
                          $(this).closest('.appended').prev('.form-group').css('opacity',0);
                          $(this).remove();
                          
                          // $(this).remove();
                          // alert();
      
                        });
                        // }
                      }, 300);
                    }
                  }
                    // this.gethtml.innerHTML = this.html.data.documenthtml;
                    // this.documenthtml = this.sanitized.bypassSecurityTrustHtml(this.html.data.documenthtml);
                  });
            }
          });
      },
      error => {
        if(error.status == 401) {
          this.router.navigateByUrl('/');
        }
      });
    }
  );

  }

  ngAfterViewInit() {
    // set the initial state of the video
    let video:HTMLVideoElement = this.video.nativeElement;
    video.muted = false;
    video.controls = true;
    video.autoplay = false;
  }

  // loadscript() {
  //   let node = document.createElement('script');
  //       node.src = url;
  //       node.type = 'text/javascript';
  //       node.async = true;
  //       node.charset = 'utf-8';
  //       document.getElementsByTagName('head')[0].appendChild(node);
  // }

downloadpdf() {
  // $( "#gethtml" ).click(function() {
    alert()
    var htmlString = $( '.inthis' ).html();
    // $( this ).text( htmlString );
    // alert(htmlString)
    //console.log(htmlString)

    this.http.post('https://ezeeboss.com:3001/api/genratehtmlfile', {
        html:htmlString,
        // image: this.credentials.image
      }).subscribe((res: any) => {
        alert("suess");
        console.log(res);
      },(err:any)=>{
        console.log(err)
      })
    
  // });
  // html2canvas(document.body).then(function(canvas) {
    // console.log(canvas)
// });

//   htmlScreenCaptureJs.capture(
//     htmlScreenCaptureJs.OutputType.STRING,
//     window.document,
//     {
//         'imageFormatForDataUrl': 'image/jpeg',
//         'imageQualityForDataUrl': 1.0
//     }
// );//   var doc = new jsPDF();
//   doc.fromHTML($('body').get(0), 0, 0, {
//     'width': 100, // max width of c
//        // 'elementHandlers': specialElementHandlers
// },function(bla){doc.save('saveInCallback.pdf');},
// );
// // doc.save('sample-file.pdf');
// var doc = new jsPDF('p', 'pt', 'a4', true);
//     doc.fromHTML($('#gethtml').get(0), 0, 0, {
//       'width': 100
//     }, function (dispose) {
//     doc.save('thisMotion.pdf');
//     });

// html2canvas($('#gethtml')[0]).then(canvas => {   
//  // document.body.appendChild(canvas);
//   var a = document.createElement('a');
//   // toDataURL defaults to png, so we need to request a jpeg, then convert for file download.
//   a.href = canvas.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
//   a.download = 'somefilename.jpg';
//   setTimeout(() => {
//     a.click();

//   }, 4000);
// });
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
   // video.src = window.URL.createObjectURL(stream); ---------  depriciated
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
                formData.append('userid',this.usertosign);
                formData.append('docid',this.documentid);
                formData.append('user',this.userid)
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
    console.log('im');
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
              console.log(this.faceresponse);
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
            // tslint:disable-next-line:no-shadowed-variable
            res => {
              this.faceresponse = res;
              console.log(this.faceresponse);
              if (this.faceresponse.message === 'No Face Found') {
                this.loading = false;
                this.error = 'Your Face Was Not Detected.Please Try Again';
              } else if (this.faceresponse.message === 'Match Not Found') {
                this.loading = false;
                this.error = 'Failed To Recognise You.Please Try Again';
              } else {
                this.initialModal.open();
                 alert("Identity Matched");
               // this.startRecording();
           
                // tslint:disable-next-line:max-line-length
                // tslint:disable-next-line:no-shadowed-variable
                const req = this.http.post('https://ezeeboss.com:3001/api/signeduserimage', { userid: this.usertosign, docid: this.documentid, imagename: this.unknownimage }).subscribe(res => {

                });

                this.showpdf = true;
                //  this.router.navigateByUrl('/digital_sign');
                // alert('Verified');
                this.loading = false;
                // this.conveniancecount = 10;
                // setTimeout(function () {
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
                    $('div.'+result).show();
                    $('div.appended').not('.'+result).hide();
                    $('.signed').show();
                    $('div.hideme').hide();

                    // var divlength = $('div.appended')
                    // for(var i =0;i< divlength.length;i++) {
                    //   $($(divlength[i]).prev('.form-group').hide());
                    // }
                   // $('div.appended').not('.'+result)
                   // $('.form-group').hide();
                    // if (!$('textarea').hasClass(result)) {
                    //   $('textarea').prop('disabled', true);
                    // }

                    $('textarea').not('.'+result).prop('disabled', true);

                  //  alert(result)
                    const numItems = $('.' + result).length;
                  //  console.log(numItems);
                    // tslint:disable-next-line:max-line-length
                    $('.dell').remove();
                    // $('.gethtml').find('.dell').remove();
                    $('.' + result + '1 div div').append('<br><button type="button" class="signbutton removeme" style="background-color: #715632; width:140px; font-size: 22px !important; padding: 8px 12px; color: white;font-style:unset; border: none; box-shadow: -1px 0px 5px 0px #191919;"><b>Click to Sign</b></button><br>');
                    //  $('.' + result + ' div div').css('pointer-events', 'none');
                    //  $('.' + result + ' div div button').css('cursor', 'pointer');
  
                    // $('.' + result + '1 div div').css('pointer-events', 'none');
                    // alert(this.clas);
                    this.conveniancecount =$('.' + result).length;
  
                    //   alert(this.conveniancecount);
                    // }, 3000);
                    // this.conveniancecount = 56;
                    const y = $('.' + result + '1').position();
                    //alert(y.top)
                    $('html, body').animate({
                      scrollTop: ($('.' + result + '1' ).offset().top + y.top-50)
                    }, 500);
                 //   $('.' + result).click(function () {
                    //   alert(result);
                      // this.conveniancecount=  this.conveniancecount -1;
                      $(document).on('click','.signbutton',function(){
                       // alert($('.' + result).length)
                       // alert('hd')
                        if($(this).parent().prev('textarea').hasClass('gettext')) {
                          $(this).parent().prev('textarea').prev('.form-group').remove();
                       // $(this).parent().addClass('ase')
                        }
                        // if($(this).prev('div').prev('textarea').hasClass('gettext')) {
                        //   //$(this).prev('br').remove();
                        //   alert('maniz')
                        //  $(this).prev('div').remove();
                        //   }
                      signcount++;
                      if(signcount == $('.' + result).length) {
                        $('#senddocbtn').show();
                       $('#downloaddocbtn').show();

                         $('#downloaddiv').show();
                      }
                     
                      number++;
                      // let inc = number + 1;
                      $(this).parent().css({
                        // 'font-family': 'serif',
                        'text-transform': 'lowercase'
                      });
                      $(this).closest('.' + result).css('border', 'none');
                      // alert($(this).text());
                      const strng = $(this).text();
                      // alert(strng)
                      let res = strng.replace('Click to Sign', '');
                      // alert(res)
                      // tslint:disable-next-line:max-line-length
                      $(this).parent().append('<div style="word-wrap: break-word;text-align: left;font-size: 24px;font-weight: 400;color: rgb(20, 83, 148);">' + res + '</div>');
                      // $(this).closest('.removeme').css('display', 'none');
                      //   $('html, body').animate({
                      //     'scrollTop' : $(this).closest('.'+result).position().top;
                      //     alert()
                      // });
                      const num = number + 1;
                      // tslint:disable-next-line:max-line-length
                      if($('.' + result + '' + num).hasClass('gettext')) {
                       // alert('hi')
                        $('.' + result + '' + num).next('div' ).append('<br><button type="button" class="signbutton removeme" style="background-color: #715632; width:160px; font-size: 18px !important; padding: 8px 12px; color: white;font-style:unset; border: none; box-shadow: -1px 0px 5px 0px #191919;">b><Click to Sign</b></button><br>');
                      }
                      $('.' + result + '' + num + ' div div').append('<br><button type="button" class="signbutton removeme" style="background-color: #715632; width:160px; font-size: 18px !important; padding: 8px 12px; color: white;font-style:unset; border: none; box-shadow: -1px 0px 5px 0px #191919;"><b>Click to Sign</b></button><br>');
  
                    //  console.log('-->.' + result + '' + num);
                      const x = $('.' + result + '' + num).position();
                      if (number < numItems) {
                        $('html, body').animate({
                          scrollTop: ($('.' + result + '' + num).offset().top + x.top - 100)
                        }, 500);
                      }
  
                      // let next;
                      // next = $(this).nextAll('.' + result).next();
                      // alert(next);
                      // $('html,body').scrollTop(next);
                      // const date = Date.now();
                      // console.log(this.datePipe.transform(date, 'yyyy-MM-dd'));
                      const now = new Date();
                      const year = '' + now.getFullYear();
                      let month = '' + (now.getMonth() + 1); if (month.length === 1) { month = '0' + month; }
                      let day = '' + now.getDate(); if (day.length === 1) { day = '0' + day; }
                      let hour = '' + now.getHours(); if (hour.length === 1) { hour = '0' + hour; }
                      let minute = '' + now.getMinutes(); if (minute.length === 1) { minute = '0' + minute; }
                      let second = '' + now.getSeconds(); if (second.length === 1) { second = '0' + second; }
                      const signdate = month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second;
                     // alert($(this).parent())
                    // console.log($(this).prev('div:eq(2)').attr("class"));
                     
                     if($(this).closest('.appended').hasClass('signhere')) {
                       $(this).closest('.appended').addClass('signed');
                       $(this).prev('br').remove();
                      $(this).parent().append(signdate);
                       }
                       if($(this).parent().prev('textarea').hasClass('gettext')) {
                        $(this).parent().prev('textarea').addClass('signed');
                        $(this).parent().prev('textarea').prev('.form-group').css('opacity',0);
                        $(this).parent().prev('textarea').css('border', 'none');

                     // $(this).parent().addClass('ase')
                      }
                      //  alert(JSON.stringify($(this).html()));
                      $(this).closest('.appended').addClass('signed');
                      $(this).closest('.appended').prev('.form-group').css('opacity',0);
                      $(this).remove();
                      
                      // $(this).remove();
                      // alert();
  
                    });
                    // }
                  }, 300);
                // );
              }
            },
            err => {
              this.loading = false;
              this.error = 'Failed To Recognise You';
              //  alert('Failed To Recognise You');
              console.log('Error occured');
            });
      });
    });
  }

  rejectdocument() {
    this.loading = true;
    this.activatedRoute.params.subscribe((params: Params) => {
      const documentid = params['documentid'];
      alert(documentid)
      this.http.post('https://ezeeboss.com:3001/api/rejectdoc', {docid: documentid,name:this.username})
        .subscribe(
          data => {
           this.loading = false;
           alert('document rejected Successfully');
          this.router.navigateByUrl('/rejectedmail');
          this.stopRecording();
          });
    });
  }

  // verifyuser() {
  //   this.loading = false;
  //   // tslint:disable-next-line:max-line-length
  // tslint:disable-next-line:max-line-length
  //   $('div.signhere:contains(' + this.username + ') div div').append('<button type="button" class="signbutton" style="background-color: #715632; font-size: 22px; padding: 8px 12px; color: white; border: none; box-shadow: -1px 0px 5px 0px #191919;">Click to Sign</button>');
  //   $('.signbutton').click(function() {
  //     $(this).parent().css({
  //       'font-family': 'serif',
  //       'text-transform': 'lowercase'
  //     });
  //     $(this).closest('.signhere').css('border', 'none');
  //     // const date = Date.now();
  //     // console.log(this.datePipe.transform(date, 'yyyy-MM-dd'));
  //     const now = new Date();
  //     const year = '' + now.getFullYear();
  //     let month = '' + (now.getMonth() + 1); if (month.length === 1) { month = '0' + month; }
  //     let day = '' + now.getDate(); if (day.length === 1) { day = '0' + day; }
  //     let hour = '' + now.getHours(); if (hour.length === 1) { hour = '0' + hour; }
  //     let minute = '' + now.getMinutes(); if (minute.length === 1) { minute = '0' + minute; }
  //     let second = '' + now.getSeconds(); if (second.length === 1) { second = '0' + second; }
  //     const signdate = month + '/' + day + '/' + year + ' ' + hour + ':' + minute + ':' + second;
  //     $(this).parent().append( '<br>' + signdate);
  //     $(this).closest('.signhere').prev('div').remove();
  //     $(this).remove();
  //   });
  // }

  updatesignature() {

    if(this.withimage === true) {
    this.stopRecording();
    }
    this.loading = true;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        //alert(position)
     //   console.log(position.coords.latitude)
        return this.http.get("https://maps.googleapis.com/maps/api/geocode/json?latlng="+position.coords.latitude+","+position.coords.longitude+"&sensor=true&key="+this.AppComponent.GOOGLE_MAP_KEY)
        .subscribe(data => {
         // console.log(data)
         this.location = data;
         let cityname;
         let statename;
         for (var x = 0, length_1 = this.location.results.length; x < length_1; x++){
           for (var y = 0, length_2 = this.location.results[x].address_components.length; y < length_2; y++){
               var type = this.location.results[x].address_components[y].types[0];
                 if ( type === "administrative_area_level_1") {
                  statename = this.location.results[x].address_components[y].long_name;
                   if (cityname) break;
                 } else if (type === "locality"){
                  cityname = this.location.results[x].address_components[y].long_name;
                   if (statename) break;
                 }
             }
         }
      //   console.log(cityname, statename)
        this.cityname = cityname;
      //  console.log(this.cityname)
        this.activatedRoute.params.subscribe((params: Params) => {
          const documentid = params['documentid'];
          signeddocid = documentid
         // alert(documentid)
          const usertosign = params['usertosign'];
          this.http.post('https://ezeeboss.com:3001/api/updatedoc', { html: $('.gethtml').html(), userid: this.userId, docid: documentid, usertosign: this.usertosign,reciptemail: this.useremail,location:this.cityname })
            .subscribe(
              data => {
                // this.loading = false;
                const userid = params['userid'];
     
      
  
  
                $('.divsize img').each(function() {
                  const $img  = $(this);
            const imgsrc = $(this).attr('src');
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
              // alert(base64);
              // imgsrc = base64;
              $img.attr('src', base64);
            };
            xhr.send();
            });
            const element = document.getElementById('gethtml');
            
            element.scrollIntoView();
            const options = {pagesplit: true};
            const pdf = new jsPDF('p', 'pt', 'letter');
            setTimeout(() => {
             pdf.internal.scaleFactor = 1.36;
             this.loading = false;
            pdf.addHTML($('.inthis'), 0, 0, options, function() {
             // pdf.save('pageContent.pdf');
            //     var data = new Blob([pdf.output()], {
            //     type: 'application/pdf'
            // });
            
            // var formData = new FormData();
            // formData.append("pdf", data, "myfile.pdf");
            // var request = new XMLHttpRequest();
            // request.open("POST", "http://localhost:3000/"); // Change to your server
            // request.send(formData);
            // alert(signeddocid)
            
            const blob = pdf.output('blob');
            const xhr = new XMLHttpRequest();
            xhr.open('post', 'https://ezeeboss.com:3001/api/download/'+userid +'/' + signeddocid, true);
            xhr.setRequestHeader('Content-Type', 'application/pdf');
            xhr.send(blob);
            // this.loading = false;
            xhr.onreadystatechange = function() {
              if (this.readyState == 4 && this.status == 200) {
                alert('document Sent Successfully');
           window.location.href= '/landing';
          $('#downloaddocbtn').show();
          $('#downloaddiv').show();
                           }
                          
            };
            });
          
             
            }, 3000);
        
            // this.showdownload = true;
              });
        });
        })

      });
   

    } else {
      alert("Geolocation is not supported by this browser.");
    }

  }

  applypdf() {

    $('.divsize img').each(function() {
      const $img  = $(this);
const imgsrc = $(this).attr('src');
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
  // alert(base64);
  // imgsrc = base64;
  $img.attr('src', base64);
};
xhr.send();
});

const element = document.getElementById('gethtml');

element.scrollIntoView();
const options = {pagesplit: true};
const pdf = new jsPDF('p', 'pt', 'letter');
setTimeout(() => {
 pdf.internal.scaleFactor = 1.37;
pdf.addHTML($('.inthis'), 0, 0, options, function() {
  pdf.save('Document.pdf');
   window.location.href='/landing';
});
}, 3000);

// this.router.navigateByUrl('/completed');
}


  applyinitials() {
    this.initialModal.close();
    console.log(this.withimage)
    if(this.withimage === true) {
    this.startRecording();
    const interval = 1000;
    const duration = this.noofpages * 30 * 1000;
    const stream$ = Observable.timer(0, interval)
      .finally(() => 
      {
        this.stopRecording();
        if(this.router.url.includes('newsign')) {
          alert('Your Session has expired..Please Start a new Session.');
          }
        // alert('Your Session has expired..Please Start a new Session.');
        this.router.navigateByUrl('/landing');
      })
      .takeUntil(Observable.timer(duration + interval))
      .map(value => duration - value * interval);
    stream$.subscribe(value => this.countDown = value/1000)
    }
  }
}


