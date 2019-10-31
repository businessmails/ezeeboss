import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthenticationService, UserDetails } from '../authentication.service';
import * as jquery from 'jquery';
import { Router } from '@angular/router';
import 'jqueryui';
import { Ng4LoadingSpinnerService } from 'ng4-loading-spinner';

//import { constants } from 'fs';
// import { INTERNAL_BROWSER_PLATFORM_PROVIDERS } from '@angular/platform-browser';
const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];
const date = new Date();
let alreadychecked = false;
let items = [];
let noofusers = [];
let appendedusers = [];
let userid, username, useremail, userinitials, todaydate;
@Component({
  selector: 'pdf',
  templateUrl: './pdf.component.html',
  styleUrls: ['./pdf.component.css'],

})

export class PdfComponent implements OnInit {
  details: UserDetails;
  loading = true;
  pdfimages = [];
  userdata: any;
  userlist: any;
  userdetail: any;
  selected: any;
  digitalpath: string;
  showImages = false;
  // username: string;
  // useremail: string;
  fileslength: any;
  dragged: null;
  today: number = Date.now();
  template: string = `<img src="../../assets/img/ezgif.com-gif-maker.gif" style="margin-left:200px"/>`

  constructor(
    private http: HttpClient,
    private auth: AuthenticationService,
    private router: Router,
    private spinnerService: Ng4LoadingSpinnerService

  ) {


  }

  ngOnInit() {

    alreadychecked = false;
    this.digitalpath = localStorage.getItem('digitalpath')

    this.auth.profile().subscribe(user => {
      this.details = user;
      this.http.get('http://localhost:3001/api/userlist/' + this.details._id + '/' + localStorage.getItem('pdfid'))
        .subscribe(data => {
          this.userdata = data;
          this.userlist = this.userdata.data;


        });
    });
    const pdfid = localStorage.getItem('pdfid');
    this.http.post('http://localhost:3001/api/pdfdetail', { pdfid: pdfid })
      .subscribe((data: any) => {

        let i: number;
        this.fileslength = data;
        if (data.fileslength == 1) {

          this.pdfimages.push('http://localhost:3001/uploadedpdf/' + pdfid + '/pdf' + '.png');

        }
        else {

          for (i = 0; i < data.fileslength; i++) {

            this.pdfimages.push('http://localhost:3001/uploadedpdf/' + pdfid + '/pdf-' + [i] + '.png');
            // this.showImages=true;
          }
        }

        this.spinnerService.hide();


      });

  }
  newValue(val) {
    // alert(val);
  }
  userselection(uservalue) {
    // alert(uservalue);
    this.http.get('http://localhost:3001/api/userdetail/' + uservalue)
      .subscribe(data => {
        // console.log(data);
        this.selected = 'show';
        this.userdetail = data;
        useremail = this.userdetail.data.email;
        username = this.userdetail.data.firstName + ' ' + this.userdetail.data.lastName;
        userid = this.userdetail.data._id;
        userinitials = username.match(/\b\w/g) || [];
        userinitials = ((userinitials.shift() || '') + (userinitials.pop() || '')).toUpperCase();
        todaydate = monthNames[date.getMonth()] + ' ' + date.getDate() + ', ' + date.getFullYear();
        if (alreadychecked === false) {
          setTimeout(() => {
            this.adddroppablehandler();
            alreadychecked = true;

            // alert();
          }, 300);
        }
      });
  }

  savehtml() {
    this.spinnerService.show();

    this.http.post('http://localhost:3001/api/savehtml', { html: $('.gethtml').html(), pdfid: localStorage.getItem('pdfid') })
      .subscribe(data => {
        // this.loading = false;
        this.spinnerService.hide();


        this.router.navigateByUrl('/actionrequired');
      });
  }
  senddocument() {
    const totalusers = $(':radio').length;

    // console.log(totalusers)
    const apeendedusers = items.length;
    //  console.log(appendedusers)
    if (totalusers !== apeendedusers) {
      alert('Place the sign for all participant');
      return false;
    }


    const numItems = $('.divsize').length;
    this.spinnerService.show();


    this.http.post('http://localhost:3001/api/senddocument', { html: $('.gethtml').html(), pdfid: localStorage.getItem('pdfid'), userid: this.details._id, notImage: localStorage.getItem('digitalpath'), pdfpath: localStorage.getItem('pdfpath') })
      .subscribe(data => {
        // this.loading = false;
        //  alert(localStorage.getItem('pdfpath'))
        this.spinnerService.hide();

        alert('Email Sent Successfully');
        this.router.navigateByUrl('/actionrequired');
      });
    // }

  }

  adddroppablehandler() {
    // alert();
    let droppablediv = '';
    let draggablediv = '';
    jquery('.droppable').mouseover(function () {
      droppablediv = this.id;
    });

    jquery('.draggable').draggable({
      start: function (event, ui) {
        draggablediv = $(this).find('h6').html();
      },
      cursorAt: { right: -10 },
      helper: 'clone',
      cursor: 'move',
      scroll: false,

    });



    jquery('.droppable').droppable({
      drop: function (event, ui) {

        $(':radio').each(function () {

          if ((noofusers).includes($(this).val())) {
          }
          else {
            noofusers.push($(this).val())
          }
        });


        const userid = $('input[name=r]:checked').val();

        if (!ui.draggable.hasClass('canvas-element')) {

          const canvasElement = ui.draggable.clone();
          canvasElement.addClass('canvas-element');
          canvasElement.draggable({
            start: function (event, ui) {
              if ($(this).css('right') == '0px' || $(this).css('right') == '45px') {
                $(this).css('right', '')
              }
            },
            cursor: 'move',
            containment: '.inthis',
          });
          $('.inthis').append(canvasElement);
          $('.inthis .form-group').addClass('hideme');

          setTimeout(() => {
            $('.canvas-element[style*="position: relative"]').remove();
          }, 10);
          $('#finish').show();
          let numItems = $('.' + userid).length;

          numItems++;
          const cls = userid + "" + numItems;


          if ($.trim(ui.draggable[0].innerText) == 'Initial') {
            canvasElement.append('<div class="dell"><img style="width: 18px;float: right;top: 16px;position: absolute;right: -9px;right: -9px;" src="../../assets/img/cross.svg"></div></div><div class="removediv appended' + ' ' + userid + ' ' + cls + ' initialsign" style="border: 2px solid #858f04;margin-left: 3px;min-width: 28px;height: 30px; padding: 0 10px;z-index:999"><div style="text-align: left;font-size: 19px; font-weight: 400; font-style: unset"><div class="text-fontsize font-sig-name">' + userinitials + '</b></div></div>');
            $('.removediv').prev('div.form-group').remove();
            if ((appendedusers).includes(userid)) {
            } else {
              appendedusers.push(userid);
            }

            if (appendedusers.length == noofusers.length) {
              $('#stickit').css('display', 'block');
            }
            else {
              $('#stickit').css('display', 'none');

            }

          } else if ($.trim(ui.draggable[0].innerText) == 'Name') {
            // tslint:disable-next-line:max-line-length
            canvasElement.append('<div class="dell"><img style="width: 18px;float: right;top: 16px;position: absolute;right: -9px;right: -9px;" src="../../assets/img/cross.svg"></div></div><div class="removediv appended ' + userid + ' ' + cls + '" style="border: 2px solid #858f04;margin-left: 3px;min-width: 28px;height: 30px; padding: 0 10px"><div style=" text-align: left; font-size: 19px; font-weight: 400; font-style: unset"><div class="text-fontsize">' + username + '</b></div></div></div>');
            $('.removediv').prev('div.form-group').remove();
            if ((appendedusers).includes(userid)) {
            } else {
              appendedusers.push(userid);
            }
            if (appendedusers.length == noofusers.length) {
              $('#stickit').css('display', 'block');
            }
            else {
              $('#stickit').css('display', 'none');

            }
          } else if ($.trim(ui.draggable[0].innerText) == 'Email') {
            // alert("h")
            // tslint:disable-next-line:max-line-length
            canvasElement.append('<div class="dell"><img style="width: 18px;float: right;top: 16px;position: absolute;right: -9px;right: -9px;" src="../../assets/img/cross.svg"></div></div><div  class="removediv appended ' + userid + ' ' + cls + ' " style="border: 2px solid #858f04;margin-left: 3px;min-width: 28px;height: 30px; padding: 0 10px;"><div style="word-wrap: break-word; text-align: left; font-size: 19px; font-weight: 400; font-style: unset"><div class="text-fontsize">' + useremail + '</b></div></div></div>');
            $('.removediv').prev('div.form-group').remove();
            if ((appendedusers).includes(userid)) {
            } else {
              appendedusers.push(userid);
            }
            if (appendedusers.length == noofusers.length) {
              $('#stickit').css('display', 'block');
            }
            else {
              $('#stickit').css('display', 'none');

            }
          } else if ($.trim(ui.draggable[0].innerText) == 'Date') {
            // tslint:disable-next-line:max-line-length
            canvasElement.append('<div class="dell"><img style="width: 18px;float: right;top: 16px;position: absolute;right: -9px;right: -9px;" src="../../assets/img/cross.svg"></div></div><div class="removediv appended ' + userid + ' ' + cls + ' " style="border: 2px solid #858f04;margin-left: 3px;min-width: 28px;height: 30px; padding: 0 10px; "><div style="word-wrap: break-word; text-align: left; font-size: 19px; font-weight: 400; font-style: unset"><div class="text-fontsize">' + todaydate + '</div> </div></div></div>');
            $('.removediv').prev('div.form-group').remove();
            if ((appendedusers).includes(userid)) {
            } else {
              appendedusers.push(userid);
            }
            if (appendedusers.length == noofusers.length) {
              $('#stickit').css('display', 'block');
            }
            else {
              $('#stickit').css('display', 'none');

            }
          } else if ($.trim(ui.draggable[0].innerText) == 'Signature') {
            // alert("sign")
            canvasElement.append('<div class="dell"><img style="width: 18px;float: right;top: 16px;position: absolute;right: -9px;right: -9px;" src="../../assets/img/cross.svg"></div></div><div class="signhere appended ' + userid + ' ' + cls + '" style="border: 2px solid #858f04;margin-left: 3px;height: 30px;  padding: 0 10px;"><div style="word-wrap: break-word; text-align: left; font-size: 19px; font-weight: 400; font-style: unset"><div class="text-fontsize font-sig-name">' + username + '</b></div></div></div>');
            if ((appendedusers).includes(userid)) {
            } else {
              appendedusers.push(userid);
            }
            // console.log(appendedusers)

            if (appendedusers.length == noofusers.length) {
              $('#stickit').css('display', 'block');
            }
            else {
              $('#stickit').css('display', 'none');

            }
            // $('.canvas-element .form-group').remove();
          } else if ($.trim(ui.draggable[0].innerText) == 'Text') {
            // tslint:disable-next-line:max-line-length
            canvasElement.append(
              '<div class="dell"><img style="width: 18px;float: right;top: 16px;position: absolute;right: -9px;right: -9px;" src="../../assets/img/cross.svg"></div></div><textarea rows="1" border: 2px solid #858f04 ;margin-left: 3px;min-width: 28px;height: 30px;  padding: 0 10px;resize:none;background: transparent;" class="gettext appended " ></textarea><div class=" ' + userid + ' ' + cls + '"><div><div  style="position: absolute;top: 75%; left:5%;"></div></div></div>');
            if ((appendedusers).includes(userid)) {
            } else {
              appendedusers.push(userid);
            }
            if (appendedusers.length == noofusers.length) {
              $('#stickit').css('display', 'block');
            }
            else {
              $('#stickit').css('display', 'none');

            }
            $(document).on('blur', '.gettext', function () {
              $(this).html($(this).val() as any)
            });
          }
          var topvalue;
          if (ui.offset.top < 20) {
            topvalue = 0
          } else {
            topvalue = (ui.offset.top - 33);
          }
          // console.log(((ui.offset.left - $(this).offset().left) + 12))
          if (!$(canvasElement[0].lastChild as any).attr('class')) {

            if (((ui.offset.left - $(this).offset().left) + 12) > 750) {
              // alert('1')
              canvasElement.css({
                left: ((ui.offset.left - $(this).offset().left) + 12),
                // right:0,
                top: topvalue,
                position: 'absolute'
              });
            }
            else if (((ui.offset.left - $(this).offset().left) + 12) > 710 && ((ui.offset.left - $(this).offset().left) + 12) < 750) {
              //   alert('hi')
              // alert('2')

              canvasElement.css({
                left: ((ui.offset.left - $(this).offset().left) + 12),
                //left:690,
                // right:0,
                top: topvalue,
                position: 'absolute'
              });
            }
            else if (((ui.offset.left - $(this).offset().left) + 12) < 10) {
              //  alert('hi')

              canvasElement.css({
                //left: ((ui.offset.left - $(this).offset().left) + 12),
                left: 0,
                top: topvalue,
                position: 'absolute'
              });
            }
            else {
              canvasElement.css({
                left: ((ui.offset.left - $(this).offset().left)),
                top: topvalue,
                position: 'absolute'
              });
            }
          }
          else if ($(canvasElement[0].lastChild as any).attr('class').includes('initialsign')) {
            if (((ui.offset.left - $(this).offset().left) + 12) > 750) {
              // alert('3')

              canvasElement.css({
                left: ((ui.offset.left - $(this).offset().left) + 12),
                // right:0,
                top: topvalue,
                position: 'absolute'
              });
            }
            else if (((ui.offset.left - $(this).offset().left) + 12) > 710 && ((ui.offset.left - $(this).offset().left) + 12) < 750) {
              //  alert('hi')


              canvasElement.css({
                left: ((ui.offset.left - $(this).offset().left) + 12),
                // left:690,
                top: topvalue,
                position: 'absolute'
              });
            }
            else if (((ui.offset.left - $(this).offset().left) + 12) < 10) {
              //  alert('hi')

              canvasElement.css({
                //left: ((ui.offset.left - $(this).offset().left) + 12),
                left: 0,
                top: topvalue,
                position: 'absolute'
              });
            }
            else {
              canvasElement.css({
                left: ((ui.offset.left - $(this).offset().left)),
                top: topvalue,
                position: 'absolute'
              });
            }
          } else {

            if (((ui.offset.left - $(this).offset().left) + 12) > 750) {
              // alert($.trim(ui.draggable[0].innerText))
              if($.trim(ui.draggable[0].innerText) == 'Email'){

  canvasElement.css({
                // left: ((ui.offset.left - $(this).offset().left)  - ($(window).width() - ($(this).offset().left + $(this).outerWidth()))),
                right: 0,
                top: topvalue,
                 width: 'max-content',
                position: 'absolute'
              });
              }else{
                  canvasElement.css({
                left: ((ui.offset.left - $(this).offset().left)  - ($(window).width() - ($(this).offset().left + $(this).outerWidth()))),
                // right: ($(window).width() - ($(this).offset().left + $(this).outerWidth())),
                top: topvalue,
                 width: 'max-content',
                position: 'absolute'
              });
              }
             // alert('4->'+ (ui.offset.left)+".."+ ($(window).width() - ($(this).offset().left + $(this).outerWidth())))

            
            }
            else if (((ui.offset.left - $(this).offset().left) + 12) > 710 && ((ui.offset.left - $(this).offset().left) + 12) < 750) {

              canvasElement.css({
                left: ((ui.offset.left - $(this).offset().left) + 12),
                //left:690,
                right: 0,
                top: topvalue,
                position: 'absolute'
              });
            }
            else if (((ui.offset.left - $(this).offset().left) + 12) < 10) {
              //  alert('hi')
              canvasElement.css({
                //left: ((ui.offset.left - $(this).offset().left) + 12),
                left: 0,
                top: topvalue,
                position: 'absolute'
              });
            }
            else {
              canvasElement.css({
                left: ((ui.offset.left - $(this).offset().left)),
                top: topvalue,
                position: 'absolute'
              });
            }
          }

          if (items.indexOf(userid) === -1) {
            items.push(userid);
            //    console.log('pushed-->', items);
          } else {
            //   console.log('alrady pushed-->', items);
          }

        }

        $('.dell').click(function () {
          if ($(this).next().is('textarea')) {
            var classname = $(this).next('textarea').attr('class').split(' ')[2];
          }

          else {
            var classname = $(this).next('div').attr('class').split(' ')[2];
          }
          // alert(classname)
          setTimeout(() => {
            var len = $('.' + classname).length;
            if (len == 0) {
              if (appendedusers.indexOf(classname) > -1) {
                appendedusers.splice($.inArray(classname, appendedusers), 1);
              }
            }


            if (appendedusers.length == noofusers.length) {
              $('#stickit').css('display', 'block');
            }
            else {
              $('#stickit').css('display', 'none');

            }
          }, 10);
          $(this).parent().remove();

        });
      }
    });
  }

}
