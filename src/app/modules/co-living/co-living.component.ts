import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AVAILABLE_CITY_CO_LIVING } from '@app/core/config/cities';
import { Brand } from '@app/core/models/brand.model';
import { City } from '@app/core/models/city.model';
import { BrandService } from '@app/core/services/brand.service';
import { sanitizeParams } from '@app/shared/utils';
import { SeoSocialShareData } from '@core/models/seo.model';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';
import { CoLivingService } from './co-living.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-co-living',
  templateUrl: './co-living.component.html',
  styleUrls: ['./co-living.component.scss', '../virtual-office/virtual-office.component.scss'],
})
export class CoLivingComponent implements OnInit {
  seoData: SeoSocialShareData;
  loading: boolean;
  coLivingBrands: Brand[] = [];
  cities: City[];
  gurugramSpaces: any = [];
  bangloreSpaces: any = [];
  hyderabadSpaces: any = [];
  puneSpaces: any = [];
  mumbaiSpaces: any = [];
  noidaSpaces: any = [];
  delhiSpaces: any = [];
  ahmedaSpaces: any = [];
  chennaiSpaces: any = [];
  indoreSpaces: any = [];
  service = [
    {
      title: 'Fully Furnished',
      description:
        'Live in a fully furnished space and unlock the benefits such as community, comfort and cost-saving.',
      icon: 'amenities/fully-furnished.svg',
    },
    {
      title: 'No Extra Bills',
      description: 'No need to give extra bills. Just book your desired space, live with freedom and enjoy the ride.',
      icon: 'amenities/no-booking-fee.svg',
    },
    {
      title: 'Flexible Lease',
      description:
        'There is a presence of flexible lease terms and countless amenities. No need to worry just live with glory.',
      icon: 'amenities/security.svg',
    },
    {
      title: 'Regular Cleaning',
      description:
        'We aim to provide the best experience, Thus regular cleaning activities are taken care of on a priority basis.',
      icon: 'amenities/housekeeping.svg',
    },
    {
      title: 'Professional Host',
      description:
        'Community managers are always available for you to help out with any problems. So, now say goodbye to live-in landlords.',
      icon: 'workspace/day-pass.svg',
    },
    {
      title: 'Amazing Community',
      description:
        'We make sure you interact with wonderful people and build an amazing community. Live & enjoy your living journey with us.',
      icon: 'amenities/meeting-room.svg',
    },
  ];

  spaceForMobile = {
    coupleLiving: [
      {
        name: 'Cofynd CoLo Sector 15',
        address: 'Sector 15, Gurgaon',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8bca176f399f5a9323ba86cd37a0466e81e74b49.jpg',
        slug: 'flock-sector-15',
        starting: '35,000',
      },
      {
        name: 'Tribe Luxury Hostel Wakad',
        address: 'ACE Almighty, Wakad, Pune',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/45918405275ee64628bfd50fc2b2301a8aa8b00e.jpg',
        slug: 'tribe-stays-wakad',
        starting: '18,900',
      },
      {
        name: 'HelloWorld Indiranagar',
        address: 'Rustam Bagh Layout, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/09ce628bf82a057f736dc279c5de15adc6b2d62e.jpg',
        slug: 'helloworld-indiranagar12-indiranagar',
        starting: '11,000',
      },
      {
        name: 'HelloWorld Arzoo',
        address: 'Silicon Valley, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4d144878cb616003b57b3a39977a758138bfc815.jpg',
        slug: 'helloworld-arzoo',
        starting: '30,000',
      },
      {
        name: 'Stanza living Bagan house (Boys)',
        address: 'Kukatpally, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e1bd3eaa58ff9ce063558a7847f30c80de48f480.jpg',
        slug: 'stanza-bagan-house',
        starting: '8,500',
      },
      {
        name: 'LOCL Colive',
        address: 'Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2825fcc97e1fe0b7acbcebca91d15f00e18ed462.jpg',
        slug: 'locl-colive-work-bellandur',
        starting: '10,000',
      },
      {
        name: 'Flock Oasis',
        address: 'sector 40, Gurgaon',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/fd5e768777fe110a8dcd50aa9b2b4e78a5b9f1dc.jpg',
        slug: 'flock-oasis',
        starting: '7,500',
      },
      {
        name: 'CoHo Villa',
        address: 'Sector 45, Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/29ba99482ce477147cbea56384075f8fa0b0a4c7.jpg',
        slug: 'coho-villa-huda-city-center',
        starting: '6,999',
      },
      {
        name: 'Isthara CMC',
        address: 'Sector 24, Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4a9b011eb57819ad574d9a3ea2d9e89d0324d018.jpg',
        slug: 'isthara-cmc-residnecy',
        starting: '9,000',
      },
      {
        name: '89 XQUISIT',
        address: 'New BEL Road Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a1045178796f04649997581cddec72f22246b544.jpg',
        slug: '89-xquisit',
        starting: '11,000',
      },
      {
        name: 'Zuhause living',
        address: 'Sushant Lok Phase I',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/df185723a3b4e0ddedf1dbc2d2f7425446badbbe.jpg',
        slug: 'zuhause-living',
        starting: '18,000',
      },
    ],

    flock: [
      {
        name: 'Cofynd CoLo Sector 15',
        address: 'Sector 15, Gurgaon',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8bca176f399f5a9323ba86cd37a0466e81e74b49.jpg',
        slug: 'flock-sector-15',
        starting: '35,000',
      },
      {
        name: 'Cofynd CoLo Golf Course Road',
        address: 'Saraswati Kunj,Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/45ec6210d34ffa436031498c7cb12f851add3bd0.jpg',
        slug: 'coho-golf-course-road',
        starting: '12,000',
      },
      {
        name: 'Cofynd CoLo Athena',
        address: 'Ardee City, Gurgaon',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/afbb6a7f4981513bc884e7103ebe0c7d5c12b4e7.jpg',
        slug: 'flock-athena',
        starting: '8,000',
      },
      {
        name: 'Cofynd CoLo Artemis',
        address: 'Sector-52, Gurgaon',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b2e83b4af73867e0cf7be46b0c7e6ea074674640.jpg',
        slug: 'flock-artimes',
        starting: '8,000',
      },
      {
        name: 'Cofynd CoLo Oasis',
        address: 'Sector 40, Gurgaon',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ae636374fbff5e01efcb978b101a884b39e8ff8f.jpg',
        slug: 'flock-oasis',
        starting: '12,000',
      },
      {
        name: 'Cofynd CoLo Sector 45',
        address: 'Sector 45, Gurgaon',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b173b29aff94d8f8acc7b13b629e5551418e4be6.jpg',
        slug: 'flock-sector-45',
        starting: '12,000',
      },
      {
        name: 'Cofynd CoLo DLF Phase-1',
        address: 'DLF Phase 1, Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/cfa26aaf160d38fcb3cb2b39cd2bae6dcf18659c.jpg',
        slug: 'flock-dlf-phase-1',
        starting: '40,000',
      },
      {
        name: 'Cofynd CoLo Sector 17',
        address: 'Sector - 17 Gurgaon',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/10e877d9651ee1b2c6207be9d6541fa2355f939c.jpg',
        slug: 'flock-sector-17',
        starting: '14,000',
      },
    ],

    stanza: [
      {
        name: 'Stanza Living Frankfurt House',
        address: 'Koramangala, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/59468deea7257aa4ad63055bc5d4642d9f21f45a.jpg',
        slug: 'stanza-living-frankfurt-house-koramangala',
        starting: '19,000',
      },
      {
        name: 'Stanza Living | Lisbon House',
        address: 'Electronics City Phase 1, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5e2b8105ab7b932da2bb26145c2bb4548066b647.jpg',
        slug: 'stanza-living-lisbon-house',
        starting: '9,650',
      },
      {
        name: 'Stanza Living Swansea House',
        address: 'Electronic City Phase II, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3c09eeab1011786f9d97829d296b563ed3ac2719.jpg',
        slug: 'stanza-living-swansea-house',
        starting: '7,899',
      },
      {
        name: 'Stanza Living | Regina House',
        address: 'Regina House, Taluk, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/de3d9117e326e1b0077f06647edce998bd152d30.jpg',
        slug: 'stanza-living-regina-house',
        starting: '8,300',
      },
      {
        name: 'Stanza Living | Sao Paulo House',
        address: 'Whitefield, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c9743e2fd9be657c2cf5d0799eaffc072992155b.jpg',
        slug: 'stanza-living-sao-paulo-house',
        starting: '11,499',
      },
      {
        name: 'Stanza Living Amsterdam House',
        address: 'Electronics City Phase 1, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ba6ee5eb41da7cf321e488b60deade08918964e7.jpg',
        slug: 'stanza-living-amsterdam-house',
        starting: '10,337',
      },
      {
        name: 'Stanza Living | Lucena House',
        address: 'Electronic City, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/92aaf66833050a94b35be88e9e865fc946d6d322.jpg',
        slug: 'stanza-living-lucena-house',
        starting: '8,500',
      },
    ],

    HelloWorld: [
      {
        name: 'HelloWorld AECS',
        address: 'Marathahalli, Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e81a0858bf4f4b5f8ccfaf0f72bc3e30d9410d6d.jpg',
        slug: 'helloworld-aecs',
        starting: '14,500',
      },
      {
        name: 'HelloWorld HappySuites',
        address: 'Arekere, Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/24b6bd735faeeb615b4e8e216bb5166e1ec720fe.jpg',
        slug: 'helloworld-happysuites',
        starting: '12,000',
      },
      {
        name: 'HelloWorld CornerHouse',
        address: 'Sector 2, HSR Layout, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/74254296180ad812a0952dfe42dfb8074bdf2a3a.jpg',
        slug: 'helloworld-cornerhouse',
        starting: '30,000',
      },
      {
        name: 'HelloWorld HopeValley',
        address: 'BTM Layout, Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4803dfd6de48e9f7b492bdc5183a5bacd4401f9f.jpg',
        slug: 'helloworld-hopevalley',
        starting: '11,000',
      },
      {
        name: 'HelloWorld Infinity',
        address: 'Electronic City, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/00fd0c0df74c9294496b4ea1287ebc1a2386e6d3.jpg',
        slug: 'helloworld-infinity',
        starting: '6,000',
      },
      {
        name: 'HelloWorld Daffodil',
        address: 'HSR Layout, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/62f0bf77cdefa1c80b544fd319fe8d184c2c8d86.jpg',
        slug: 'helloworld-daffodil',
        starting: '13,000',
      },
      {
        name: 'HelloWorld 19thMain',
        address: 'HSR Layout, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/17b90224d730fe252a75b4e466dc8a96b98f9780.jpg',
        slug: 'helloworld-19thmain',
        starting: '14,000',
      },

      {
        name: 'HelloWorld Nagavara',
        address: 'Nagavara, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/73e56740834cb533efe8bcb830c9d056f211cd4d.jpg',
        slug: 'helloworld-nagavara',
        starting: '20,000',
      },

      {
        name: 'HelloWorld HRBR',
        address: 'HBR layout, Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/48aa12b82d638769433b03085e2f274c3a36aa70.jpg',
        slug: 'helloworld-hrbr',
        starting: '11,000',
      },

      {
        name: 'HelloWorld Forum',
        address: 'Tavarekere, Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/05e6e0b60b5bab32fa2e832f832bef183123a3c3.jpg',
        slug: 'helloworld-forum',
        starting: '8,000',
      },
      {
        name: 'HelloWorld Sarjapur',
        address: 'Sarjapur Road, Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/98c03a77d19ec72e6730009fe8cd76ec41671795.jpg',
        slug: 'helloworld-sarjapur',
        starting: '8,000',
      },
      {
        name: 'HelloWorld ECC',
        address: 'Whitefield, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ef68d91cc30f5c4ec2da0ea9538549fdaf3a63d1.jpg',
        slug: 'helloworld-ecc',
        starting: '6,000',
      },
    ],

    Orion: [
      {
        name: 'Orion Ursa(Girls)',
        address: 'Kamla Nagar, Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e7dea56604675f8543e73d6fc43df6036c6dde2c.jpg',
        slug: 'orion-ursa-kamla-nagar',
        starting: '19,500',
      },
      {
        name: 'Orion Pheonix(Girls)',
        address: 'Roop Nagar, Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/df540c124966697d23b285a9f7dd7072ffb773b5.jpg',
        slug: 'orion-pheonix-roop-nagar',
        starting: '21,000',
      },
      {
        name: 'Orion Pegasus(Girls)',
        address: 'North Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/19c35634978281917dd2263fa11f82e958af60d4.jpg',
        slug: 'orion-pegasus-hudson-lane',
        starting: '17,500',
      },
      {
        name: 'Orion Scorpius (Boys)',
        address: 'Vijay Nagar, Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/d17f3cd86f62c34f8581fcc5ba8172219875fdbb.jpg',
        slug: 'orion-scorpius-vijay-nagar',
        starting: '22,000',
      },
      {
        name: 'Orio Living - Liberty House Premium Boys Pg',
        address: 'S.G. Palya, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/dbc3181eb622e38b771984f5441297ca38aab2d2.jpg',
        slug: 'orio-living-liberty-house-boys',
        starting: '7,500',
      },
    ],
  };

  popularCoLivingSpaces = [
    {
      name: 'Hyphen Ombre',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4c5e631024ca5353b29131e8b729c85ce7ce7b36.jpg',
      address: 'HSR Layout, Bangalore',
      slug: 'hyphen-ombre',
    },
    {
      name: 'Cofynd CoLo Oasis',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ae636374fbff5e01efcb978b101a884b39e8ff8f.jpg',
      address: 'Sector 40, Gurugram',
      slug: 'flock-oasis',
    },
    {
      name: 'HelloWorld Siri',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3cf39ce402e67c8fad130db6b0dae64915e20cd2.jpg',
      address: 'B-56, Sector 22, Noida',
      slug: 'helloworld-siri',
    },
    {
      name: 'Orion Ursa(Girls)',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3743430afbdc8daa04378e132689272483e9e539.jpg',
      address: 'Kamla Nagar, Delhi',
      slug: 'orion-ursa-kamla-nagar',
    },
    {
      name: 'Tribe Luxury Hostel Wakad',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4a4ec43ef01491c47a9f3a9c2089605e60413746.jpg',
      address: 'ACE Almighty, Wakad, Pune',
      slug: 'tribe-stays-wakad',
    },
    {
      name: `HelloWorld Harmony`,
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9b5dc544341221b96035907ff7c60710f0c2ba13.jpg',
      address: 'Santacruz East, Mumbai',
      slug: 'helloworld-harmony',
    },
    {
      name: 'HelloWorld Fitoor',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/d73119104d471bba36644fbe8c79f7777b647315.jpg',
      address: 'Indira Nagar, Gachibowli, Hyderabad',
      slug: 'helloworld-fitoor',
    },
  ];
  city = [
    {
      name: 'gurugram',
      img: 'gurgaon-ofcc.jpg',
      title: 'A Millennium City',
      seat: '201',
    },
    {
      name: 'bangalore',
      img: 'bangalore-ofcc.jpg',
      title: "India's Silicon Valley",
      seat: '305',
    },
    {
      name: 'delhi',
      img: 'delhi.jpg',
      title: 'The Nation Capital',
      seat: '197',
    },
    {
      name: 'noida',
      img: 'wtc.jpg',
      title: 'The Hitech City',
      seat: '219',
    },
    {
      name: 'hyderabad',
      img: 'hyderbad.jpg',
      title: 'The City of Pearls',
      seat: '237',
    },
    {
      name: 'mumbai',
      img: 'mumbai2.jpg',
      title: 'City of Dreams',
      seat: '225',
    },
    {
      name: 'pune',
      img: 'pune.jpg',
      title: 'Queen of Deccan',
      seat: '135',
    },
    {
      name: 'indore',
      img: 'indore.jpg',
      title: 'The Cleanest City',
      seat: '126',
    },
    {
      name: 'ahmedabad',
      img: 'ahemdabad.jpg',
      title: 'Manchester of India',
      seat: '95',
    },
    {
      name: 'kolkata',
      img: 'kolkata.jpg',
      title: 'City of Joy',
      seat: '69',
    },
  ];

  coFyndAdvantages = [
    {
      icon: 'home/work-spaces.svg',
      title: '100,000+ Spaces',
      description:
        'Get access to 100,000+ spaces with easy availability and convenience anytime and anywhere. Space Search Made Simple with CoFynd',
    },
    {
      icon: 'icons/brokerage-icon.svg',
      title: 'Zero Brokerage',
      description:
        'CoFynd is India’s fastest growing space discovery platform that doesn’t charge any brokerage from the customers.',
    },
    {
      icon: 'home/support.svg',
      title: '100% Offline Support',
      description:
        'We provide you 100% offline support from giving you the various space options, scheduling the site visit, booking the space to the after-sales support also.',
    },
  ];

  constructor(
    private brandService: BrandService,
    private coLivingService: CoLivingService,
    private seoService: SeoService,
    private router: Router,
  ) {
    this.cities = AVAILABLE_CITY_CO_LIVING.filter(city => city.for_coLiving === true);
  }

  ngOnInit() {
    this.addSeoTags();
    this.getBrands();
    let gurugramQueryParams = {
      limit: 8,
      city: '5e3eb83c18c88277e81427d9',
    };
    let bangaloreQueryParams = {
      limit: 8,
      city: '5f2a4210ecdb5a5d67f0bbbc',
    };
    let hyderabadQueryParams = {
      limit: 8,
      city: '5f338a5f59d5584617676837',
    };
    let puneQueryParams = {
      limit: 8,
      city: '5e3eb83c18c88277e8142795',
    };
    let mumbaiQueryParams = {
      limit: 8,
      city: '5f5b1f728bbbb85328976417',
    };
    let noidaQueryParams = {
      limit: 8,
      city: '5e3e77de936bc06de1f9a5e2',
    };
    let delhiQueryParams = {
      limit: 8,
      city: '5e3e77c6936bc06de1f9a2d9',
    };
    let ahmedabadQueryParams = {
      limit: 8,
      city: '5f7af1c48c4e6961990e620e',
    };
    let chennaiQueryParams = {
      limit: 8,
      city: '5f7410348c4e6961990e5a21',
    };
    let indoreQueryParams = {
      limit: 8,
      city: '5f60926926e9e64d7b61b41b',
    };
    const observables = [
      this.coLivingService.getCoLivings(sanitizeParams(gurugramQueryParams)),
      this.coLivingService.getCoLivings(sanitizeParams(bangaloreQueryParams)),
      this.coLivingService.getCoLivings(sanitizeParams(hyderabadQueryParams)),
      this.coLivingService.getCoLivings(sanitizeParams(puneQueryParams)),
      this.coLivingService.getCoLivings(sanitizeParams(mumbaiQueryParams)),
      this.coLivingService.getCoLivings(sanitizeParams(noidaQueryParams)),
      this.coLivingService.getCoLivings(sanitizeParams(delhiQueryParams)),
      this.coLivingService.getCoLivings(sanitizeParams(ahmedabadQueryParams)),
      this.coLivingService.getCoLivings(sanitizeParams(chennaiQueryParams)),
      this.coLivingService.getCoLivings(sanitizeParams(indoreQueryParams)),
    ];
    forkJoin(observables).subscribe((res: any) => {
      let gurugramData = res[0].data;
      let bangloreData = res[1].data;
      let hyderData = res[2].data;
      let puneData = res[3].data;
      let mumData = res[4].data;
      let noidaData = res[5].data;
      let delhiData = res[6].data;
      let ahmedaData = res[7].data;
      let chennaiData = res[8].data;
      let indoreData = res[9].data;
      this.gurugramSpaces = this.formatSpaces(gurugramData);
      this.bangloreSpaces = this.formatSpaces(bangloreData);
      this.hyderabadSpaces = this.formatSpaces(hyderData);
      this.puneSpaces = this.formatSpaces(puneData);
      this.mumbaiSpaces = this.formatSpaces(mumData);
      this.noidaSpaces = this.formatSpaces(noidaData);
      this.delhiSpaces = this.formatSpaces(delhiData);
      this.ahmedaSpaces = this.formatSpaces(ahmedaData);
      this.chennaiSpaces = this.formatSpaces(chennaiData);
      this.indoreSpaces = this.formatSpaces(indoreData);
    });
  }

  formatSpaces(data) {
    let formattedData = [];
    for (let index = 0; index < data.length; index++) {
      let obj = {
        name: `${data[index].name}`,
        address: data[index].location.address,
        image: data[index]['images'][0]['image']['s3_link'],
        slug: data[index]['slug'],
        starting: data[index]['starting_price'],
      };
      formattedData.push(obj);
    }
    return formattedData;
  }

  getBrands() {
    this.brandService.getBrands(sanitizeParams({ type: 'coliving' })).subscribe(res => {
      this.coLivingBrands = res;
    });
  }

  openWorkSpace(slug: string) {
    this.router.navigate([`/co-living/${slug.toLowerCase().trim()}`]);
  }
  goToBrand() {
    this.router.navigate([`/brand/co-living/flock`]);
  }
  addSeoTags() {
    this.loading = true;
    this.seoService.getMeta('co-living').subscribe(seoMeta => {
      if (seoMeta) {
        this.seoData = {
          title: seoMeta.title,
          image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
          description: seoMeta.description,
          url: environment.appUrl + this.router.url,
          type: 'website',
          footer_title: seoMeta.footer_title,
          footer_description: seoMeta.footer_description,
        };
        this.seoService.setData(this.seoData);
      }
      this.loading = false;
    });
  }

  openCityListing(city: any) {
    this.router.navigate([`co-living/${city.name.toLowerCase().trim()}`]);
  }

  goToBrandPage(brand: Brand, isColiving = false) {
    if (isColiving) {
      this.router.navigate([`/brand/co-living/${brand.slug}`]);
      return;
    }
    this.router.navigate([`/brand/${brand.slug}`]);
  }
}
