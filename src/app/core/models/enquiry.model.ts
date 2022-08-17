import { WorkSpace } from './workspace.model';

export class BaseEnquiry {
  interested_in: string;
  no_of_person: number;
  visit_date: string;
  name: string;
  email: string;
  phone_number: string;
}
export class Enquiry extends BaseEnquiry {
  work_space: string;
  office_space?: string;
  living_space?: string;
}

export class UserEnquiry extends BaseEnquiry {
  work_space: WorkSpace;
}
