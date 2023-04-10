import { Input } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { NguCarousel, NguCarouselConfig, NguCarouselStore } from '@ngu/carousel';

interface OurClient {
  name: string;
  address: string;
  image: string;
  id: string;
  slug?: string;
}

@Component({
  selector: 'app-our-clients',
  templateUrl: './our-clients.component.html',
  styleUrls: ['./our-clients.component.scss']
})
export class OurClientsComponent implements OnInit {

  @Input() layout: 'white';
  @ViewChild('popularSpaceCarousel', { static: false })
  popularSpaceCarousel: NguCarousel<OurClient>;
  active = 0;
  carouselConfig: NguCarouselConfig = {
    grid: { xs: 3.5, sm: 5, md: 4.5, lg: 6.5, all: 0 },
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

  clients = [
    {
      id: 1,
      name: 'Kotak',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c95b92cde2f2df7f82f31aee85f109e817404b4b.png'
    },
    {
      id: 2,
      name: 'Inox',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c9c3df6a15f74fe5310620ccfbaf13226649ba4d.png'
    },
    {
      id: 3,
      name: 'Credable Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/7d9415d0d68cd1656aedd522d4d3bfd72e774b76.png'
    },
    {
      id: 4,
      name: 'Hector Beverages Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/d9e155e232b7314fc6468faba47815a81512c35b.png'
    },
    {
      id: 5,
      name: 'Purpllr Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c85f758097513122d0fb069b87ce9ceb95465dd4.png'
    },
    {
      id: 6,
      name: 'Fyp',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/18239ac46f0095fa3f64ce3f11d84be4708fd8ea.png'
    },
    {
      id: 7,
      name: 'Easebuzz',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/134c977d30c8f1329a95ca71bd6eba6252733852.png'
    },
    {
      id: 8,
      name: 'Zingbus',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2151c641ffa4ec98b086617eef4193881e20834f.png'
    },
    {
      id: 9,
      name: 'Classplus',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a66d2b173c8faa08fd6d4d1ba11890cd2542db24.png'
    },
    {
      id: 10,
      name: 'Acciojob Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/7b9fb349915858efbcdd50fa136eba35b297cda9.png'
    },
    {
      id: 11,
      name: 'Atlas Law Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6129f05c386b12d328a5d3d58e0c036e7e66afd5.png'
    },
    {
      id: 12,
      name: 'Bluone Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c81ea45f61705da2cc8f8ab5f7b83caecdc58aa1.png'
    },
    {
      id: 13,
      name: 'Bricz Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5741d86b37405d2e37281345a4dd90ed098cd4ba.png'
    },
    {
      id: 14,
      name: 'Dahua Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/7dba2fe956ff2e98e4029333c02324ab199b6915.png'
    },
    {
      id: 15,
      name: 'Devtown Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/69a26c306d1af10947a2bc2bd7f8be1994625d81.png'
    },
    {
      id: 16,
      name: 'Doubtnut Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e650bcfa5444037833dd7f835bfb9447b981a2b2.png'
    },
    {
      id: 17,
      name: 'Flash Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/daca10ffa403e80f29ac51d368beefb021376dc0.png'
    },
    {
      id: 18,
      name: 'Genesys Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/68db0982e98f5a23ec87ef494df1ae3899bf533e.png'
    },
    {
      id: 19,
      name: 'India Leaders for Social Sector Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/1bd8c3d5cb135908007579be26fa28082ea74a81.png'
    },
    {
      id: 20,
      name: 'MNC Corporation Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b2617d1216ab67f66344ba747bfac9c06b80dc7b.png'
    },
    {
      id: 21,
      name: 'NS Partners Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2b66bf4c7b44471e18ed1eb8ace551cf9962abe2.png'
    },
    {
      id: 22,
      name: 'Talentshell Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4f82875699784445c0d314f1835477470d685d2c.png'
    },
    {
      id: 23,
      name: 'The Connections Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/370fcfcd6e7869fab85688842554962bc2c8b784.png'
    },
    {
      id: 24,
      name: 'Wakeup Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c6c5c7d73cab43066fa9d4dbce347c1a741e5536.png'
    },
    {
      id: 25,
      name: 'Zipcar Logo',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/0c9020becefb9fe1ec9ce5000993ff0ca4e3ea53.png'
    },
  ]
  constructor() { }

  ngOnInit() {
  }

  goToPrev() {
    this.popularSpaceCarousel.moveTo(this.active - 1);
  }

  goToNext() {
    this.popularSpaceCarousel.moveTo(this.active + 1);
  }

  onSliderMove(slideData: NguCarouselStore) {
    this.active = slideData.currentSlide;
  }

}
