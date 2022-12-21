import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { sanitizeParams } from '@app/shared/utils';
import { City } from '@core/models/city.model';
import { SeoSocialShareData } from '@core/models/seo.model';
import { ConfigService } from '@core/services/config.service';
import { SeoService } from '@core/services/seo.service';
import { environment } from '@env/environment';
import { AppConstant } from '@shared/constants/app.constant';
import { AVAILABLE_CITY } from '@core/config/cities';
import { Brand } from '@app/core/models/brand.model';
import { BrandService } from '@app/core/services/brand.service';
import { HomeMenuModalComponent } from '../home/home-menu-modal/home-menu-modal.component';
import { WorkSpaceService } from '@app/core/services/workspace.service';
// import { MapsAPILoader } from '@app/core/map-api-loader/maps-api-loader';
import { ToastrService } from 'ngx-toastr';
import { CuratedCityPopupComponent } from '@app/shared/components/curated-city-popup/curated-city-popup.component';
import { Observable, Subscriber } from 'rxjs';
import { WorkSpace } from '@core/models/workspace.model';

interface PopularSpace {
  name: string;
  address: string;
  image: string;
  id: string;
  slug?: string;
}

@Component({
  selector: 'app-coworking',
  templateUrl: './coworking.component.html',
  styleUrls: ['./coworking.component.scss', '../virtual-office/virtual-office.component.scss'],
})
export class CoworkingComponent implements OnInit, OnDestroy {
  menuModalRef: BsModalRef;
  availableCities: City[] = AVAILABLE_CITY;
  coworkingBrands: Brand[] = [];
  cities: City[];
  popularCoWorkingSpaces: PopularSpace[] = [];

  loading = true;
  queryParams: { [key: string]: string | number };

  count = 0;
  showLoadMore: boolean;

  page = 1;
  loadMoreLoading: boolean;

  isMapView: boolean;
  scrollCount: number;
  isScrolled: boolean;
  isSearchFooterVisible: boolean;

  // Pagination
  maxSize = 10;
  totalRecords: number;
  seoData: SeoSocialShareData;
  latitute: any;
  longitute: any;
  workSpaces: WorkSpace[];

  pageTitle: string = 'Top CoWorking Spaces in India';

  city = [
    {
      name: 'gurugram',
      img: 'gurgaon-ofcc.jpg',
      title: 'A Millennium City',
      seat: '131',
    },
    {
      name: 'bangalore',
      img: 'bangalore-ofcc.jpg',
      title: "India's Silicon Valley",
      seat: '259',
    },
    {
      name: 'delhi',
      img: 'delhi.jpg',
      title: 'The Nation Capital',
      seat: '131',
    },
    {
      name: 'noida',
      img: 'wtc.jpg',
      title: 'The Hitech City',
      seat: '53',
    },
    {
      name: 'hyderabad',
      img: 'hyderbad.jpg',
      title: 'The City of Pearls',
      seat: '79',
    },
    {
      name: 'mumbai',
      img: 'mumbai2.jpg',
      title: 'City of Dreams',
      seat: '90',
    },
    {
      name: 'pune',
      img: 'pune.jpg',
      title: 'Queen of Deccan',
      seat: '74',
    },
    {
      name: 'indore',
      img: 'indore.jpg',
      title: 'The Cleanest City',
      seat: '8',
    },
    {
      name: 'ahmedabad',
      img: 'ahemdabad.jpg',
      title: 'Manchester of India',
      seat: '10',
    },
    {
      name: 'kolkata',
      img: 'kolkata.jpg',
      title: 'City of Joy',
      seat: '14',
    },
    // {
    //   name: "Chennai",
    //   img: "kolkata.jpg",
    //   title: "City of Joy",
    //   seat: "71"
    // },
  ];

  spaces = [
    {
      name: 'Plus Offices',
      address: 'Sector 67 Gurugram',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/346caa67f2cfc71b4946eba543b6e220c0a30ec2.jpg',
      slug: 'plus-offices-golf-course-extension-c12e-gurugram',
    },
    {
      name: 'Awfis Augusta Point',
      address: 'Gurugram',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/35a69cc6dea37ed8bac00bef42c8cd10de070e68.jpg',
      slug: 'awfis-augusta-point',
    },
    {
      name: '91Springboard',
      address: 'Extension New Delhi',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/53dfcff9eda3a9bef671381e3c91892de0f52a06.jpg',
      slug: '91springboard-okhla-phase-2',
    },
    // {
    //   name: 'Co-Offiz',
    //   address: 'Janakpuri, Delhi',
    //   image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ed98b736d6fbe434841afd05f1eed083fe67fb3b.jpg',
    //   slug: 'co-offiz-janakpuri-delhi',
    // },
    {
      name: 'Nukleus Noida',
      address: 'Sector 142, Noida',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b8dffaef4e7bc6d43b24af2ce95def9ac5769631.jpg',
      slug: 'nukleus-cowork-coplay-sector-142-noida',
    },
    {
      name: 'ABL Workspace',
      address: 'Sector 4, Noida',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/57d32252bd5afeb55357eaa254d0059f164df501.jpg',
      slug: 'abl-workspace-sector-4-17b5-noida',
    },
    {
      name: '91springboard',
      address: 'Andheri East, Mumbai',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3271f4b96aec60a6cfb375d29f991807b9a35d2b.jpg',
      slug: '91springboard-74technopark',
    },
    {
      name: 'Community Coworks',
      address: 'Marol, Mumbai',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/995456e27469cc68bdb4b8491b9a62b63fe87906.jpg',
      slug: 'community-coworks-andheri-east',
    },
    {
      name: 'DevX Vastrapur',
      address: 'Ahmedabad',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e7efdb32030a1803c8832dfc1f4227feee349efc.jpg',
      slug: 'devx-ahmedabad',
    },
    {
      name: 'Connekt Memnagar',
      address: 'Ahmedabad',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5f8b90a657150474424a8a63511a93b750b749b3.jpg',
      slug: 'connekt-ahmedabad',
    },
    {
      name: '2gethr HSR',
      address: '1st Sector, Bengaluru',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/186ca34c82292e21116507ba455548c881ac2594.jpg',
      slug: '2gethr-hsr',
    },
    {
      name: 'IndiQube Orion',
      address: '1st Sector, Bengaluru',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c5ec1c0700a2b134d33801dbad9e6e9b1e58ccfb.jpg',
      slug: 'indiqube-orion',
    },
    {
      name: 'Innov8 Srestha Marvel',
      address: 'Hyderabad',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e2eee02cdef75cb83e97bc174771562ce97b08f1.jpg',
      slug: 'innov8-srestha-marvel',
    },
    {
      name: 'Garage Coworking',
      address: 'Pune',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/45c0a5d5b018dd04673e4d8fc4de663766a2b386.jpg',
      slug: 'garage-coworking-pune',
    },
    {
      name: 'Adited Coworking',
      address: 'Indore',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/879d988cbfa9d8c06f0b642fba72f305e64bd966.jpg',
      slug: 'adited-coworking-10-ab-rd',
    },
    {
      name: 'IndiQube Brigade',
      address: 'Perungudi, Chennai',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b697acd641d47016e82b47cdbeea15cafac7be34.jpg',
      slug: 'indiqube-brigade-vantage',
    },
    {
      name: '91springboard Goa',
      address: 'Santa Inez, Panaji',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c0cb2d683185253aef008fc32a6dc7f67549fdd1.jpg',
      slug: '91springboard1-goa',
    },
    // {
    //   name: ' ',
    //   address: ' ',
    //   image: ' ',
    //   slug: ' ',
    // },
  ];

  spaceForMobile = {
    bangalore: [
      {
        name: 'Beginest Harbor 1',
        address: 'Indiranagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/62a82259eaf92d35369f202bd67fadeee7d92f9f.jpg',
        slug: 'beginest-harbor-1',
        starting: '5,000',
      },
      {
        name: 'Beginest Harbor 2',
        address: 'Indiranagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/1ece65e79c60e582811b5311c79ef9b2ea6a627a.jpg',
        slug: 'beginest-harbor-2',
        starting: '5,000',
      },
      {
        name: 'Hustlehub Tech Park',
        address: 'HSR Layout',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3af6f949d7f4339a6db6f7938a431c42fd28c5fa.jpg',
        slug: 'hustlehub-tech-park',
        starting: '6,000',
      },
      {
        name: 'Bira 91 Limited',
        address: 'Nirguna Mandir Layout',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4f5c056d3eaa7beec4563091d69cd0ca245f37e4.jpg',
        slug: 'bira-91-limited-release-taproom',
        starting: '5,999',
      },
      {
        name: '2gethr HSR',
        address: '1st Sector, Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a09393ad34a42eb837addfc58f767adf231aac09.jpg',
        slug: '2gethr-hsr',
        starting: '7,500',
      },
      {
        name: 'Indiqube Coral',
        address: 'Jeevan Bhima Nagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/4aed3ab4637ba617677eded1160eb00701db688a.jpg',
        slug: 'indiqube-coral',
        starting: '8,000',
      },
      {
        name: '91springboard',
        address: ' Koramangala',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/bf1830a55b40d5cd1fb7cc8bf97a328d127c4470.jpg',
        slug: '91springboard-koramangala-7th-block',
        starting: '9,000',
      },
      {
        name: 'Rainmakers',
        address: 'MG Road, Bangalore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8dcce7a5c59ad6a175e319f55c0e5f6bda3330cd.jpg',
        slug: 'rainmakers-workspace',
        starting: '6,000',
      },
    ],
    gurugram: [
      {
        name: 'Plus Offices Sector 67',
        address: 'Landmark Cyber Park',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/346caa67f2cfc71b4946eba543b6e220c0a30ec2.jpg',
        slug: 'plus-offices-golf-course-extension-c12e-gurugram',
        starting: '6,000',
      },
      {
        name: 'Nukleus Sector 49',
        address: 'Eros City Square',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/dd2ff10ce723e9d80fac8512f447b41d39870a1b.jpg',
        slug: 'nukleus-sector-49',
        starting: '6,000',
      },
      {
        name: '91springboard NH8',
        address: 'Udyog Vihar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b68964508847d2c04b565aa318f0b3b0bf579079.jpg',
        slug: '91-spring-board-nh8-f55c-gurugram',
        starting: '6,600',
      },
      {
        name: 'CO-OFFIZ Golf Course',
        address: 'Magnum Tower 1',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/d76cf8783a905b3c915581b2fe90ab9ce6a7a582.jpg',
        slug: 'co-offiz-golf-course-extension-gurugram',
        starting: '8,000',
      },

      {
        name: 'Corporatedge',
        address: 'Two Horizon Centre',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/080e60469ed6643cd1e9f8a1b252fc57596565b9.jpg',
        slug: 'corporatedge-golf-course-road-gurugram',
        starting: '29,000',
      },

      {
        name: 'CoworkInsta',
        address: 'DLF Phase-4, Gurgaon',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/528b86699c8bce851c0519a0c0164a99c21b9ce5.jpg',
        slug: 'coworkinsta-dlf-phase-4',
        starting: '5,000',
      },
    ],
    delhi: [
      {
        name: 'Nukleus Pusa Road',
        address: 'Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/21676d3119b5620fb65b1af7b1c67eb1aed8e44a.jpg',
        slug: 'nukleus-rajendra-place',
        starting: '4,999',
      },
      {
        name: 'Workingdom',
        address: 'C.P, Inner Circle',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/70af7de291e4b742158d9a3245eac7e7c1487ca8.jpg',
        slug: 'workingdom-cp',
        starting: '8,499',
      },
      {
        name: 'ABL Workspace',
        address: 'Green Park, Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/eea5702cce156797f2b35bd1bcffce60ff469f1c.jpg',
        slug: 'abl-workspace-green-park-delhi',
        starting: '8,000',
      },
      {
        name: 'Awfis',
        address: 'Connaught Place',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/284b68fedb180cbd3fdde58409a209cc9d86e623.jpg',
        slug: 'awfis-connaught-place',
        starting: '6,000',
      },
      {
        name: 'Co- Offiz',
        address: 'Netaji Subhash Place',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6c4110298c6623fcd041cee0ca511fe104f552de.jpg',
        slug: 'co-offiz-netaji-subhash-place-delhi',
        starting: '8,000',
      },
      {
        name: 'Coworkrz',
        address: 'Dwarka Mor, New Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/90b1dae9cc83589ffafc5cf104d78a415f613df4.jpg',
        slug: 'coworkrz-dwarka',
        starting: '5,500',
      },
      {
        name: 'Spring House',
        address: 'Janakpuri, New Delhi',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/7e37cd2dd323f6d7959f316af27d1e78c14220a4.jpg',
        slug: 'spring-house-janakpuri',
        starting: '7,500',
      },
    ],
    noida: [
      {
        name: 'ABL Workspace',
        address: 'Block B, Sector 4',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/57d32252bd5afeb55357eaa254d0059f164df501.jpg',
        slug: 'abl-workspace-sector-4-17b5-noida',
        starting: '4,000',
      },
      {
        name: 'Awfis Corenthum',
        address: 'Sector 62, Noida',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c651407447298ba96bb9718771a0db90d17937d0.jpg',
        slug: 'awfis-corenthum-noida',
        starting: '4,500',
      },
      {
        name: '91springboard',
        address: 'Sector 63, Noida',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/bb433be9f05edcd3daf89fbbf6949ff28328e02b.jpg',
        slug: '91-springboard-sector-63-ade4-noida',
        starting: '6,900',
      },
      {
        name: 'IndiQube Logix',
        address: 'Sector 62, Noida',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/506a76bbe7ef1784599e70e20d826d4d9ee21a2f.jpg',
        slug: 'indiqube-logix-cyber-park',
        starting: '8,000',
      },
      {
        name: 'Nukleus Noida',
        address: 'Plot-29, Sector 142',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b8dffaef4e7bc6d43b24af2ce95def9ac5769631.jpg',
        slug: 'nukleus-cowork-coplay-sector-142-noida',
        starting: '6,000',
      },
      {
        name: 'NoteG Technologies',
        address: 'iThum, Noida,',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/5a7c2dd85ac240fc5c15ab109f4ae9b6fb09c385.jpg',
        slug: 'noteg-technologies',
        starting: '5,000',
      },
      {
        name: 'Vatika Business Centre',
        address: 'Sector-62, Noida',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/29dcde8d1a5249901f6a564b5ceb8ec4e08d7af3.jpg',
        slug: 'vatika-business-centre-sector-62-noida',
        starting: '15,000',
      },
    ],
    pune: [
      {
        name: 'Cowork Studio',
        address: 'Bhosale Nagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a5c414302f1a74ef11dcfcb649ebda9d61aca011.jpg',
        slug: 'cowork-studio-shivaji-nagar',
        starting: '6,500',
      },
      {
        name: 'S99cowork Aundh',
        address: 'ITI Road, Aundh',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/996763fca6dc62cb800c5630bb8a924c6a7e0fa0.jpg',
        slug: 's99cowork',
        starting: '4,000',
      },
      {
        name: 'Awfis Baner',
        address: 'The Kode, Pune',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b760f6c91ff5c770904c2cb29e1f27657031d068.jpg',
        slug: 'awfis-baner',
        starting: '5,000',
      },
      {
        name: 'The Hive',
        address: 'Raja Bahadur Mill Rd',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/7c4b1792f7b4a80b606b01b898e8eab78a7f167e.jpg',
        slug: 'the-hive-pune',
        starting: '7,000',
      },
      {
        name: 'Divine Coworking',
        address: 'Near hotel Grillicious',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/88cd5e343dafa34d90e29f70d8ca23008d822b9e.jpg',
        slug: 'divine-hub-coworking-baner',
        starting: '4,500',
      },
      {
        name: 'WeWork Futura',
        address: 'Magarpatta Rd',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8c258cedd592451b435b5fed91fc28ceb73b6a6a.jpg',
        slug: 'wework-futura',
        starting: '9,000',
      },
      {
        name: 'Cowork Studio',
        address: 'Viman Nagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ae0677f52b76190e44ce483ad03c34c3b786d107.jpg',
        slug: 'cowork-studio-viman-nagar',
        starting: '5,000',
      },
    ],
    mumbai: [
      {
        name: 'Dev X Dynasty',
        address: 'Andheri East, Mumbai',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8069d9d3d68c32e73896f3c40b62ab34c87f5a9d.jpg',
        slug: 'devx-dynasty',
        starting: '11,490',
      },
      {
        name: 'Divine hub',
        address: 'Andheri East',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/36a6d0f21142ce26b3838bdc411e0f72f94b933d.jpg',
        slug: 'divine-hub-andheri',
        starting: '9,999',
      },
      {
        name: 'Cowrks Powai',
        address: 'Hiranandani Gardens',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9ceb1e7c1fe97821bd638eb4b1ff66e72763e114.jpg',
        slug: 'cowrks-powai',
        starting: '11,999',
      },
      {
        name: 'Lumos Cowork',
        address: 'Andheri East',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/905e7146355f9ea1bba6d40ad855fbef2d256ff6.jpg',
        slug: 'lumos-andheri-east',
        starting: '7,500',
      },
      {
        name: '91springboard BKC',
        address: 'Santacruz East',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/dadb47b6adf9867be3f916731a7f098ee440258e.jpg',
        slug: '91springboard-bkc',
        starting: '12,200',
      },
      {
        name: 'Workafella',
        address: 'Goregaon west',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/413c2ae689ea576fb2f4f46013787bbee32eb83f.jpg',
        slug: 'workafella-goregaon-west',
        starting: '10,000',
      },
      {
        name: '91springboard Lotus',
        address: 'ANDHERI EAST',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/c5db328d28f30c30414e2bde0eb341a89ec0ea52.jpg',
        slug: '91springboard-lotus',
        starting: '8,000',
      },
    ],
    hyderabad: [
      {
        name: 'Awfis Lorven Tiara',
        address: 'Kondapur, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/691a21586493a4a6ebc91d3d7f5b25edc504af37.jpg',
        slug: 'awfis-lorven-tiara',
        starting: '11,000',
      },
      {
        name: 'Innov8 Srestha Marvel',
        address: 'Sreshta Marvel',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/92193f4d790a9647b39487bf5a3ba8a1891f7ab8.jpg',
        slug: 'innov8-srestha-marvel',
        starting: '5,999',
      },
      {
        name: '91Springboard',
        address: 'Madhapur, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/599d5a100a49a5467169bf2d04b756e6f11d3e43.jpg',
        slug: '91springboard-hitec-city',
        starting: '8,000',
      },
      {
        name: 'CoWrks Skyview',
        address: 'Hitech City, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b0bbcb69d79c956c0c911911e857a1d9f1f98407.jpg',
        slug: 'cowrks-skyview',
        starting: '599',
      },
      {
        name: 'Cokarma Hitech City',
        address: 'Kondapur, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/719df20f61ef64d155dbcb4dcdef64e8e81808de.jpg',
        slug: 'cokarma-kondapur',
        starting: '500',
      },
      {
        name: 'iKeva Madhapur',
        address: 'Madhapur, Hyderabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/cc8668c3e05f5b6638ef5f1b2a50773516a33a1f.jpg',
        slug: 'ikeva-madhapur',
        starting: '7,200',
      },
      {
        name: '91Springboard',
        address: 'KONDAPUR',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ff23e8161d06829f1b26fb0ca1b7302b3380c242.jpg',
        slug: '91springboard-kondapur',
        starting: '8,600',
      },
      {
        name: 'Indiqube Pearl',
        address: 'Hyderabad, Telangana',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ca13f40e55be0c4dddde314cab67dfe8ab06ed4b.jpg',
        slug: 'indiqube-pearl',
        starting: '400',
      },
    ],
    ahmedabad: [
      {
        name: 'DevX Vastrapur',
        address: 'Vastrapur, Ahmedabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/79ec40336ea77c14d3a1ed2171dcf51078dad326.jpg',
        slug: 'devx-ahmedabad',
        starting: '6,500',
      },
      {
        name: 'Karma Workspaces',
        address: 'Shivarth THE ACE',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/09b1c12e3264e7641b1411bb0c564a689769c065.jpg',
        slug: 'karma-workspaces',
        starting: '7,500',
      },
      {
        name: 'Connekt Ahmedabad',
        address: 'Memnagar, Ahmeda..',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/f6817e36e799c995fc8f63700b6f052316d52338.jpg',
        slug: 'connekt-ahmedabad',
        starting: '7,500',
      },
      {
        name: 'Opulence Privilon',
        address: 'Iscon BRT Road',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/cee1a52b4ab38037a3086599e8d96f87d35272e8.jpg',
        slug: 'opulence-privilon',
        starting: '8,500',
      },
      {
        name: '5B Colab Ahmedabad',
        address: 'Vishwabharti society',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/364783ebcfc48e10bae468efe3de7549db0bc7c5.jpg',
        slug: '5b-colab-ahmedabad',
        starting: '6,500',
      },
      {
        name: 'Paragraph',
        address: 'S.G. Highway',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3d1ddc816f331edfe3077f6fb20c50874116e49e.jpg',
        slug: 'paragraph',
        starting: '8,900',
      },
      {
        name: 'The Address',
        address: 'SG Highway, Ahmedabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/02c2e6e719825db8cb398bfb4f769daa562417fa.jpg',
        slug: 'the-address',
        starting: '9,500',
      },
      {
        name: 'Incuspaze The First',
        address: 'Vastrapur, Ahmedabad',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3b0236d071b6b5c46d7f882267487068685cf506.jpg',
        slug: 'incuspaze-the-first',
        starting: '7,000',
      },
    ],
    chennai: [
      {
        name: 'The Hive VR Mall',
        address: 'Thirumangalam',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a9248e14041f3536e7d669126c7ef1fba6521590.jpg',
        slug: 'the-hive-vr-mall-chennai',
        starting: '8,500',
      },
      {
        name: 'Cove @Kottupuram',
        address: 'Chitra Nagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/429de7fadfd4c205a2a5fd141e53b8948cd0d2ae.jpg',
        slug: 'cove-kottupuram',
        starting: '9,500',
      },
      {
        name: 'WOCO Spaces',
        address: 'Shanthi Colony, Anna Nagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/cef6c4582174e93c79d1921ba3dc3ba1c0b22e1a.jpg',
        slug: 'woco-spaces',
        starting: '7,080',
      },
      {
        name: 'CPJK Workspace',
        address: 'Sivan Koil St, Chennai',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3ca889a185872b29c8e0a700a1e7f7bf81c1710c.jpg',
        slug: 'cpjk-workspace',
        starting: '500',
      },
      {
        name: 'Fuel Workspaces',
        address: 'Anna Nagar West',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/65628eff3046569a155a9206253c13175638bc47.jpg',
        slug: 'fuel-workspaces',
        starting: '500',
      },
      {
        name: 'Vsion Tech Park',
        address: 'Anna Salai, Nandhanam',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/895afb76c3738193367fc91ac96969e60b966900.jpg',
        slug: 'vsion-tech-park',
        starting: '300',
      },
      {
        name: 'Hashtag startup',
        address: 'Anna Salai, Chennai',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/22701674e7f282c6de78cf7368f6827b24034246.jpg',
        slug: 'hashtag-startup',
        starting: '290',
      },
      {
        name: 'Karya Space',
        address: 'Nungambakkam High Rd',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/ef9b6cdd0506c3475d3477d9979562eb32f8fa6c.jpg',
        slug: 'karya-space-nungambakkam',
        starting: '450',
      },
    ],
    indore: [
      {
        name: 'Workvistar Zodiac',
        address: 'Scheme No 140',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a49863cb704c9ceae3621b8eeca709bdf877332f.jpg',
        slug: 'workvistar-zodiac-mall',
        starting: '5,000',
      },
      {
        name: 'Work Jar Coworking',
        address: 'Vijay Nagar',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/fb98cb1cc76929a02d716afd27141f049dc1b291.jpg',
        slug: 'work-jar-coworking',
        starting: '350',
      },
      {
        name: 'Lemon Tree Hotel',
        address: 'South Tukoganj',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/38c10ac8c848ebbb4e9b6ecb59b9fb4a18041110.jpg',
        slug: 'lemon-tree-hotel-indore',
        starting: '1,899',
      },
      {
        name: 'Adited Coworking',
        address: 'Satguru Parinay',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/79cb04ff48a91c1039479a6433cdcda04477a3c9.jpg',
        slug: 'adited-coworking-10-ab-rd',
        starting: '299',
      },
      {
        name: 'Incuspaze Metro',
        address: 'AB Rd, Indore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/13f660e0dc2f4f0b39a960da9eac1ff891db4827.jpg',
        slug: 'incuspaze-metro-tower',
        starting: '499',
      },
      {
        name: 'Incuspaze Brilliant',
        address: 'Vijay Nagar, Part-II',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/e3968f9d719e9f59b3bf5e8037ac1df3329da2bd.jpg',
        slug: 'incuspaze-brilliant-platina',
        starting: '499',
      },
      {
        name: 'Incuspaze Princes',
        address: 'AB Rd, Indore',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3d951919efd3a31194f66951440dc9f301fcc53c.jpg',
        slug: 'incuspaze-princes-business-skyline',
        starting: '499',
      },
      {
        name: 'Incuspaze Apollo',
        address: 'Vijay Nagar Square',
        image:
          'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b1702e02cba6a7e8244a54e0e6a58acba5004923.jpg',
        slug: 'incuspaze-indore-apollo',
        starting: '799',
      },
    ],
  };

  service = [
    {
      title: 'High Speed WiFi',
      description: 'High-Speed Wifi, HDTVs everything you need to do your best work.',
      icon: 'amenities/wifi.svg',
    },
    {
      title: 'Comfy Workstation',
      description: 'Connect with other people and share your skills for better and quick growth.',
      icon: 'amenities/workstation.svg',
    },
    {
      title: 'Meeting Rooms',
      description: 'Come up with great ideas and engage in valuable discussions in meeting rooms.',
      icon: 'amenities/meeting-room.svg',
    },
    {
      title: 'Printer',
      description: 'Printing and scanning facilities available without any extra cost.',
      icon: 'amenities/printer.svg',
    },

    {
      title: 'Pantry',
      description: 'Lounge, kitchen, breakout rooms, and more. mix of both work tables and lounge seating.',
      icon: 'amenities/kitchen.svg',
    },
    {
      title: 'Parking',
      description: 'Avoid morning hassle with easy and convenient parking area availability.',
      icon: 'amenities/bike-parking.svg',
    },
  ];

  constructor(
    private brandService: BrandService,
    private bsModalService: BsModalService,
    private configService: ConfigService,
    private seoService: SeoService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private workSpaceService: WorkSpaceService,
    private cdr: ChangeDetectorRef,
    // private mapsAPILoader: MapsAPILoader,
    private toastrService: ToastrService,
  ) {
    // Handle header position on scroll
    // this.configService.updateConfig({ headerClass: 'search-listing' });
    this.queryParams = { ...AppConstant.DEFAULT_SEARCH_PARAMS };
    // Init With Map View
    this.isMapView = true;
    this.cities = AVAILABLE_CITY.filter(city => city.for_coWorking === true);
    this.getCurrentPosition().subscribe((position: any) => {
      this.latitute = position.latitude;
      this.longitute = position.longitude;
      let queryParams = {
        limit: 20,
        latitude: this.latitute,
        longitude: this.longitute,
      };
      this.loadWorkSpacesByLatLong(queryParams);
    });
  }

  ngOnInit() {
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      this.queryParams = { ...this.queryParams, ...params };
      this.page = params['page'] ? +params['page'] : 1;
      this.addSeoTags();
      this.getBrands();
    });
    // this.getPopularWorSpaces();
    this.getPopularWorSpacesAsCountry();
  }

  getCurrentPosition(): any {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: any) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          observer.complete();
        });
      } else {
        observer.error();
      }
    });
  }

  loadWorkSpacesByLatLong(param: {}) {
    this.loading = true;
    this.workSpaceService.getWorkspaces(sanitizeParams(param)).subscribe(allWorkSpaces => {
      this.workSpaces = allWorkSpaces.data;
      this.loading = false;
    });
  }

  routeTodetail(slug: string) {
    this.router.navigate([`/coworking/${slug}`]);
  }

  getBrands() {
    this.brandService.getBrands(sanitizeParams({ type: 'coworking' })).subscribe(res => {
      this.coworkingBrands = res.filter(
        brand => brand.name !== 'others' && brand.name !== 'AltF' && brand.name !== 'The Office Pass',
      );
    });
  }

  openWorkSpace(slug: string) {
    this.router.navigate([`/coworking/${slug.toLowerCase().trim()}`]);
  }

  addSeoTags() {
    this.seoService.getMeta('coworking').subscribe(seoMeta => {
      this.pageTitle = seoMeta.page_title;
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
    });
  }

  openModal(price) {
    this.bsModalService.show(CuratedCityPopupComponent, {
      class: 'modal-dialog-centered',
      initialState: {
        price,
      },
    });
  }

  openModalWithComponent(spaceType: string) {
    const initialState = {
      class: 'modal-dialog-centered',
    };
    initialState['enabledForm'] = true;
    initialState['space'] = spaceType;
    initialState['Interested_in'] = spaceType;
    this.menuModalRef = this.bsModalService.show(HomeMenuModalComponent, {
      initialState,
    });
  }

  locateMyLocation() { }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  getPopularWorSpaces() {
    this.workSpaceService.getPopularWorSpaces().subscribe(spaces => {
      this.popularCoWorkingSpaces = spaces;
      this.cdr.detectChanges();
    });
  }
  getPopularWorSpacesAsCountry() {
    this.workSpaceService
      .popularWorkSpacesCountryWise({ countryId: localStorage.getItem('country_id') })
      .subscribe(spaces => {
        this.popularCoWorkingSpaces = spaces;
        this.cdr.detectChanges();
      });
  }

  openCityListing(slug: any) {
    this.router.navigate(['coworking/' + slug.name]);
  }

  goToBrandPage(brand: Brand, isColiving = false) {
    if (isColiving) {
      this.router.navigate([`/brand/co-living/${brand.slug}`]);
      return;
    }
    this.router.navigate([`/brand/${brand.slug}`]);
  }

  ngOnDestroy() {
    this.configService.setDefaultConfigs();
  }
}
