import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AVAILABLE_CITY_VIRTUAL_OFFICE } from '@app/core/config/cities';
import { Brand } from '@app/core/models/brand.model';
import { SeoSocialShareData } from '@app/core/models/seo.model';
import { BrandService } from '@app/core/services/brand.service';
import { SeoService } from '@app/core/services/seo.service';
import { sanitizeParams } from '@app/shared/utils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { forkJoin } from 'rxjs';
import { VirtualOfficeModalComponent } from './virtual-office-modal/virtual-office-modal.component';

@Component({
  selector: 'app-virtual-office',
  templateUrl: './virtual-office.component.html',
  styleUrls: ['./virtual-office.component.scss']
})
export class VirtualOfficeComponent implements OnInit {
  menuModalRef: BsModalRef;
  coworkingBrands: Brand[] = [];
  coLivingBrands: Brand[] = [];
  seoData: SeoSocialShareData;
  cities = AVAILABLE_CITY_VIRTUAL_OFFICE.filter(city => city.for_virtualOffice === true);
  service = [
    {
      title: "Company Registration",
      description: "Register your company in your desired city without having any physical address there.",
      icon: "workspace/day-pass.svg"
    },
    {
      title: "Meeting Room Access",
      description: "Get free complimentary hours of meeting rooms every month for client meetings.",
      icon: "amenities/meeting-room.svg"
    },
    {
      title: "GST Registration",
      description: "Get a GST number for your company with all documents like NOC, Signage, Electricity Bill & more.",
      icon: "workspace/hot-desk.svg"
    },
    {
      title: "Mailing Address",
      description: "Collect all couriers at your virtual office address and forwarded them to the address given by you.",
      icon: "workspace/dedicated-desk.svg"
    },
    {
      title: "Business Address",
      description: "Get your business address in the prestigious location and mention it on your visiting card and website.",
      icon: "workspace/private-cabin.svg"
    },
    {
      title: "Reception Services",
      description: "Get reception services for client handling, guest greeting and customer support.",
      icon: "amenities/reception.svg"
    },
  ]

  popularVirtualOffice = [
    {
      // address: 'Delhi',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8d5c421e7cb218a73798507ddaeb27964e7e3df9.jpg',
      name: 'Delhi',
      price: '15,500',
      slug: "virtual-office/delhi"
    },
    {
      // address: 'Gurugram',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/dfddcbb0cadf3df205d9ee3e6a47c03f27e0df16.jpg',
      name: 'Gurugram',
      price: '18,000',
      slug: "virtual-office/gurugram"
    },
    {
      // address: `Noida`,
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/b8dffaef4e7bc6d43b24af2ce95def9ac5769631.jpg',
      name: 'Noida',
      price: '15,500',
      slug: "virtual-office/noida"
    },
    {
      // address: 'Bangalore',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/6fc88348b18f4e1ccd4c276f339fcd34db5760ad.jpg',
      name: 'Bangalore',
      price: '12,000',
      slug: "virtual-office/bangalore"
    },
    {
      // address: 'Hyderabad',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/3bb526e232c21916cbe79664eb0acc86ef2a83c0.jpg',
      name: 'Hyderabad',
      price: '18,000',
      slug: "virtual-office/hyderabad"
    },
    {
      // address: 'Mumbai',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/8069d9d3d68c32e73896f3c40b62ab34c87f5a9d.jpg',
      name: 'Mumbai',
      price: '11,988',
      slug: "virtual-office/mumbai"
    },
    {
      // address: 'Chennai',
      image: 'https://cofynd-staging.s3.ap-south-1.amazonaws.com/images/original/59fc8cbecde3c4a14320ab01a12b1c43945a7dea.jpg',
      name: 'Chennai',
      price: '12,000',
      slug: "virtual-office/chennai"
    },
    // {
    //   address: ' ',
    //   image: ' ',
    //   name: ' ',
    //   price: ' ',
    // },
  ];

  constructor(
    private bsModalService: BsModalService,
    private brandService: BrandService,
    private seoService: SeoService,
    private router: Router,
  ) { }

  ngOnInit() {
    forkJoin([
      this.brandService.getBrands(sanitizeParams({ type: 'coworking' })),
      this.brandService.getBrands(sanitizeParams({ type: 'coliving' })),
    ]).subscribe(res => {
      this.coLivingBrands = res[1];
      this.coworkingBrands = res[0].filter(
        brand => brand.name !== 'others' && brand.name !== 'AltF' && brand.name !== 'The Office Pass',
      );
    });
    this.addSeoTags()
  }


  addSeoTags() {
    let seoMeta = {
      title: "Virtual Office in India - Space for GST & Business Registration",
      description: "Virtual Office in India starting ₹1,000 per month offering in 10 Indian cities - Delhi, Noida, Gurgaon, Bangalore, Hyderabad, Pune, Mumbai, Indore, Ahmedabad, Chennai."
    }
    if (seoMeta) {
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

  openModalWithComponent(spaceType: string,) {
    const initialState = {
      class: 'modal-dialog-centered',
    };
    initialState['enabledForm'] = true;
    initialState['space'] = spaceType;
    initialState['Interested_in'] = spaceType;
    this.menuModalRef = this.bsModalService.show(VirtualOfficeModalComponent, {
      initialState,
    });
  }

  openWorkSpace(slug: string) {
    this.router.navigate([`/virtual-office/${slug.toLowerCase().trim()}`]);
  }
}