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
}
