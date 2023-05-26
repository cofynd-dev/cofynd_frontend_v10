import { Input } from '@angular/core';
import { Router } from '@angular/router';

import { Component, OnInit, ViewChild } from '@angular/core';
import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';

import { Brand } from '@core/models/brand.model';

interface coworkingBrandsList {
  name: string;
  address: string;
  image: string;
  id: string;
  slug?: string;
}

@Component({
  selector: 'app-home-brand-list',
  templateUrl: './home-brand-list.component.html',
  styleUrls: ['./home-brand-list.component.scss'],
})
export class HomeBrandListComponent implements OnInit {
  @Input() coworkingBrands: Brand[] = [];
  @Input() coLivingBrands: Brand[] = [];
  loading: boolean;
  @Input() pageTitle: string = 'Our Brand Partners';
  @Input() layout: 'grey';
  @Input() shouldCoWorkingVisible: boolean = true;
  @Input() shouldCoLivingVisible: boolean;
  @Input() shouldOtherBrandVisible: boolean;

  @ViewChild('popularSpaceCarousel', { static: false })
  popularSpaceCarousel: NguCarousel<coworkingBrandsList>;
  active = 0;
  carouselConfig: NguCarouselConfig = {
    grid: { xs: 3, sm: 5, md: 5, lg: 6, all: 0 },
    slide: 1,
    speed: 250,
    point: {
      visible: true,
    },
    interval: { timing: 4000, initialDelay: 1000 },
    load: 4,
    velocity: 0,
    touch: true,
    easing: 'cubic-bezier(0, 0, 0.2, 1)',
  };

  // coworkingBrandsList = [
  //   {
  //     id: 1,
  //     name: 'Wework',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/93f7fa099b87eccf93812fbff5d13f83a2cc487a.png',
  //     url: '/coworking-brand/wework'
  //   },
  //   {
  //     id: 2,
  //     name: 'Awfis',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/24d34a77dafecc24635767dee0ae7fd250cb3649.jpg',
  //     url: '/coworking-brand/awfis'
  //   },
  //   {
  //     id: 3,
  //     name: 'Innov8',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9c0c2a58819ef996fd210b7cad122dd15d761ed0.png',
  //     url: '/coworking-brand/innov8'
  //   },
  //   {
  //     id: 4,
  //     name: '91SpringBoard',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9d0d32fd1a689722ed5f719d9eab7dbbceeff9f5.png',
  //     url: '/coworking-brand/91-spring-board'
  //   },
  //   {
  //     id: 5,
  //     name: 'instaoffice',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/17870b28354c41ede388e5c30c67d196cfb05f08.png',
  //     url: '/coworking-brand/instaoffice'
  //   },
  //   {
  //     id: 6,
  //     name: 'Indiqube',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/31965e7c65101640fa945260d7fc2d2430a5b5fd.jpg',
  //     url: '/coworking-brand/indiqube'
  //   },
  //   {
  //     id: 7,
  //     name: 'Bhive',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/757d099b5bf39eeab60401f5a76f8d3c34f875aa.jpg',
  //     url: '/coworking-brand/bhive'
  //   },
  //   {
  //     id: 8,
  //     name: 'Workafella',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a0de5565f99b5b6cc0909443a963e6162e1226e8.png',
  //     url: '/coworking-brand/workafella'
  //   },
  //   {
  //     id: 9,
  //     name: 'Cowrks',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/1c817977a6cc1b587a0cb4c3aceef963659ca54c.png',
  //     url: '/coworking-brand/cowrks'
  //   },
  //   {
  //     id: 10,
  //     name: 'Novel Office',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/17c7313cd4eac9c323b413f6f6918eb58eb01507.png',
  //     url: '/coworking-brand/novel-office'
  //   },
  //   {
  //     id: 11,
  //     name: 'ABL Workspaces',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/996d19ea09814787b2263c67521b0047d1dbebcb.png',
  //     url: '/coworking-brand/abl-workspaces'
  //   },
  //   {
  //     id: 12,
  //     name: 'India Accelerator',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ee709e6a028b1804204c9ec616cfe270f9c7e257.png',
  //     url: '/coworking-brand/india-accelerator'
  //   },
  //   {
  //     id: 13,
  //     name: 'Devx',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2350a350aef6b971db916933d8a54066bbce64de.png',
  //     url: '/coworking-brand/devx'
  //   },
  //   {
  //     id: 14,
  //     name: 'Incuspaze',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e88a6f7c64cd3c0d42d82b788358a53f3654ff6a.png',
  //     url: '/coworking-brand/incuspaze'
  //   },
  //   {
  //     id: 15,
  //     name: 'The Executive Center',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4b40bb7e36e8050df729e15bd19011a5fe763f50.png',
  //     url: '/coworking-brand/the-executive-center'
  //   },
  //   {
  //     id: 16,
  //     name: 'Quest Coworks',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/410266f70fa59ee74956783e045ae6af1570f1e2.png',
  //     url: '/coworking-brand/quest-coworks'
  //   },
  //   {
  //     id: 17,
  //     name: 'Executive Spaces',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a3f5442c8c5554c172c63e16884cb4cd28640443.png',
  //     url: '/coworking-brand/executive-spaces'
  //   },
  //   {
  //     id: 18,
  //     name: 'Urban Vault',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f7615b8f52e9271ef61f7838cb00be8846bd2869.png',
  //     url: '/coworking-brand/urban-vault'
  //   },
  //   {
  //     id: 19,
  //     name: 'vatika business centre',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3aaca250b7b7f016eba8880b632250648337873a.png',
  //     url: '/coworking-brand/vatika-business-centre'
  //   },
  //   {
  //     id: 20,
  //     name: 'Altf',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/eacb58c29322fa81ce2b6cae4fe680c257bce084.png',
  //     url: '/coworking-brand/altf'
  //   },
  //   {
  //     id: 21,
  //     name: 'Isprout',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b6d1dbcd16ac61de0f3e71d9df46d6daed4905c3.png',
  //     url: '/coworking-brand/isprout'
  //   },
  //   {
  //     id: 22,
  //     name: 'Ikeva',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f9dcb6d16660411670f9048426794e2be61c2218.png',
  //     url: '/coworking-brand/ikeva'
  //   },
  //   {
  //     id: 23,
  //     name: 'unispace',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/407e83f08d87aa32d762defeea366460024945ea.png',
  //     url: '/coworking-brand/unispace'
  //   },
  //   {
  //     id: 24,
  //     name: 'Incubex',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5d06396c7e271d690e02ece716dde6cc14ac8fa3.png',
  //     url: '/coworking-brand/Incubex'
  //   },
  //   {
  //     id: 25,
  //     name: 'attic',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c67f70112db0ce8004f0e0e4ec66a6a5d77aa75e.png',
  //     url: '/coworking-brand/attic'
  //   },
  //   {
  //     id: 26,
  //     name: 'red brick',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/757e7d251801537479b8144c41715193deac40d2.png',
  //     url: '/coworking-brand/red-brick'
  //   },
  //   {
  //     id: 27,
  //     name: 'Co-offiz',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/161f49b52c978c0e6d7c6c9bc2f0f5f661d7e794.png',
  //     url: '/coworking-brand/co-offiz'
  //   },
  //   {
  //     id: 28,
  //     name: '2gethr',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/7045d35ffebd6406d0e06435a20170632720a3f5.png',
  //     url: '/coworking-brand/2gethr'
  //   },
  //   {
  //     id: 29,
  //     name: 'cokarma',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2de3b67fe56a2a3f27e87a15e8274e9879ba28be.png',
  //     url: '/coworking-brand/cokarma'
  //   },
  //   {
  //     id: 30,
  //     name: 'hustlehub',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/19b2988e22dde888bceff0dfe01de7396ac0a4e4.png',
  //     url: '/coworking-brand/hustlehub'
  //   },
  //   {
  //     id: 31,
  //     name: 'regus',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/110cef286adc7438c01bc32985895c41a574d31a.png',
  //     url: '/coworking-brand/regus'
  //   },
  //   {
  //     id: 32,
  //     name: 'corporatedge',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/31d9047c3912ba7b69083657ee422a9cb9630375.png',
  //     url: '/coworking-brand/corporatedge'
  //   },
  //   {
  //     id: 33,
  //     name: 'supremework',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5cad925c923c3f370452fbfe03d2239f312687d3.png',
  //     url: '/coworking-brand/supremework'
  //   },
  //   {
  //     id: 34,
  //     name: 'reoffice',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3945c4d9eea68275153e1ccfa80a431b93c32f56.png',
  //     url: '/coworking-brand/reoffice'
  //   },
  //   {
  //     id: 35,
  //     name: 'smartworks',
  //     image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/73c2d9f1d6ce9c0128b6cbc6529891fa9b8937a1.png',
  //     url: '/coworking-brand/smartworks'
  //   },
  // ]

  goToPrev() {
    this.popularSpaceCarousel.moveTo(this.active - 1);
  }

  goToNext() {
    this.popularSpaceCarousel.moveTo(this.active + 1);
  }

  onSliderMove(slideData: NguCarouselStore) {
    this.active = slideData.currentSlide;
  }

  constructor(private router: Router) { }

  ngOnInit() {
    this.loading = true;
  }

  goToBrandPage(brand: Brand, isColiving = false) {
    if (isColiving) {
      this.router.navigate([`/co-living-brand/${brand.slug}`]);
      return;
    }
    this.router.navigate([`/coworking-brand/${brand.slug}`]);
  }
}
