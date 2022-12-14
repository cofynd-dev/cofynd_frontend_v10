import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AVAILABLE_CITY } from '@app/core/config/cities';
import { Brand } from '@app/core/models/brand.model';
import { City } from '@app/core/models/city.model';
import { SeoSocialShareData } from '@app/core/models/seo.model';
import { BrandService } from '@app/core/services/brand.service';
import { SeoService } from '@app/core/services/seo.service';
import { sanitizeParams } from '@app/shared/utils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { OfficeSpaceModalComponent } from './office-space-modal/office-space-modal.component';
import { OfficeSpace } from '@core/models/office-space.model';
import { Observable, Subscriber } from 'rxjs';
import { OfficeSpaceService } from './office-space.service';
declare var $: any;

@Component({
  selector: 'app-office-space',
  templateUrl: './office-space.component.html',
  styleUrls: ['./office-space.component.scss', '../virtual-office/virtual-office.component.scss'],
})
export class OfficeSpaceComponent implements OnInit {
  menuModalRef: BsModalRef;
  cities: City[];
  coworkingBrands: Brand[] = [];
  coLivingBrands: Brand[] = [];
  latitute: any;
  longitute: any;
  offices: OfficeSpace[];
  loading: boolean;

  constructor(
    private seoService: SeoService,
    private router: Router,
    private bsModalService: BsModalService,
    private brandService: BrandService,
    private officeSpaceService: OfficeSpaceService,
  ) {
    this.cities = AVAILABLE_CITY.filter(city => city.for_office === true);
    this.loading = true;
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
    this.officeSpaceService.getOffices(sanitizeParams(param)).subscribe(allWorkSpaces => {
      this.offices = allWorkSpaces.data;
      this.loading = false;
    });
  }

  service = [
    {
      title: 'Long Lease',
      description: 'We want to support your business for a long run and that’s why we offer long lease office spaces.',
      icon: 'office-space/icons8-term-100.png',
    },
    {
      title: 'Fixed Rental',
      description: 'We ensure the most reasonable price offered after a good negotiation done by our space experts.',
      icon: 'office-space/no-booking-fee.svg',
    },
    {
      title: 'Approved space',
      description:
        'Our dedicated team visits each and every space and inspect thoroughly to provide you with the best.',
      icon: 'office-space/security.svg',
    },
    {
      title: 'Flexible Terms',
      description: 'We have all flexible terms to grow your business in every possible way.',
      icon: 'office-space/icons8-terms-and-conditions-100 copy.png',
    },
    {
      title: 'Fully Furnished',
      description: 'Working in a fully-furnished office space is a privilege which can save you a lot of bucks.',
      icon: 'office-space/icons8-armchair-100 copy.png',
    },
    {
      title: '24/7 Support',
      description: "CoFynd's Expert team is available 24*7 for your any doubts or queries.",
      icon: 'office-space/icons8-online-support-100.png',
    },
  ];

  seoData: SeoSocialShareData = {
    title: 'Office Space for Rent in India | Office Space in India',
    description:
      'Find the perfect commercial office space for rent in 7 Indian cities with all office space options, ZERO BROKERAGE and high-end amenities.',
    image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
    type: 'website',
  };

  centerCity = [
    {
      name: 'delhi',
      title: 'The National Capital',
      img: 'delhi.jpg',
    },
    {
      name: 'noida',
      title: 'The Hitech City',
      img: 'wtc.jpg',
    },
    {
      name: 'bangalore',
      title: "India's Silicon Valley",
      img: 'bangalore-ofcc.jpg',
    },
    {
      name: 'pune',
      title: 'Queen of the Deccan',
      img: 'pune.jpg',
    },
    {
      name: 'hyderabad',
      title: 'A City of Nawabs',
      img: 'hyderabad.jpg',
    },
    {
      name: 'mumbai',
      title: 'A City of Dreams',
      img: 'mumbai.jpg',
    },
  ];

  popularOfficeCities = [
    {
      address: 'A Millennium City',
      id: '5fbc9ffcc2502350f250363f',
      image: '../../../assets/images/co-living/gurgaon-ofcc.jpg',
      name: 'Gurgaon',
      slug: 'gurugram',
    },
    {
      address: 'The Nation Capital',
      id: '5fbc9ffcc2502350f250363f',
      image: '../../../assets/images/co-living/delhi.jpg',
      name: 'Delhi',
      slug: 'delhi',
    },
    {
      address: 'The Hitech city',
      id: '5fbc9ffcc2502350f250363f',
      image: '../../../assets/images/co-living/wtc.jpg',
      name: 'Noida',
      slug: 'noida',
    },
    // {
    //   address: `India's Silicon Valley`,
    //   id: '5fbc9ffcc2502350f250363f',
    //   image: '../../../assets/images/co-living/bangalore-ofcc.jpg',
    //   name: 'Bangalore',
    //   slug: 'bangalore',
    // },
    // {
    //   address: 'A City of Nawabs',
    //   id: '5fbc9ffcc2502350f250363f',
    //   image: '../../../assets/images/co-living/hyderbad.jpg',
    //   name: 'Hyderabad',
    //   slug: 'hyderabad',
    // },
    // {
    //   address: 'A City of Dreams',
    //   id: '5fbc9ffcc2502350f250363f',
    //   image: '../../../assets/images/co-living/mumbai2.jpg',
    //   name: 'Mumbai',
    //   slug: 'mumbai',
    // },
    // {
    //   address: 'Queen of the Deccan',
    //   id: '5fbc9ffcc2502350f250363f',
    //   image: '../../../assets/images/co-living/pune.jpg',
    //   name: 'Pune',
    //   slug: 'pune',
    // },
    // {
    //   address: 'Paradise of South Asia',
    //   id: '5fbc9ffcc2502350f250363f',
    //   image: '../../../assets/images/co-living/goa.jpg',
    //   name: 'Goa',
    //   slug: 'goa',
    // },
  ];

  popularOfficeSpaces = [
    {
      name: 'Fully Furnished office space in DLF towers',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/a40e94aae9b15ed91b0b90d38075e92a3ccf97ad.jpg',
      address: 'Jasola, Delhi',
      slug: '1821-sqft-fully-furnished-dlf-towers',
    },
    {
      name: 'JMD Megapolis',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/58c9f6a1f91e5191820119042d38b03d49b6ca0b.jpg',
      address: 'Sector 48, Gurugram',
      slug: '1421-sqft-fully-furnished-jmd-megapolis-1',
    },
    {
      name: 'Advant Navis Business Park',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/9bbab82feaa4fd65641aa17a3f8278f9f6be4330.jpg',
      address: 'Sector 142, Noida',
      slug: '6619-sqft-fully-furnished-advant-navis-business-park',
    },
    {
      name: 'Helenzys Inc',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/649f39dfec289e6f4a43534d21ce13dc5ac92ec7.jpg',
      address: 'HSR Layout, Bangalore',
      slug: '5506-sqft-fully-furnished-helenzys-inc',
    },
    {
      name: 'Blue Dawn',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6f2ea4e6750559b61186628611435aaa41385182.jpg',
      address: 'Gachibowli, Hyderabad',
      slug: '12000-sqft-raw-blue-dawn',
    },
    {
      name: ' ',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/2fd3a8f2496cb5c4089e5ad62b9b36d8b968d34d.jpg',
      address: 'Mumbai',
      slug: ' ',
    },
    {
      name: 'Fortaleza Complex',
      image:
        'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/17f5e274721d14ee70cc94d9c5f5fe0082c4440c.jpg',
      address: 'Kalyani Nagar, Pune',
      slug: '4200-sqft-fully-furnished-fortaleza-complex',
    },
    // {
    //   name: ' ',
    //   image: ' ',
    //   address: ' ',
    //   slug: ' ',
    // },
  ];

  footer_title = 'Office Spaces for Rent in India';
  footer_description = `<p>For commercial office spaces, India is a ready to go destination for startups, SMEs and Fortune 500 companies. Office space is a space that is completely split apart from other companies. In comparison to other spaces, these offer more control, solitude to its members and peaceful working surroundings.</p>

  <p>Commercial Office spaces in India provides abundant advantages to its members like-&nbsp;</p>
  
  <p><strong>Privacy:</strong> An office space provides the much needed privacy for crucial company related discussions and work.&nbsp;</p>
  
  <p><strong>Concentration: </strong>There is an absence of disturbance in an office space. Hence, there is a possibility of increased concentration for work also which helps to increase the efficiency of the members.&nbsp;</p>
  
  <p><strong>Healthy Atmosphere: </strong>Rental Office spaces in India offer better lighting, ventilation and cooling atmosphere as compared to other spaces.&nbsp;</p>
  
  <p><strong>Low overhead costs: </strong>Office space lessens costs with access to all the basic amenities required for business efficiency. With the availability of free equipment, there is more space to expand and employee motivation to shoot up.</p>
  
  <p><strong>Frequent cleaning: </strong>A commercial office space is tidier and less crowded. Congestion is usually eliminated in these spaces.</p>
  
  <p><strong>Loaded with amenities:</strong> Office space offers a multitude of amenities like high-speed internet, frequent sanitization, mailing services, reception staff, IT support, furnished rooms, events space, car parking, kitchen area, strict security system and more.&nbsp;</p>
  
  <p><strong>Fosters Teamwork: </strong>A real office setting can boost productivity and connection between employees, allowing overall teamwork and collaboration. &nbsp;</p>
  
  <h2><span>Types of Office Spaces in India</span></h2>
  
  <p><strong>Serviced Office:</strong> A serviced office space is a ready to move in space. It is fully furnished with provision of all amenities, so a company just needs to pack up and settle in- as easy as that!&nbsp;These spaces are suitable for larger businesses which require a flexible space to operate on.&nbsp;</p>
  
  <p><strong>Managed Offices:</strong> These spaces are also known as customisable or bespoke offices. They are an alternative to serviced office spaces with a third party looking after the operations. Additionally, they offer an all inclusive monthly fee, with much more flexibility and freedom.&nbsp;</p>
  
  <p>All in all, a managed office can be designed to specific requirements- from start to finish. They are most suitable for small scale businesses, startups, SMEs which are searching to have a customised space, without any trouble and upfront costs.&nbsp;</p>
  
  <p><strong>Leased Offices:</strong> In a leased office, a tenant has all the responsibilities of furnishing, installing their own internet connection, partition for cabins and more. The initial costs of organising the offices are hence higher than others. These spaces are taken for a period of 5 to 10 years and thus the costs reduce all throughout this time. So, they are a solution for more established businesses who want to have a control over their expenses and create office space as per their need.&nbsp;</p>
  
  <p><strong>Subleased Offices:</strong> A subleased office offers a tenant to obtain a leased office for a shorter but more flexible span of time. Members of such spaces are benefitted from the similar advantages as leased spaces but at budget-friendly prices.&nbsp;</p>
  
  <h2><span>Popular Office Spaces Cities in India</span>&nbsp;</h2>
  
  <p>India is a hub of office spaces where more and more businesses are opting for such spaces. Cities where office spaces are much in demand are as follows-</p>
  
  <p><a href="https://cofynd.com/office-space/rent/delhi"><strong>Delhi:</strong></a> The capital city of India provides ample opportunities to individuals opting to work from office spaces. The city is a mixture of IT, telecommunications, education and finance businesses.&nbsp;</p>
  
  <p><strong><a href="https://cofynd.com/office-space/rent/gurugram">Gurgaon</a>:</strong> Work in Gurgaon, the super financial and technological hub in the northern part of India. office spaces are a hit here with major businesses and 500 Fortune companies operating from here.&nbsp;</p>
  
  <p><a href="https://cofynd.com/office-space/rent/bangalore"><strong>Bangalore:</strong></a> Fondly known as the Silicon Valley of India, Bangalore is a major technological hub and India’s leading IT exporter. The concept of office spaces is no more new with multinational corporations choosing to work from here.&nbsp;</p>
  
  <p><a href="https://cofynd.com/office-space/rent/mumbai"><strong>Mumbai:</strong> </a>Mumbai is the financial hub of India. It houses diverse industries, from film to jewellery- there’s all. office spaces in the city help to build further connections and work efficiently in a dynamic environment.&nbsp;</p>
  
  <p><a href="https://cofynd.com/office-space/rent/pune"><strong>Pune:</strong></a> Pune is a home to major technology startups, IT, education and manufacturing companies. With easy transport services to Mumbai and nearby cities, Pune provides a great platform for office spaces to grow.&nbsp;</p>
  
  <p><a href="https://cofynd.com/office-space/rent/noida"><strong>Noida:</strong></a> Noida is a popular technological and IT hub of India. The city is a favourite destination of office spaces with major software companies opting to work from here.&nbsp;</p>
  
  <p>While these cities must be the initial ones to give an excellent platform to office spaces to nurture, others like Ahemdabad, Indore, Chandigarh, Lucknow, Dehradun, Chennai and Kolkata are also preparing for the same.&nbsp;</p>
  
  <h2><span>Why choose CoFynd for Office Spaces for Rent in India?</span></h2>
  
  <p>In India, the office space industry is rapidly growing- there are over millions of such spaces around India today! With so many factors to keep in mind when searching for the perfect space, the search can become exhaustive sometimes.&nbsp;</p>
  
  <p>CoFynd is a technology enabled platform that offers the best office spaces across multiple cities of India. Our present-day booking engine has a long list of verified office spaces in India. We have a system in place that makes searching, booking, and paying for your space in a smooth, dependable and exciting way. One can book an office space according to their latest needs and preferences.&nbsp;</p>
  
  <p>We have brought all the crucial resources and facilities for one’s team to enjoy in an office space. Our range of amenities are suitable for people looking to level up their game in a short span of time. From a speedy internet connection to serving refreshments, we have a plethora of facilities to level up your office experience. You come to our spaces to work and we will take care of the rest.&nbsp;</p>
  
  <p>Our office space memberships let you take advantage of opportunities to interact with millions of other members. Get guidance from a senior team, collaborate with a fellow team mate, or simply get motivated by the surrounding community. There is always a new thing to learn and grow from in an office space setup.</p>
  
  <p>As India’s largest platform offering office spaces in India- we understand your needs for a perfect space- giving you options that offer the best of amenities and experiences.&nbsp;</p>
  
  <p>All in all, our rental office spaces in India allow companies to reach employees distributed across the world and bring all the crucial resources together. With all the budget-friendly pricing schemes, we serve spaces such that businesses can reduce their costs and gain higher efficiency.&nbsp;</p>`;

  ngOnInit() {
    if (this.seoData) {
      this.addSeoTags(this.seoData);
    }

    forkJoin([
      this.brandService.getBrands(sanitizeParams({ type: 'coworking' })),
      this.brandService.getBrands(sanitizeParams({ type: 'coliving' })),
    ]).subscribe(res => {
      this.coLivingBrands = res[1];
      this.coworkingBrands = res[0].filter(
        brand => brand.name !== 'others' && brand.name !== 'AltF' && brand.name !== 'The Office Pass',
      );
    });
  }

  removedash(name: string) {
    return name.replace(/-/, ' ');
  }

  addSeoTags(seoMeta) {
    if (seoMeta) {
      // this.pageTitle = seoMeta.page_title;
      this.seoData = {
        title: seoMeta.title,
        image: 'https://cofynd.com/assets/images/meta/cofynd-facebook.jpg',
        description: seoMeta.description,
        type: 'website',
      };
      this.seoService.setData(this.seoData);
    } else {
      this.seoData = null;
    }
  }

  openModalWithComponent(spaceType: string) {
    const initialState = {
      class: 'modal-dialog-centered',
    };
    initialState['enabledForm'] = true;
    initialState['space'] = spaceType;
    initialState['Interested_in'] = spaceType;

    this.menuModalRef = this.bsModalService.show(OfficeSpaceModalComponent, {
      initialState,
    });
  }

  openCityListing(city: string) {
    this.router.navigate([`/office-space/rent/${city.toLowerCase().trim()}`]);
    localStorage.removeItem('officeType');
  }
  onClick(spaceType: string) {
    localStorage.setItem('officeType', spaceType);
  }
  openWorkSpace(slug: string) {
    this.router.navigate([`/office-space/rent/${slug.toLowerCase().trim()}`]);
    $('#curated_coliving').modal('hide');
  }

  openAdd() {
    this.router.navigate([`coworking/roseate-house-aerocity-new-delhi`]);
  }

  scrollToElement(element: HTMLElement) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
}
