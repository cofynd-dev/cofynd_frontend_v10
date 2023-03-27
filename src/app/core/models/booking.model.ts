import { WorkSpace } from '@core/models/workspace.model';

export class BaseBooking {
  count: number;
  currency?: 'INR';
  from?: string;
  to?: string;
  month?: number;
  category: string;
  visitors: Visitor[];
}

export class Booking extends BaseBooking {
  work_space: string;
}

export class UserBooking extends BaseBooking {
  work_space: WorkSpace;
  amount: number;
}

export interface Visitor {
  name: string;
  email: string;
}

export class Payment {
  order_id: string;
  booking_id: string;
  amount: number;
}

export class Order {
  booking_id: string;
  payment_id: string;
  amount: number;
}

export interface PaymentDetail {
  category: string;
  status: string;
  order: string;
  amount: number;
  count: number;
  from: string;
  to: string;
  work_space: string;
  user: string;
  added_on: string;
  updated_on: string;
  payment: string;
  id: string;
}
