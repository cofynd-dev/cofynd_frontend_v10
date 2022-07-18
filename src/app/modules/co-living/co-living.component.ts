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
        name: 'LOCL Colive',
        address: 'Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2825fcc97e1fe0b7acbcebca91d15f00e18ed462.jpg',
        slug: 'locl-colive-work-bellandur',
        starting: '10,000',
      },
      // {
      //   name: 'Colive 018',
      //   address: 'Bangalore',
      //   image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5507e0d441daf04fc8499224bcb89bbbfb5c47ef.jpg',
      //   slug: 'colive-018-the-address',
      //   starting: '8,800'
      // },
      {
        name: 'Settl. Smogen',
        address: 'HSR Layout Bengaluru',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/d99ce5549c6e22b08e8f7db8bd25fe725b82c953.jpg',
        slug: 'settl-smogen',
        starting: '12,000',
      },
      {
        name: 'Niles StayAbode',
        address: 'Krishna Reddy Layout',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4574f81d390a8ab7b53873df3c51dd2235924527.jpg',
        slug: 'niles-stayabode',
        starting: '22,000',
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
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5e888e278f28ddaf82a865632b969f0b312c5091.jpg',
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
      {
        name: 'Grexter Avalon',
        address: 'HSR Layout , Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/35b3349f126fdba6f87c38662cacb5088104b956.jpg',
        slug: 'grexter-avalon',
        starting: '8,900',
      },
    ],
    bangalore: [
      {
        name: 'LOCL Colive',
        address: 'Bellandur Main Road',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2825fcc97e1fe0b7acbcebca91d15f00e18ed462.jpg',
        slug: 'locl-colive-work-bellandur',
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
        name: 'Grexter Inaaya',
        address: 'Nagavara',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5d62c850c6aefb59c263bc238d2f38e5b3cfce0a.jpg',
        slug: 'grexter-inaaya',
        starting: '6,800',
      },
      {
        name: 'Settl. Reine',
        address: 'HSR Layout',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2593968c490ef7cd8b2f9dfd01c5b03a820a1aa0.png',
        slug: 'settl-reine',
        starting: '25,000',
      },
      {
        name: 'Matilda StayAbode',
        address: 'Kundalahalli',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c960c4eaea605699b785ccb95bd677fc97a11c09.jpg',
        slug: 'matilda-stayabode',
        starting: '11,000',
      },
      // {
      //   name: 'Colive 179',
      //   address: 'Doddanekundi',
      //   image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4e1da7e3114ecf240add949002b907d5faeb1bd8.jpg',
      //   slug: 'colive-179-signature-towers',
      //   starting: '10,500'

      // },
      // {
      //   name: 'Colive 484 Atlanta',
      //   address: 'Chinnapanahalli',
      //   image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/68409e49b30d5232488a2c1f5badc77229569ad7.jpg',
      //   slug: 'colive-484-atlanta',
      //   starting: '23,000'

      // },
      {
        name: 'Hood Coliving Daffodils',
        address: 'Electronic city phase 1',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5dfb93bd9bf062aba00254076646f799a4e0acca.jpg',
        slug: 'hood-living',
        starting: '8,500',
      },
      {
        name: 'Settl.Samara',
        address: 'Indiranagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ad2af7487fe7eebdf60048bd737946116cd72603.jpg',
        slug: 'settl-samara',
        starting: '11,000',
      },
      {
        name: 'Kohabs Amber',
        address: 'HAL 3rd stage',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e580ba919c93888b14edfadca17d0a96f36764a1.jpg',
        slug: 'kohabs-amber',
        starting: '12,500',
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
        name: 'Housr Tulip Purple',
        address: 'Sector 69, Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e0801ecc67c7d1f30fde3a58ba65f2919236f28a.jpg',
        slug: 'housr-tulip-purple-gurgaon',
        starting: '12,000',
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
        name: 'Housr Phase 1',
        address: 'Sector 28, Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ce0fcdbb45ece152710d7b41891975961fe4a97d.jpg',
        slug: 'housr-phase-1',
        starting: '16,000',
      },
      {
        name: 'Manav PG',
        address: 'Sector 33, Sohna Road',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ece0d8302a47bf34681abaab23f90a2806392139.jpg',
        slug: 'manav-pg',
        starting: '6,000',
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
        name: 'Urban Storey',
        address: 'Gautam Nagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c834d216d1b441fa6227c87118801d7b6450599d.jpg',
        slug: 'urban-storey-lighthouse',
        starting: '8,000',
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
        name: 'Blossom Stayz',
        address: 'Saket',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/be7ad0814cd8035ce8a8ecb293b456e3c3ff6cfd.jpg',
        slug: 'blossom-stayz-saket',
        starting: '12,000',
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
        name: 'Coho',
        address: 'North Campus',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3de301b08b784d17c853df6c257b3dad77118ebe.jpg',
        slug: 'coho-shakti-nagar',
        starting: '16,500',
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
      {
        name: 'Blossom Stayz',
        address: 'Kamla Nagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c7ba9efe91d6c27c2953f1b5fb34ce95477619a4.jpg',
        slug: 'blossom-stayz-kamla-nagar',
        starting: '11,000',
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
        name: 'Housr Phoenix',
        address: 'Balewadi, Pune',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2e428fd924ec3be030cf108b2fd0f3300b93335a.jpg',
        slug: 'housr-phoenix-balewadi',
        starting: '12,999',
      },
      {
        name: 'Housr Vision',
        address: 'Wakad, Pune',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6c50b55e67eedb1c556f5b30987d18ef9bc77b90.jpg',
        slug: 'housr-vision',
        starting: '11,999',
      },
      {
        name: 'COLIWO',
        address: 'Mathura Nagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6ddc3e8a94c2168a5c203eb5423c8d206718e68a.jpg',
        slug: 'coliwo',
        starting: '15,000',
      },
      {
        name: 'THE IVY LEAGUE HOUSE',
        address: 'Wakad, Pune',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/327f9fc3a1ff4f88d3ce3fe7bdb7d2e7935e467a.jpg',
        slug: 'locl-the-ivy-league-house',
        starting: '9,000',
      },
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
      // {
      //   name: 'Colive 645 Harrisburg',
      //   address: 'Hinjewadi',
      //   image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ee2307bc03ae389b6eb2283c41538bf5cc59a60d.jpg',
      //   slug: 'colive-645-harrisburg',
      //   starting: '11,000'

      // },
      // {
      //   name: 'Colive 641 Newark',
      //   address: 'Narhe, Pune',
      //   image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9b21655c13d86e541ae2c789e0b0f2ecfc1e6fd0.jpg',
      //   slug: 'colive-641-newark',
      //   starting: '6,500'

      // },
    ],
    mumbai: [
      {
        name: 'Tribe Student',
        address: 'S Pond Rd',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c5e9b46ad7812a6bccc0df5fad4918823292d629.jpg',
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
        name: 'Housr Qcity',
        address: 'Gowlidoddi, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/d36a4cdf2d43f463082f6f5910d6350f9be8cc94.jpg',
        slug: 'housr-qcity',
        starting: '9,999',
      },
      {
        name: 'Settl. Amalfi',
        address: 'Madhapur, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/fb1f22c8ffa3e9723db13fd601f86e8c6e87d115.jpg',
        slug: 'settl-amalfi',
        starting: '11,000',
      },
      {
        name: 'Housr 84 Kondapur',
        address: 'Kondapur, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9a7eddc2593599aaa1f87f2dbd284a118136d776.jpg',
        slug: 'housr-84-kondapur',
        starting: '13,999',
      },
      // {
      //   name: 'Colive 504 Garnet',
      //   address: 'Gachibowli, Hyderabad',
      //   image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8cc69133ce25d290878aa2d9c9b1edb56226ea32.jpg',
      //   slug: 'colive-504-garnet',
      //   starting: '7,200'
      // },
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
      // {
      //   name: 'Colive 501 Elara',
      //   address: 'Gowlidoddi, Hyderabad',
      //   image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8b101604c59c5537d61dcdb176cfcca450002c90.jpg',
      //   slug: 'colive-501-elara',
      //   starting: '5,500'
      // },
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
    yourspace: [
      {
        name: 'Your Space Bannerghatta Boys',
        address: 'Between 1st Cross & 2nd Cross, Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/21faa6daf9c799d90fa9f074b969613306444bd4.jpg',
        slug: 'yourspace-bennarghatta-road-boys',
        starting: '16,000',
      },
      {
        name: 'Your Space Bannerghatta Girls ',
        address: 'Hulimavu, Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4239dbad25d049ca533e2bf6f9ef9c90eeb9feb3.jpg',
        slug: 'yourspace-bennarghatta-road-girls',
        starting: '12,000',
      },
      {
        name: 'Your Space koramangala - Girls',
        address: 'Hosur Road, Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/178008243f5804f80d6dca9031567cc4e64e80ba.jpg',
        slug: 'yourspace-kormangala-girls',
        starting: '16,000',
      },
      {
        name: 'Your Space Viman Nagar (Boys)',
        address: 'Sakore Nagar, Pune',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/0cd3c49b1e13c6abb12331ccfaabbe6d44924ba8.jpg',
        slug: 'your-space-viman-nagar',
        starting: '15,000',
      },
      {
        name: 'Your Space Bungalow Road ',
        address: 'Bungalow road, New Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/31cb06225e639ff48aea74882c6eac6da467c53c.jpg',
        slug: 'your-space-bungalow-road39',
        starting: '21,000',
      },
      {
        name: 'Your Space Pearl Nest NFC',
        address: 'New Friends Colony, New Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3b821ecf183263b44e6a4f8fdff714bd70a18e3e.jpg',
        slug: 'your-space-pearl-nfc',
        starting: '21,000',
      },
      {
        name: 'Your Space Vile Parle (Girls)',
        address: 'Vile Parle West, Mumbai',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4c2d037a25ca3938bfe69472a718591b18e14d8a.jpg',
        slug: 'your-space-vile-parle-girls',
        starting: '34,000',
      },
    ],
    housr: [
      {
        name: 'Housr 38-II',
        address: 'Sector 38, Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/44b3c2d40458762d15afde920acbd3fe441e18a8.jpg',
        slug: 'housr-38-ii',
        starting: '11,000',
      },
      {
        name: 'Housr Malibu Town',
        address: 'Sector 47, Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/d06e5847ec5534593bf51b80af2761115bded046.jpg',
        slug: 'housr-malibu-town',
        starting: '11,499',
      },
      {
        name: 'Housr Phoenix',
        address: 'Balewadi, Pune',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2e428fd924ec3be030cf108b2fd0f3300b93335a.jpg',
        slug: 'housr-phoenix-balewadi',
        starting: '12,999',
      },
      {
        name: 'Housr Sector 43',
        address: 'Sector 43, Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/72d6c9e347517db0d028ed9cd3f4a35ce999a6d9.jpg',
        slug: 'housr-sector-43',
        starting: '12,499',
      },
      {
        name: 'Housr Sector 46',
        address: 'Sector 46, Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/408a12c8b6dc926aee3df0bb446ec099f9f3e772.jpg',
        slug: 'housr-sector-46',
        starting: '11,499',
      },
      {
        name: 'Housr Sector-49',
        address: 'Sector 49, Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/cdf7376c53846fbf65d1a3a438c32070fba6ff8e.jpg',
        slug: 'housr-sector-49',
        starting: '11,499',
      },
      {
        name: 'Housr Tulip Purple',
        address: 'Sector 69, Gurugram',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e0801ecc67c7d1f30fde3a58ba65f2919236f28a.jpg',
        slug: 'housr-tulip-purple-gurgaon',
        starting: '12,000',
      },
    ],
    HostelYard: [
      {
        name: 'The Hostel Yard - Jasmine (girls) RA - 08',
        address: 'Sector 125, Noida',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/fcfde2bf8b5ef7621f6ec578c4d36e96d530e77d.jpg',
        slug: 'hostelyard-jasmine-girls-ra-08-sector-125',
        starting: '18,000',
      },
      {
        name: 'The Hostel Yard - Lily House (Girls)',
        address: 'Kamla Nagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/58d4c2d1dfb777cebfedf2eba31c3997ebf8d703.jpg',
        slug: 'the-hostelyard-lily-house-girls-kamla-nagar',
        starting: '14,000',
      },
      {
        name: 'The Hostel Yard - Orchid House (Girls)',
        address: 'Vijay nagar, New Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/11f6fbb405e5084e8096deee02a8d164fc15677a.jpg',
        slug: 'hostelyard-orchid-house-girls-vijay-nagar',
        starting: '14,000',
      },
      {
        name: 'The Hostel Yard - Rose House (Girls)',
        address: 'Vijay nagar, New Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/fcee70e0a5da249c0000e5739987a5119f8f5c0a.jpg',
        slug: 'the-hostelyard-rose-house-girls-vijay-nagar',
        starting: '13,000',
      },
      {
        name: 'The Hostel Yard - Snapdragon (Boys)',
        address: 'Kamla Nagar, New Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8f7df1eb4a19308e6153e2d0a11572635372a93f.jpg',
        slug: 'hostelyard-snapdragon-boys-kamla-nagar',
        starting: '18,000',
      },
      {
        name: 'The Hostel Yard - Tulip House (Girls)',
        address: 'Kamal Nagar, New Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/72aa71dbdc0c980dcb0f65b7f30b95e91b9290ed.jpg',
        slug: 'the-hostelyard-tulip-house-girls-kamla-nagar',
        starting: '21,000',
      },
      {
        name: 'The Hostel yard - Petal House',
        address: 'Bannerghatta Road, Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/51f537d1cb757776a0dc72d0588b307651a3cf8c.jpg',
        slug: 'hostelyard-bannerghatta',
        starting: '15,000',
      },

      {
        name: 'The Hostelyard - Daisy House (Girls)',
        address: 'Satya Niketan, Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/fcd4480e75c5b09fd3bf66f7ec9827246e598acc.jpg',
        slug: 'the-hostelyard-daisy-house-girls-satya-niketan',
        starting: '12,000',
      },

      {
        name: 'The Hostel Yard - Ivy Yard',
        address: 'Sector 126, Noida',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5ea15901959693d8b6393bbe3af240f0e69d58ee.jpg',
        slug: 'hostelyard-ivy-yard-sector-126',
        starting: '15,000',
      },

      {
        name: 'The Hostel Yard - Hibiscus House (Boys)',
        address: 'Vijay Nagar, Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5de2a2eab954bbbf5b2f0208ee8a7e11883a5f5e.jpg',
        slug: 'the-hostelyard-hibiscus-house-boys-vijay-nagar',
        starting: '18,000',
      },
      {
        name: 'The Hostel Yard - Bluebell House (Boys)',
        address: 'Kamla Nagar, New Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5a2c41c29fca89155fdcfa1dca6b8cf1cd97098e.jpg',
        slug: 'hostelyard-bluebell-house-boys-kamla-nagar',
        starting: '16,000',
      },
      {
        name: 'The Hostel Yard - Aster House',
        address: 'Sector 58, Noida',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/62a4fb1a0562864b1185b1ead036bbac022da6f6.jpg',
        slug: 'the-hostelyard-aster-house-sector-58',
        starting: '14,000',
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
      name: 'CHILLAR PG',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6e985d7ed0a199d4c7d6f08e3562c2329365c403.jpg',
      address: 'Extension near Tata Telco, Delhi',
      slug: 'chillar',
    },
    {
      name: 'Housr Tulip Purple',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e0801ecc67c7d1f30fde3a58ba65f2919236f28a.jpg',
      address: 'Sector 69, Gurugram',
      slug: 'housr-tulip-purple-gurgaon',
    },
    {
      name: 'HelloWorld Siri',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3cf39ce402e67c8fad130db6b0dae64915e20cd2.jpg',
      address: 'B-56, Sector 22, Noida',
      slug: 'helloworld-siri',
    },
    {
      name: 'The Hub Safina plaza',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e1b2f556cf598bf903b7949b28ed90e585dee41b.jpg',
      address: 'Infantry Road, Bangalore',
      slug: 'the-hub-infantry-road',
    },
    {
      name: 'HelloWorld Fitoor',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/d73119104d471bba36644fbe8c79f7777b647315.jpg',
      address: 'Indira Nagar, Gachibowli, Hyderabad',
      slug: 'helloworld-fitoor',
    },
    {
      name: `Tribe Student Housing Vile Parle`,
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/91963d7cede91e6a1660edde9f9dce8b07b3d039.jpg',
      address: 'S Pond Rd, Mumbai',
      slug: 'tribe-stays-vile-parle',
    },
    {
      name: 'Housr Phoenix',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2e428fd924ec3be030cf108b2fd0f3300b93335a.jpg',
      address: 'Balewadi, Pune',
      slug: 'housr-phoenix-balewadi',
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
    console.log("cities", this.cities);
  }

  ngOnInit() {
    this.addSeoTags();
    this.getBrands();
  }

  getBrands() {
    this.brandService.getBrands(sanitizeParams({ type: 'coliving' })).subscribe(res => {
      console.log("coLivingBrands", res)
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
