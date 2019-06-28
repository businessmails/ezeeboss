import { Component, OnInit,ViewChild } from '@angular/core';
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
    { url: 'assets/img/bg11.png' },
    { url: 'assets/img/bg22.png' },
    { url: 'assets/img/bg55.png' },
    { url: 'assets/img/bg22.png' },
    { url: 'assets/img/bg55.png' },
    { url: 'assets/img/bg11.png' }
  ];
  backgroundSize: string = '86%';
  height: string = '480px';
  imgags: string[];
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
  
      this.slideshow.goToSlide(image);
    }

}
