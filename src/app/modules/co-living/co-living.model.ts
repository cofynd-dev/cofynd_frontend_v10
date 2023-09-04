import { OfficeSpace } from '@core/models/office-space.model';

export class CoLiving extends OfficeSpace {
  coliving_plans: [];
  price: {
    double_sharing: number;
    single_sharing: number;
    studio_apartment: number;
    triple_sharing: number;
  };
  sleepimg: any;
  duration: any;
  space_contact_details: Space_Contact_Details = new Space_Contact_Details();
}

export class Space_Contact_Details {
  name: string;
  email: string;
  phone: string;
  show_on_website: boolean
}
