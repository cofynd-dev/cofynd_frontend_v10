import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AVAILABLE_CITY, AVAILABLE_CITY_CO_LIVING } from '@app/core/config/cities';
import { Brand } from '@app/core/models/brand.model';
import { City } from '@app/core/models/city.model';
import { BrandService } from '@app/core/services/brand.service';
import { sanitizeParams } from '@app/shared/utils';
import { SeoSocialShareData } from '@core/models/seo.model';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';

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
    bangalore: [
      {
        name: 'Hyphen Ombre',
        address: 'HSR Layout, Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/1e2c5dcb345d741cc9f3257f254cad29953b14a6.jpg',
        slug: 'hyphen-ombre',
        starting: '18,000',
      },
      {
        name: 'Stanza Living Frankfurt House',
        address: 'Koramangala, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5ed87248ca6e5fd8b0f580efd9ce5a2e8aa05dca.jpg',
        slug: 'stanza-living-frankfurt-house-koramangala',
        starting: '19,000',
      },
      {
        name: 'HelloWorld Daffodil',
        address: 'HSR Layout, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/0803c3a64e46b1bc08a5c11db53cf6455f886f44.jpg',
        slug: 'helloworld-daffodil',
        starting: '13,000',
      },
      {
        name: 'LOCL Co-live & Work',
        address: 'Koramangala, Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/db6e3e73ba5e048f6294048a59cee862e3630fcb.jpg',
        slug: 'locl-colive-work-koramangala',
        starting: '10,000',
      },
      {
        name: '89 XQUISIT',
        address: 'New BEL Road',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a1045178796f04649997581cddec72f22246b544.jpg',
        slug: '89-xquisit',
        starting: '11,000',
      },
      {
        name: 'Hood Coliving Daffodils',
        address: 'Electronic city phase 1',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5dfb93bd9bf062aba00254076646f799a4e0acca.jpg',
        slug: 'hood-living',
        starting: '8,500',
      },
      {
        name: 'HelloWorld BrookeField',
        address: 'Marathahalli, Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/087cdec73044c1451ec8137e29a947ddcd45b6d9.jpg',
        slug: 'helloworld-brookefield',
        starting: '12,000',
      },
      {
        name: 'Stanza Living | Regina House',
        address: 'Regina House, Taluk, Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/de3d9117e326e1b0077f06647edce998bd152d30.jpg',
        slug: 'stanza-living-regina-house',
        starting: '8,300',
      },
    ],

    gurugram: [
      {
        name: 'Flock Oasis',
        address: 'sector 40, Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/fd5e768777fe110a8dcd50aa9b2b4e78a5b9f1dc.jpg',
        slug: 'flock-oasis',
        starting: '7,500',
      },
      {
        name: 'Zuhause living',
        address: 'Sushant Lok Phase I',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/df185723a3b4e0ddedf1dbc2d2f7425446badbbe.jpg',
        slug: 'zuhause-living',
        starting: '18,000',
      },
      {
        name: 'HelloWorld Ross',
        address: 'Sector 25, Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3044fae9f1c844bbda0e9cfd27be7622496b0aa3.jpg',
        slug: 'helloworld-ross',
        starting: '11,000',
      },
      {
        name: 'Coho Sector 55',
        address: 'Sector 55, Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e3524f7f3bba5391affec1d9153617552603b91c.jpg',
        slug: 'coho-sector-55',
        starting: '7,000',
      },
      {
        name: 'Station 2024 (Male)',
        address: 'Sector 43',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/808d98838481f06ee827241fd1cc1a4e4d788f77.jpg',
        slug: 'station-2024',
        starting: '8,500',
      },
      {
        name: 'Livstations (Male)',
        address: 'Sector 33, Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/24f6159970416f9b42f54aa8a4a9e87f78178754.jpg',
        slug: 'station1402',
        starting: '13,000',
      },
      {
        name: 'iLive CoLiving',
        address: 'Sector 22, Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ebc31861580582a8a531d41a1f8a909dfb0d2ad3.jpg',
        slug: 'ilive',
        starting: '4,500',
      },
      {
        name: 'Isthara Amyra Residency',
        address: 'Sector-48, Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a1d7f7719800dff5ca15ba09cd801b2a87f427cc.jpg',
        slug: 'isthara-amirya-residency',
        starting: '9,000',
      },
    ],

    delhi: [
      {
        name: 'Uniliv OAK',
        address: 'Saket, Delhi ',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/95d73e38087367e49718252a20136af73bbd8990.jpg',
        slug: 'uniliv-oak-saket',
        starting: '20,000',
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
        name: 'HelloWorld Beckham',
        address: 'New Friends Colony, Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/deaf7dd61f66cf016d9556c708394dc743bb3483.jpg',
        slug: 'helloworld-beckham',
        starting: '11,000',
      },
      {
        name: 'Urban Storey Lighthouse (Girls)',
        address: 'Gautam Nagar, Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c834d216d1b441fa6227c87118801d7b6450599d.jpg',
        slug: 'urban-storey-lighthouse',
        starting: '8,000',
      },
      {
        name: 'Your Space Pearl NFC',
        address: 'New Friends Colony, New Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3b821ecf183263b44e6a4f8fdff714bd70a18e3e.jpg',
        slug: 'your-space-pearl-nfc',
        starting: '18,000',
      },
      {
        name: 'RSB Homes',
        address: 'Greater Kailash',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f30956988c88de79ce69b3af0c6db9388e4bec19.jpg',
        slug: 'rsb-homes',
        starting: '13,000',
      },
      {
        name: 'MuLive mayfair',
        address: 'Dwarka',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/73aa30bbe98e2e44f0ec34cb301522c4bb315cf9.jpg',
        slug: 'mulive-dwarka',
        starting: '10,500',
      },
      {
        name: 'CHILLAR PG',
        address: 'Tata Telco',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6e985d7ed0a199d4c7d6f08e3562c2329365c403.jpg',
        slug: 'chillar',
        starting: '4,500',
      },
      {
        name: 'Eden by Hive',
        address: 'Satya Niketan',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/7581e534aa387946b00f94209430c4d93967dc4f.jpg',
        slug: 'eden-by-hive',
        starting: '13,000',
      },
      {
        name: 'Pearl Premium Luxury',
        address: 'Shakti Nagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b44f4be225920166b7ddb350d5378d244fcb0f4e.jpg',
        slug: 'pearl-preimum-luxury-homes',
        starting: '17,000',
      },
      {
        name: 'Ashray Living',
        address: 'Kamla Nagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/116b63bbbabbf2f001b90c4952280e4e73b26ada.jpg',
        slug: 'ashray-living',
        starting: '22,000',
      },
    ],

    noida: [
      {
        name: 'Fortune by Hive',
        address: 'knowledge Park 3',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/52f04f0fb2221afdb8d1b4ae9cc60c8599c5c089.jpg',
        slug: 'fortune-by-hive',
        starting: '11,000',
      },
      {
        name: 'Your Space',
        address: 'RN 21, sector 62',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/663d90e82c8aae5d2f05e5ccfff6902a76e3f4d0.jpg',
        slug: 'yourspace-noida-sector-62-girls',
        starting: '13,500',
      },
      {
        name: 'Nirmal Niwas',
        address: 'Sector 44',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f8744ca4368058fb27c2eb0598b290648aaf7147.jpg',
        slug: 'nirmal-niwas',
        starting: '4,000',
      },
      {
        name: 'Your Space',
        address: 'Sector 62',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/1f5e2a159c79f8f34ccf7cae77281b6978d353c8.jpg',
        slug: 'your-space-noida-rn731-sector-62',
        starting: '15,000',
      },
      {
        name: 'Orchid by Hive',
        address: 'sector 126',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/26c4d9edb0e83e1efe6ec832b6d1f140cf40f1c7.jpg',
        slug: 'orchid-by-hive',
        starting: '11,000',
      },
      {
        name: 'Your Space',
        address: 'Industrial Area',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/1ffd82b51d95774f1fdf5d88dfeab95ac78e74c7.jpg',
        slug: 'your-space-rn72-noida-boys12-sector-62',
        starting: '15,000',
      },
      {
        name: 'Your Space',
        address: 'Knowledge Park III',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3a17ec43f761d0acf6a714034795a0a96558ae8a.jpg',
        slug: 'your-space-greater-noida',
        starting: '11,000',
      },
      {
        name: 'HelloWorld Whitehouse',
        address: 'Sector 61',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/973b5f8c60b045a42be95f3b9f1c672f6c5ab53a.jpg',
        slug: 'helloworld-whitehouse',
        starting: '8,000',
      },
      {
        name: 'HelloWorld ZO',
        address: 'Sector 19',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8b68a8dd43c1c48fc44b8f6d0ef2ed665f43d4c1.jpg',
        slug: 'helloworld-zo',
        starting: '8,000',
      },
      {
        name: 'HelloWorld Pepper',
        address: 'Sector 50',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/031116bd188a62840941c7fe30b260995227e510.jpg',
        slug: 'helloworld-pepper-female12-sector-50',
        starting: '9,000',
      },
    ],

    pune: [
      {
        name: 'Tribe Luxury Hostel Viman Nagar',
        address: 'Mascot Centre, Pune',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c350244eaf04f8203eade19eb047d5066827ca83.jpg',
        slug: 'tribe-stays-viman-nagar',
        starting: '30,000',
      },
      {
        name: 'THE IVY LEAGUE HOUSE',
        address: 'Wakad, Pune',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a1898ea4ba525ab2083d5a65fc029c30b4f9b16d.jpg',
        slug: 'locl-the-ivy-league-house',
        starting: '11,000',
      },
      {
        name: 'Stanza Living Kingston House',
        address: 'Wagholi, Pune',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/444f50057bfcbb950f760d3b8d5f03e9eec1c93c.jpg',
        slug: 'stanza-living-kingston-house-wagholi',
        starting: '7,500',
      },
      {
        name: 'ReForbs Nirvana',
        address: 'Viman Nagar, Pune',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f120b28f052b14f04b226ad048052aa92dcc14d6.jpg',
        slug: 'reforbs-nirvana-viman-nagar',
        starting: '17,500',
      },
      {
        name: 'HelloWorld Elegant',
        address: 'Manjri Bk, Pune',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/fece7383bd2bae2fb28b50bdf529aaa62e813287.jpg',
        slug: 'helloworld-elegant',
        starting: '8,500',
      },
      // {
      //   name: 'Housr Phoenix',
      //   address: 'Balewadi, Pune',
      //   image:
      //     'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2e428fd924ec3be030cf108b2fd0f3300b93335a.jpg',
      //   slug: 'housr-phoenix-balewadi',
      //   starting: '12,999',
      // },
      // {
      //   name: 'Housr Vision',
      //   address: 'Wakad, Pune',
      //   image:
      //     'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6c50b55e67eedb1c556f5b30987d18ef9bc77b90.jpg',
      //   slug: 'housr-vision',
      //   starting: '11,999',
      // },
      {
        name: 'COLIWO',
        address: 'Mathura Nagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6ddc3e8a94c2168a5c203eb5423c8d206718e68a.jpg',
        slug: 'coliwo',
        starting: '15,000',
      },
      // {
      //   name: 'THE IVY LEAGUE HOUSE',
      //   address: 'Wakad, Pune',
      //   image:
      //     'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/327f9fc3a1ff4f88d3ce3fe7bdb7d2e7935e467a.jpg',
      //   slug: 'locl-the-ivy-league-house',
      //   starting: '9,000',
      // },
      {
        name: 'Cleo House Coliving',
        address: 'Narayan Nagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a1d6286748eae1a5b82b973402dbe942597dbb53.jpg',
        slug: 'cleo-house',
        starting: '7,000',
      },
      {
        name: 'The Orchid Pune',
        address: 'Viman Nagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/414b8551922c698ad48b7c6f48c7a8a7143e9d84.jpg',
        slug: 'the-orchid-pune',
        starting: '15,000',
      },
    ],

    mumbai: [
      {
        name: 'Tribe Student',
        address: 'S Pond Rd',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f64773d0812d864f0d2b7412ea43033d103c8d2e.jpg',
        slug: 'tribe-stays-vile-parle',
        starting: '50,000',
      },
      {
        name: 'Your Space',
        address: 'Andheri, Mumbai',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/da3335ff52272e88d521300533446d27b43d842c.jpg',
        slug: 'your-space-andheri',
        starting: '24,500',
      },
      {
        name: 'Your Space',
        address: 'Kharghar, Mumbai',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e1be5f8ba15c80b87aec01a789837dec9929690e.jpg',
        slug: 'your-space-kharghar',
        starting: '19,700',
      },
      {
        name: 'Your Space',
        address: 'Panvel, Mumbai',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2e99ffce69bfef4c6b9292c05bbb5fb4cde43f20.jpg',
        slug: 'your-space-panvel',
        starting: '6,400',
      },
      {
        name: 'Your Space',
        address: 'Powai, Mumbai',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ead200825b5067315a8c798d41709058821d8985.jpg',
        slug: 'your-space-powai',
        starting: '18,000',
      },
      {
        name: 'Your Space',
        address: 'Vile Parle West, Mumbai',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4c2d037a25ca3938bfe69472a718591b18e14d8a.jpg',
        slug: 'your-space-vile-parle-girls',
        starting: '34,000',
      },
    ],

    hyderabad: [
      {
        name: 'Stanza living - Memphis House',
        address: 'Gachibowli, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/fa6a8b11131df5d765e68b6f690e136315e3025b.jpg',
        slug: 'stanza-living-memphis-house-q-city',
        starting: '9,500',
      },
      {
        name: 'Isthara Dsr Nilayam',
        address: 'Gowlidoddi, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/982cbdfd30aa937b17c1c2e78d004f762e2eba3b.jpg',
        slug: 'dsr-nilayam-isthara',
        starting: '8,000',
      },
      {
        name: 'HelloWorld Justajoo',
        address: 'Hafeezpet, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6fb572d2482147185e7971c74c419913701f9a4a.jpg',
        slug: 'helloworld-justajoo-coliving',
        starting: '20,000',
      },
      {
        name: 'Stanza Living | Exeter House',
        address: 'Gowlidoddy, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/851fdee327d3c6c8e49380b3a0b86c7b8d8bfe8b.jpg',
        slug: 'stanza-living-exeter-house',
        starting: '7,850',
      },
      {
        name: 'Isthara Lasya',
        address: 'Gowlidoddy, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/51ed9b33d7dc7f7da3333e5c136425ca9066fa60.jpg',
        slug: 'isthara-lasya-residency',
        starting: '8,000',
      },
      {
        name: 'Isthara AA Homes',
        address: 'Manikonda, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ef13d9c578d83f71a5f5217ceafdbcb2673d2961.jpg',
        slug: 'isthara-aa-homes',
        starting: '8,000',
      },
      {
        name: 'HelloWorld Kohinoor',
        address: 'Ranga Reddy, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3c305c2d4d9127ced200732e3ddf5d5f4815cc63.jpg',
        slug: 'helloworld-kohinoor',
        starting: '7,000',
      },
      {
        name: 'Dsr Nilayam Isthara',
        address: 'Gowlidoddi, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/561165ec9a876909646405cc0e82b67e413903e6.jpg',
        slug: 'dsr-nilayam-isthara',
        starting: '8,000',
      },
    ],

    chennai: [
      // {
      //   name: 'Colive 302 Alaka',
      //   address: 'Kattupakkam, Chennai',
      //   image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/163d3668f41e9b509565100727fa2883d2be481d.jpg',
      //   slug: 'colive-302-alaka-palazzo-a',
      //   starting: '10,000'
      // },
      // {
      //   name: 'Colive 309 Primex',
      //   address: 'Kolapakkam, Chennai',
      //   image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9527c9f48ba19aa017aca4ef3210e35122945e0f.jpg',
      //   slug: 'colive-309-primex-verterra',
      //   starting: '10,000'
      // },
      // {
      //   name: 'Colive 306 Golden',
      //   address: 'Velachery, Chennai',
      //   image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/1083749ebe2581f026ded145bdb14f3523cf57c5.jpg',
      //   slug: 'colive-306-golden-square',
      //   starting: '10,000'
      // },
      {
        name: 'HelloWorld Bliss',
        address: 'Karapakkam, Chennai',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/0d652e0c48915581634c9567359001f1d7eacee4.jpg',
        slug: 'helloworld-bliss',
        starting: '6,500',
      },
      {
        name: 'Hyliv Ankur',
        address: 'Kaverai Street, Chennai',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/03b922de1e9e676c219b8d997dc2925ae565e81b.jpg',
        slug: 'hyliv-ankur',
        starting: '6,999',
      },
      {
        name: 'HYLIV Wester',
        address: 'Arunachalam Road',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f05c8f7f039259bf2876e6a6cda376260ae49482.jpg',
        slug: 'hyliv-wester',
        starting: '7,599',
      },
      {
        name: 'HYLIV Meadows',
        address: 'Pallavaram, Chennai',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/d19cf0631728fd3ffc68b76ac68a7943e766c1ce.jpg',
        slug: 'hyliv-meadows',
        starting: '5,999',
      },
    ],

    bhubaneswar: [
      {
        name: 'HelloWorld Apex',
        address: 'Patia, Bhubaneswar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a7880aec4102e4aca5a40c3da5c448f1cbfc09ce.jpg',
        slug: 'helloworld-apex',
        starting: '5,000',
      },
      {
        name: 'HelloWorld Spectacle',
        address: 'Sailashree Vihar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b2b68d2dc545f79ccb6128ebd62849245ab714ac.jpg',
        slug: 'helloworld-spectacle',
        starting: '5,500',
      },
      {
        name: 'HelloWorld Opulent',
        address: 'Sailashree Vihar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/00be39aebce6e82ddd36ec755114f84281340e90.jpg',
        slug: 'helloworld-opulent',
        starting: '5,000',
      },
      {
        name: 'HelloWorld Odyssey',
        address: 'Maitre Vihar Rd',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6f76d061ff2751ec4d73ce93209d3330ea73c6e3.jpg',
        slug: 'helloworld-odyssey',
        starting: '7,000',
      },
      {
        name: 'HelloWorld Novelty',
        address: 'Patia, Bhubaneswar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/972aa2a5eefc550449d2962869ead3916d1fe0b0.jpg',
        slug: 'helloworld-novelty',
        starting: '500',
      },
      {
        name: 'HelloWorld Fortune',
        address: 'BJB Nagar, Bhubaneswar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f7e6b383608c8fc2c734eeb30d3d9536bb835377.jpg',
        slug: 'helloworld-fortune',
        starting: '5,500',
      },
      {
        name: 'HelloWorld Ardour',
        address: 'Bhubaneswar, Odisha',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3af21235b1aeb914beec0581d56cfe0cb4925b99.jpg',
        slug: 'helloworld-ardour',
        starting: '5,500',
      },
      {
        name: 'HelloWorld Aspire',
        address: 'Patia, Bhubaneswar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/d9c7a48b7f3824ec0bf1c9948a636561b9e03c9d.jpg',
        slug: 'helloworld-aspire',
        starting: '13,000',
      },
    ],
    // yourspace: [
    //   {
    //     name: 'Your Space Bannerghatta Boys',
    //     address: 'Between 1st Cross & 2nd Cross, Bangalore',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/21faa6daf9c799d90fa9f074b969613306444bd4.jpg',
    //     slug: 'yourspace-bennarghatta-road-boys',
    //     starting: '16,000',
    //   },
    //   {
    //     name: 'Your Space Bannerghatta Girls ',
    //     address: 'Hulimavu, Bangalore',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4239dbad25d049ca533e2bf6f9ef9c90eeb9feb3.jpg',
    //     slug: 'yourspace-bennarghatta-road-girls',
    //     starting: '12,000',
    //   },
    //   {
    //     name: 'Your Space koramangala - Girls',
    //     address: 'Hosur Road, Bangalore',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/178008243f5804f80d6dca9031567cc4e64e80ba.jpg',
    //     slug: 'yourspace-kormangala-girls',
    //     starting: '16,000',
    //   },
    //   {
    //     name: 'Your Space Viman Nagar (Boys)',
    //     address: 'Sakore Nagar, Pune',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/0cd3c49b1e13c6abb12331ccfaabbe6d44924ba8.jpg',
    //     slug: 'your-space-viman-nagar',
    //     starting: '15,000',
    //   },
    //   {
    //     name: 'Your Space Bungalow Road ',
    //     address: 'Bungalow road, New Delhi',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/31cb06225e639ff48aea74882c6eac6da467c53c.jpg',
    //     slug: 'your-space-bungalow-road39',
    //     starting: '21,000',
    //   },
    //   {
    //     name: 'Your Space Pearl Nest NFC',
    //     address: 'New Friends Colony, New Delhi',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3b821ecf183263b44e6a4f8fdff714bd70a18e3e.jpg',
    //     slug: 'your-space-pearl-nfc',
    //     starting: '21,000',
    //   },
    //   {
    //     name: 'Your Space Vile Parle (Girls)',
    //     address: 'Vile Parle West, Mumbai',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4c2d037a25ca3938bfe69472a718591b18e14d8a.jpg',
    //     slug: 'your-space-vile-parle-girls',
    //     starting: '34,000',
    //   },
    // ],

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
    // housr: [
    //   {
    //     name: 'Housr 38-II',
    //     address: 'Sector 38, Gurugram',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/44b3c2d40458762d15afde920acbd3fe441e18a8.jpg',
    //     slug: 'housr-38-ii',
    //     starting: '11,000',
    //   },
    //   {
    //     name: 'Housr Malibu Town',
    //     address: 'Sector 47, Gurugram',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/d06e5847ec5534593bf51b80af2761115bded046.jpg',
    //     slug: 'housr-malibu-town',
    //     starting: '11,499',
    //   },
    //   {
    //     name: 'Housr Phoenix',
    //     address: 'Balewadi, Pune',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2e428fd924ec3be030cf108b2fd0f3300b93335a.jpg',
    //     slug: 'housr-phoenix-balewadi',
    //     starting: '12,999',
    //   },
    //   {
    //     name: 'Housr Sector 43',
    //     address: 'Sector 43, Gurugram',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/72d6c9e347517db0d028ed9cd3f4a35ce999a6d9.jpg',
    //     slug: 'housr-sector-43',
    //     starting: '12,499',
    //   },
    //   {
    //     name: 'Housr Sector 46',
    //     address: 'Sector 46, Gurugram',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/408a12c8b6dc926aee3df0bb446ec099f9f3e772.jpg',
    //     slug: 'housr-sector-46',
    //     starting: '11,499',
    //   },
    //   {
    //     name: 'Housr Sector-49',
    //     address: 'Sector 49, Gurugram',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/cdf7376c53846fbf65d1a3a438c32070fba6ff8e.jpg',
    //     slug: 'housr-sector-49',
    //     starting: '11,499',
    //   },
    //   {
    //     name: 'Housr Tulip Purple',
    //     address: 'Sector 69, Gurugram',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e0801ecc67c7d1f30fde3a58ba65f2919236f28a.jpg',
    //     slug: 'housr-tulip-purple-gurgaon',
    //     starting: '12,000',
    //   },
    // ],

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

    // HostelYard: [
    //   {
    //     name: 'The Hostel Yard - Jasmine (girls) RA - 08',
    //     address: 'Sector 125, Noida',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/fcfde2bf8b5ef7621f6ec578c4d36e96d530e77d.jpg',
    //     slug: 'hostelyard-jasmine-girls-ra-08-sector-125',
    //     starting: '18,000',
    //   },
    //   {
    //     name: 'The Hostel Yard - Lily House (Girls)',
    //     address: 'Kamla Nagar',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/58d4c2d1dfb777cebfedf2eba31c3997ebf8d703.jpg',
    //     slug: 'the-hostelyard-lily-house-girls-kamla-nagar',
    //     starting: '14,000',
    //   },
    //   {
    //     name: 'The Hostel Yard - Orchid House (Girls)',
    //     address: 'Vijay nagar, New Delhi',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/11f6fbb405e5084e8096deee02a8d164fc15677a.jpg',
    //     slug: 'hostelyard-orchid-house-girls-vijay-nagar',
    //     starting: '14,000',
    //   },
    //   {
    //     name: 'The Hostel Yard - Rose House (Girls)',
    //     address: 'Vijay nagar, New Delhi',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/fcee70e0a5da249c0000e5739987a5119f8f5c0a.jpg',
    //     slug: 'the-hostelyard-rose-house-girls-vijay-nagar',
    //     starting: '13,000',
    //   },
    //   {
    //     name: 'The Hostel Yard - Snapdragon (Boys)',
    //     address: 'Kamla Nagar, New Delhi',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8f7df1eb4a19308e6153e2d0a11572635372a93f.jpg',
    //     slug: 'hostelyard-snapdragon-boys-kamla-nagar',
    //     starting: '18,000',
    //   },
    //   {
    //     name: 'The Hostel Yard - Tulip House (Girls)',
    //     address: 'Kamal Nagar, New Delhi',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/72aa71dbdc0c980dcb0f65b7f30b95e91b9290ed.jpg',
    //     slug: 'the-hostelyard-tulip-house-girls-kamla-nagar',
    //     starting: '21,000',
    //   },
    //   {
    //     name: 'The Hostel yard - Petal House',
    //     address: 'Bannerghatta Road, Bangalore',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/51f537d1cb757776a0dc72d0588b307651a3cf8c.jpg',
    //     slug: 'hostelyard-bannerghatta',
    //     starting: '15,000',
    //   },

    //   {
    //     name: 'The Hostelyard - Daisy House (Girls)',
    //     address: 'Satya Niketan, Delhi',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/fcd4480e75c5b09fd3bf66f7ec9827246e598acc.jpg',
    //     slug: 'the-hostelyard-daisy-house-girls-satya-niketan',
    //     starting: '12,000',
    //   },

    //   {
    //     name: 'The Hostel Yard - Ivy Yard',
    //     address: 'Sector 126, Noida',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5ea15901959693d8b6393bbe3af240f0e69d58ee.jpg',
    //     slug: 'hostelyard-ivy-yard-sector-126',
    //     starting: '15,000',
    //   },

    //   {
    //     name: 'The Hostel Yard - Hibiscus House (Boys)',
    //     address: 'Vijay Nagar, Delhi',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5de2a2eab954bbbf5b2f0208ee8a7e11883a5f5e.jpg',
    //     slug: 'the-hostelyard-hibiscus-house-boys-vijay-nagar',
    //     starting: '18,000',
    //   },
    //   {
    //     name: 'The Hostel Yard - Bluebell House (Boys)',
    //     address: 'Kamla Nagar, New Delhi',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5a2c41c29fca89155fdcfa1dca6b8cf1cd97098e.jpg',
    //     slug: 'hostelyard-bluebell-house-boys-kamla-nagar',
    //     starting: '16,000',
    //   },
    //   {
    //     name: 'The Hostel Yard - Aster House',
    //     address: 'Sector 58, Noida',
    //     image:
    //       'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/62a4fb1a0562864b1185b1ead036bbac022da6f6.jpg',
    //     slug: 'the-hostelyard-aster-house-sector-58',
    //     starting: '14,000',
    //   },
    // ],

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

    LOCL: [
      {
        name: 'THE IVY LEAGUE HOUSE (LOCL)',
        address: 'Wakad, Pune',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a1898ea4ba525ab2083d5a65fc029c30b4f9b16d.jpg',
        slug: 'locl-the-ivy-league-house',
        starting: '9,000',
      },
      {
        name: 'LOCL Co-live & Work',
        address: 'Bellandur Main Road, Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a3c18bc6d15709e1fa697586efb85ec5f4f7a458.jpg',
        slug: 'locl-colive-work-bellandur',
        starting: '10,000',
      },
      {
        name: 'LOCL Co-live & Work',
        address: 'Koramangala, Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/db6e3e73ba5e048f6294048a59cee862e3630fcb.jpg',
        slug: 'locl-colive-work-koramangala',
        starting: '10,000',
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
      address: 'Sector 40, Gurgaon',
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

  constructor(private brandService: BrandService, private seoService: SeoService, private router: Router) {
    this.cities = AVAILABLE_CITY_CO_LIVING.filter(city => city.for_coLiving === true);
  }

  ngOnInit() {
    this.addSeoTags();
    this.getBrands();
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
    this.router.navigate([`/brand/co-living/yourspace`]);
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
