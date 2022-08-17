export class User {
  id: string;
  name: string;
  password: string;
  email: string;
  gender: string;
  phone_number: string;
  dob: string;
  login_type: 'email';
  token: string;
  is_profile_updated: boolean;
  is_active: boolean;
  otp_expires: string;
}

interface UserName {
  first: string;
  middle: string;
  last: string;
}
