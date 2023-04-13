import { SeoMeta } from './seo.model';
import { Brand } from '@core/models/brand.model';
import { City } from './city.model';
export class WorkSpace {
  id: string;
  name: string;
  country_dbname: string;
  currency_code: string;
  description: string;
  email: string;
  website_Url: string;
  location: Location;
  facilities: Facility;
  image: string;
  images: Image[];
  likes: [];
  status: string;
  plans: Plan[];
  coliving_plans: [];
  seats: number;
  price?: any;
  // display_price: number;
  is_favorite: boolean;
  price_type: string;
  starting_price: number;
  show_price: boolean;
  amenties: Amenity[];
  rooms: [];
  contact_details: [];
  no_of_seats: number;
  geometry: Geometry;
  slug: string;
  brand: Brand;
  hours_of_operation: { [key: string]: WorkingHours };
  seo: SeoMeta;
  space_type?: string;
  options: {
    zoom: number;
  };
}

export class WorkingHours {
  should_show: boolean;
  is_closed: boolean;
  is_open_24: boolean;
  from: string;
  to: string;
}

export class WorkingDays {
  day: string;
  time: WorkingHours;
}

export class Location {
  name: string;
  floor: number;
  address: string;
  address1: string;
  address2: string;
  city: City;
  micro_location: MicroLocation;
  state: string;
  country: string;
  postal_code: string;
  landmark: string;
  landmark_distance: string;
  latitude: number;
  longitude: number;
  metro_detail: {
    distance: number;
    is_near_metro: boolean;
    name: string;
  };
  shuttle_point: {
    distance: number;
    is_near: boolean;
    name: string;
  };
}

export class MicroLocation {
  id: string;
  icon: string;
  name: string;
  for_coWorking: boolean;
  for_office: boolean;
  for_coLiving: boolean;
}


export class Facility {
  desks: number;
  lounge: number;
  table: number;
}

export class Amenity {
  id: string;
  category: string;
  name: string;
  icon: string;
}

export class Plan {
  duration?: string;
  number_of_items?: number;
  _id?: string;
  category: string;
  price: number;
  should_show?: boolean;
}

export class Image {
  order: number;
  image: {
    id: string;
    name: string;
    real_name: string;
    s3_link: string;
    title: string;
    alt?: string;
  };
}

export interface Geometry {
  type: 'Point';
  coordinates: any;
}

export interface PriceFilter {
  minPrice: number;
  maxPrice: number;
  postTitle?: string;
  preTitle?: string;
  isTitle?: boolean;
  postTitleSign?: boolean;
}

export interface SizeFilter {
  minSize: number;
  maxSize: number;
  postTitle?: string;
  preTitle?: string;
  isTitle?: boolean;
}

export enum WorkSpacePlan {
  HOT_DESK = 'hot-desk',
  DEDICATED_DESK = 'dedicated-desk',
  DAY_PASS = 'day',
  PRIVATE_CABIN = 'private-cabin',
  VIRTUAL_OFFICE = 'virtual-office',
}

export enum WorkSpacePlanType {
  'hot-desk' = 'hot desk',
  'Day Pass' = 'Day Pass',
  'private-cabin' = 'private cabin',
  'dedicated-desk' = 'dedicated desk',
  'dedicated-pass' = 'dedicated pass',
  'virtual-office' = 'virtual office',
}
