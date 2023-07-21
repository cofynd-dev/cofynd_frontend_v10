export class SubBuilder {
  id: string;
  builder: any;
  name: string;
  description: string;
  overview: Overview = new Overview();
  amenties: Amenity[];
  plans: Plans[] = [];
  currency_code: string;
  country_dbname: string;
  email: string;
  website_Url: string;
  images: Image[] = [];
  social_media: SocialMedia = new SocialMedia();
  seo: SEO = new SEO();
  location: Location = new Location();
  is_active: boolean;
  status: Status;
  slug: string;
  priority: any;
  is_popular: {
    value: boolean;
    order: number;
  };
  user: string;
  createdAt: Date;
  expireAt: Date;
  added_by_user: string;
  geometry: Geometry;
}

export class Amenity {
  id: string;
  category: string;
  name: string;
  icon: string;
}

export class Overview {
  configuration: string;
  build_up_area: string;
  project_type: string;
  project_size: string;
  apartment_design: string;
  is_sale: boolean;
  is_rent: boolean;
  is_rera_approved: boolean;
  is_zero_brokerage: boolean;
}

export class Plans {
  floor_plans: FloorPlan[] = [];
  category_name: String;
  planId: string
  price: string;
  area: string;
}

export class FloorPlan {
  name: String;
  rent_price: string;
  sale_price: string
}

export class Location {
  name: string;
  name1: string;
  floor: string;
  address1: string;
  city: any;
  micro_location: any;
  state: string;
  country: any;
  postal_code: string;
  landmark: string;
  landmark_distance: string;
  ferry_stop_landmark: string;
  ferry_stop_distance: string;
  bus_stop_landmark: string;
  bus_stop_distance: string;
  taxi_stand_landmark: string;
  taxi_stand_distance: string;
  tram_landmark: string;
  tram_distance: string;
  latitude: number;
  longitude: number;
  is_near_metro: boolean;
  is_ferry_stop: boolean;
  is_bus_stop: boolean;
  is_taxi_stand: boolean;
  is_tram: boolean;
  metro_detail: MetroDetail = new MetroDetail();
  address: string;
  shuttle_point: ShuttlePoint = new ShuttlePoint();
  near_by_places: NearBYPlaces[] = [];
}

export class NearBYPlaces {
  lankmark: String;
  distance: String;
  image: any
}

export class MetroDetail {
  name: string;
  is_near_metro: boolean;
  distance: number;
}

export class ShuttlePoint {
  name: string;
  is_near: boolean;
  distance: number;
}

export class Image {
  image: any;
  order: number;
}

export class SocialMedia {
  facebook: string;
  twitter: string;
  instagram: string;
}

export class SEO {
  id: string;
  page_title: string;
  script: string;
  title: string;
  description: string;
  robots: string;
  keywords: string;
  footer_description: string;
  footer_title: string;
  url: string;
  status: boolean;
  path: string;
  twitter: SocialNetworkForSeo = new SocialNetworkForSeo();
  open_graph: SocialNetworkForSeo = new SocialNetworkForSeo();
}

export class SocialNetworkForSeo {
  title: string;
  description: string;
  image: any;
}

export class ContactDetail {
  designation: string;
  name: string;
  phone_number: string;
}

export enum Status {
  PENDING = "pending",
  ENABLE = "approve",
  DISABLE = "reject",
  DELETE = "delete",
}

export enum EnquiryStatus {
  IN_QUEUE = "in-queue",
  FOLLOW_UP = "follow-up",
  RESOLVED = "resolved",
}

export interface Geometry {
  type: 'Point';
  coordinates: any;
}