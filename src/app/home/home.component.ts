import { Component, OnInit, ViewChild } from '@angular/core';
import { NgxCarousel } from 'ngx-carousel';
//import { NgxHmCarouselModule } from 'ngx-hm-carousel';
import { AuthenticationService, UserDetails } from '../authentication.service';
import { Router } from '@angular/router';
@Component({
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  imageUrls = [
    { url: 'assets/img/bg1.png' },
    { url: 'assets/img/bg22.png' },
    { url: 'assets/img/bg2.png' },
    { url: 'assets/img/bg4.png' },
    { url: 'assets/img/bg55.png' }//,
    // { url: 'assets/img/bg22.png' }
  ];
  backgroundSize: string = '86%';
  height: string = '480px';
  imgags: string[];
  isFirst = false;
  @ViewChild('slideshow') slideshow: any;
  public carouselBannerItems: Array<any> = [];
  public carouselBanner: NgxCarousel;
  constructor(
    private auth: AuthenticationService,
    private router: Router

  ) {
    if (auth.isLoggedIn()) {
      // digital_sign
      router.navigate(['landing']);
    }
  }

  ngOnInit() {

    // this.slideshow.goToSlide(0);
    let ele = document.querySelector('.arrow.prev') as HTMLElement;
    ele.classList.remove('arrow')
    ele.classList.remove('left');
    ele.style.fontSize = '175px';
    ele.style.fontStyle = 'normal';
    ele.style.position = 'absolute';
    ele.style.color = '#b59848';
    ele.style.top = '25%';
    ele.style.left = '10%';
    ele.innerHTML = '<img src="../../assets/img/arrowleft.png">';
    ele.style.fontStyle = 'normal';

    ele = document.querySelector('.arrow.next') as HTMLElement;
    ele.classList.remove('arrow');
    ele.classList.remove('right');
    ele.style.fontSize = '175px';
    ele.style.fontStyle = 'normal';
    ele.style.color = '#b59848';
    ele.style.position = 'absolute';
    ele.style.top = '25%';
    ele.style.right = '10%';
    ele.innerHTML = '<img src="../../assets/img/arrowright.png">';
  }

  setcarouselimage(image) {
    console.log("-->", image)
    if (image == 0  &&  this.isFirst == false) { }

    else if (image == 0  &&  this.isFirst == true) { 
      this.slideshow.goToSlide(1);
      this.slideshow.goToSlide(2);
      this.slideshow.goToSlide(3);

      this.slideshow.goToSlide(4);
      this.slideshow.goToSlide(0);


    } else {
      this.isFirst=true;
      this.slideshow.goToSlide(1);
      this.slideshow.goToSlide(2);
      this.slideshow.goToSlide(3);

      this.slideshow.goToSlide(4);
      this.slideshow.goToSlide(image);
    }

  }

}
