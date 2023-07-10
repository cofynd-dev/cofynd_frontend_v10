import { WorkSpace } from './workspace.model';
export class OfficeSpace extends WorkSpace {
  other_detail: OfficeSpaceOtherDetail;
}

export class OfficeSpaceOtherDetail {
  area_for_lease_in_sq_ft: number;
  building_name: string;
  how_to_reach: string;
  rent_in_sq_ft: number;
  office_type: string;
  security_deposit: string;
  facilities: [
    {
      name: string;
      value: string;
    },
  ];
  beds: number;
  breakfast: FoodOption;
  dinner: FoodOption;
  lunch: FoodOption;
  food_and_beverage: string;
  is_electricity_bill_included: boolean;
  rent_per_bed: number;
  type_of_co_living: string;
  options: {
    zoom: number;
  };
}

export class FoodOption {
  is_include: boolean;
  price: number;
}
