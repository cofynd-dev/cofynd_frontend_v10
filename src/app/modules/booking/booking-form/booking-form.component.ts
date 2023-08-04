import { isPlatformBrowser } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { CoLivingService } from '@app/modules/co-living/co-living.service';
import { getNumberOfDays } from '@app/shared/utils';
import { Booking, Order, Payment } from '@core/models/booking.model';
import { RazorPayOption, RazorPayResponse } from '@core/models/razor-pay.model';
import { User } from '@core/models/user.model';
import { Plan, WorkSpace, WorkSpacePlan } from '@core/models/workspace.model';
import { AuthService } from '@core/services/auth.service';
import { LazyLoadingScriptService } from '@core/services/lazy-load-script.service';
import { PaymentService } from '@core/services/payment.service';
import { WindowRef } from '@core/services/window-ref.service';
import { WorkSpaceService } from '@core/services/workspace.service';
import { environment } from '@env/environment';
import { CustomValidators } from '@shared/validators/custom-validators';
import { BsDaterangepickerInlineConfig } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';

declare let ga: any;

@Component({
  selector: 'app-booking-form',
  templateUrl: './booking-form.component.html',
  styleUrls: ['./booking-form.component.scss'],
})
export class BookingFormComponent implements OnInit {
  bookingForm: FormGroup;
  workspaceId: string;
  enquiryType: string;
  workSpace: WorkSpace;
  workspacePlan: Plan;
  user: User;

  // For Date
  bsConfig: Partial<BsDaterangepickerInlineConfig>;
  bsConfigForOther: Partial<BsDaterangepickerInlineConfig>;
  minDate = new Date();
  isDateSelected: boolean;

  visitorCount = 1;
  paymentCounts = new Array(1);
  numberOfDays: number;
  numberOfMonths: number;

  // Payment Related
  bookingId: string;
  orderTotalInPaisa: number;
  isPaymentLoader: boolean;
  isPricePerDay: boolean = true;
  toDate: Date;
  coworkingList: string[] = ['day-pass', 'hot-desk', 'dedicated-desk'];

  constructor(
    @Inject(PLATFORM_ID) private platformId: any,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private windowRefService: WindowRef,
    private lazyLoadingScriptService: LazyLoadingScriptService,
    private authService: AuthService,
    private workSpaceService: WorkSpaceService,
    private coLivingService: CoLivingService,
    private paymentService: PaymentService,
    private toastrService: ToastrService,
    private changeDetectorRef: ChangeDetectorRef,
  ) {
    this.bsConfig = Object.assign(
      {},
      {
        containerClass: 'custom-datepicker booking-calender',
        showWeekNumbers: false,
        isAnimated: true,
        rangeInputFormat: 'MMMM Do YYYY',
        displayMonths: 2,
      },
    );

    this.bsConfigForOther = Object.assign(
      {},
      {
        containerClass: 'custom-datepicker booking-calender',
        showWeekNumbers: false,
        isAnimated: true,
        dateInputFormat: 'MMMM Do YYYY',
        displayMonths: 1,
      },
    );

    // Load Workspace Detail
    this.activatedRoute.queryParams.subscribe((params: Params) => {
      if (params.workspace) {
        this.workspaceId = params.workspace;
        const interestedIn = params.interestedIn.split('-').join(' ');
        this.isPricePerDay = params.interestedIn == WorkSpacePlan.DAY_PASS ? true : false;
        this.enquiryType = this.toTitleCase(interestedIn);
        if (this.coworkingList.indexOf(params.interestedIn) >= 0) {
          this.loadWorkSpace(this.workspaceId);
        } else {
          this.loadCoLivingSpace();
        }
      } else {
        this.toastrService.error('Workspace is not available', 'Workspace Not Found');
        this.router.navigate(['/']);
      }
      this.buildForm();
    });
  }

  ngOnInit() {
    // Include RazorPay Script
    this.lazyLoadingScriptService.lazyLoadLibrary('https://checkout.razorpay.com/v1/checkout.js').subscribe();

    // Check user authentication
    if (this.isAuthenticated()) {
      this.user = this.authService.getLoggedInUser();
      this.bookingForm.patchValue(this.user);
    }
  }

  toTitleCase = phrase => {
    return phrase
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  onSubmit() {
    this.bookingForm.markAllAsTouched();
    // stop here if form is invalid
    if (this.bookingForm.invalid) {
      return;
    }

    const formValues = this.bookingForm.value;
    const bookingPayload: Booking = {
      count: this.visitorCount,
      category: this.workspacePlan.category,
      visitors: formValues.visitors,
      work_space: this.workSpace.id,
      from: formValues.date[0] || formValues.date,
      to: formValues.date[1] || this.toDate,
    };

    if (!this.isPricePerDay) {
      bookingPayload.month = formValues.month;
    }

    this.isPaymentLoader = true;
    this.paymentService.createOrder(bookingPayload).subscribe(
      orderInfo => {
        this.bookingId = orderInfo.booking_id;
        this.initiatePaymentWithRazorPay(orderInfo);
        this.sendGaEvent('BOOKING_PAYMENT_INITIATED', 'click', 'PAYMENT_INITIATED');
      },
      error => this.toastrService.error(error.message),
    );

    this.sendGaEvent('BOOKING_FORM_SUBMIT', 'submit', 'FORM_DATA_SUBMIT');
  }

  initiatePaymentWithRazorPay(order: Payment) {
    // Amount in Paisa
    this.orderTotalInPaisa = order.amount * 100;
    // Set Razorpay Option
    const RAZORPAY_OPTIONS: RazorPayOption = {
      key: environment.keys.RAZOR_PAY,
      amount: this.orderTotalInPaisa,
      order_id: order.order_id,
      name: 'CoFynd',
      description: `Payment For ${this.enquiryType} Booking`,
      image: '/assets/images/payment-logo.png',
      theme: {
        color: '#4343e8',
      },
      prefill: {
        name: this.user.name,
        contact: this.user.phone_number,
        email: this.user.email,
      },
      modal: {},
    };

    RAZORPAY_OPTIONS.modal.ondismiss = () => {
      this.isPaymentLoader = false;
      this.changeDetectorRef.detectChanges();
    };

    RAZORPAY_OPTIONS.handler = this.razorPaySuccessHandler.bind(this);
    const razorpay = new this.windowRefService.nativeWindow.Razorpay(RAZORPAY_OPTIONS);
    razorpay.open();
  }

  razorPaySuccessHandler(response: RazorPayResponse) {
    const order: Order = {
      booking_id: this.bookingId,
      payment_id: response.razorpay_payment_id,
      amount: this.orderTotalInPaisa,
    };
    this.paymentService.capturePayment(order).subscribe(
      () => {
        this.onPaymentSuccess();
      },
      error => this.toastrService.error(error.message),
    );
  }

  onPaymentSuccess() {
    this.toastrService.success('Your order has been placed', 'Order Placed');
    this.isPaymentLoader = false;
    this.sendGaEvent('BOOKING_PAYMENT_SUCCESS', 'click', 'PAYMENT_SUCCESS');
    this.sendGaPaymentTransaction(this.bookingId, this.orderTotalInPaisa / 100);
    this.router.navigate(['transaction-success']);
  }

  onChangeDate(value: Date[]) {
    if (value) {
      const fromDate = new Date(value[0]);
      const toDate = new Date(value[1]);
      this.isDateSelected = true;
      this.numberOfDays = getNumberOfDays(fromDate, toDate);
    }
  }

  onChangeDateForOther(value: Date) {
    if (value) {
      const formValues = this.bookingForm.value;
      var fromDate = new Date(value);
      this.toDate = new Date(fromDate.setDate(fromDate.getDate() + 30 * formValues.month));
    }
  }

  onChangeVisitors(count: number) {
    this.visitorCount = count;
    this.paymentCounts = new Array(count);
  }

  onChangeMonth(value) {
    this.numberOfMonths = value;
    this.toDate = null;
    this.bookingForm.controls['date'].reset();
  }

  addGst(isMonth = false) {
    const value = isMonth ? this.numberOfMonths : this.numberOfDays;
    return (this.workspacePlan.price * value * 18) / 100;
  }

  addMoreVisitor() {
    if (this.visitors.length < this.visitorCount) {
      this.visitors.push(
        this.formBuilder.group({
          name: [''],
          email: ['', [CustomValidators.emailValidator]],
        }),
      );
    }
  }

  removeVisitor(index: number) {
    this.visitors.removeAt(index);
  }

  loadWorkSpace(id: string) {
    this.workSpaceService.getWorkspace(id).subscribe(workspaceData => {
      this.workSpace = workspaceData;
      const planType = this.enquiryType
        .toLocaleLowerCase()
        .split(' ')
        .join('-');
      this.workspacePlan = this.workSpace.plans.filter((plan: Plan) => plan.category === planType)[0];
    });
  }

  loadCoLivingSpace() {
    this.coLivingService.getCoLiving(this.workspaceId).subscribe(coliving => {
      this.workSpace = coliving;
      const planType = this.enquiryType
        .toLocaleLowerCase()
        .split(' ')
        .join('_');
      const price = this.workSpace.price[planType];
      this.workspacePlan = { price, category: planType };
    });
  }

  private buildForm() {
    const form = {
      numberOfVisitors: [1, Validators.required],
      name: ['', Validators.required],
      email: ['', [Validators.required, CustomValidators.emailValidator]],
      phone_number: ['', Validators.required],
      visitors: new FormArray([]),
      date: ['', Validators.required],
    };
    if (!this.isPricePerDay) {
      form['month'] = ['', Validators.required];
    }
    this.bookingForm = this.formBuilder.group(form);
    this.addMoreVisitor();
  }

  get visitors() {
    return this.bookingForm.controls.visitors as FormArray;
  }

  onReset() {
    this.bookingForm.reset();
    this.visitors.clear();
  }

  onClear() {
    this.visitors.reset();
  }

  private isAuthenticated() {
    return this.authService.getToken();
  }

  sendGaEvent(category: string, action: string, label: string) {
    if (environment.options.GA_ENABLED && isPlatformBrowser(this.platformId)) {
      ga('send', 'event', category, action, label);
    }
  }

  sendGaPaymentTransaction(orderID: string | number, amount: string | number) {
    if (isPlatformBrowser(this.platformId)) {
      ga('ecommerce:addTransaction', {
        id: orderID,
        affiliation: 'CoFynd',
        revenue: amount,
        shipping: '0',
        tax: '0',
        currency: 'INR',
      });
      ga('ecommerce:addItem', {
        id: orderID,
        name: 'DAY_PASS',
        price: amount,
        quantity: '1',
        currency: 'INR',
      });
      ga('ecommerce:send');
    }
  }
}
