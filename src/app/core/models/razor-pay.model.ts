export interface RazorPayOption {
  // Razor Pay API Key ID generated from the Razor Pay Dashboard
  key: string;
  // Amount is in currency subunits. Default currency is INR. Hence, 29935 refers to 29935 paise or INR 299.35.
  amount: number;
  currency?: string;
  name?: string;
  description?: string;
  image: string;
  // Order ID is generated as Orders API has been implemented. Refer the Checkout form table given below
  order_id: string;
  handler?: any;
  prefill?: RazorPayPreFillOption;
  notes?: {
    address: string;
  };
  theme: {
    color: string;
  };
  modal?: any;
  recurring?: string;
  customer_id?: string;
}

export interface RazorPayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface RazorPayPreFillOption {
  name: string;
  email: string;
  contact: string;
}
