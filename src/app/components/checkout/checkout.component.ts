import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms'
import { Router } from '@angular/router';

import { timeStamp } from 'console';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { PaymentInfo } from 'src/app/common/payment-info';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { JoyDealsFormService } from 'src/app/services/joy-deals-form.service';
import { JoyDealsValidators } from 'src/app/validators/joy-deals-validators';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  checkoutFormsGroup!: FormGroup;
  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardYears: number[] = [];
  creditCardMonths: number[] = [];
  countries: Country[] = [];
  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];
  storage: Storage = sessionStorage;


  // initialize stripe API
  stripe = Stripe(environment.stripePublishableKey);
  paymentInfo: PaymentInfo = new PaymentInfo();
  cardElement: any;
  displayError: any;

  isDisabled: boolean = false;
  constructor(private formBuilder: FormBuilder,
    private joyDealsFormService: JoyDealsFormService,
    private cartService: CartService,
    private checkoutService: CheckoutService,
    private router: Router) { }

  ngOnInit(): void {

    //setup stripe payment 
    this.setupStripePaymentForm();
    this.reviewCartDetails();
    //read user email
    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);

    this.checkoutFormsGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          JoyDealsValidators.notOnlyWhitespace]),
        lastName: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          JoyDealsValidators.notOnlyWhitespace]),
        email: new FormControl(theEmail, [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])
      }),
      shippingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          JoyDealsValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          JoyDealsValidators.notOnlyWhitespace]),
        state: new FormControl('',
          [Validators.required]),
        country: new FormControl('',
          [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          JoyDealsValidators.notOnlyWhitespace]),
      }),
      billingAddress: this.formBuilder.group({
        street: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          JoyDealsValidators.notOnlyWhitespace]),
        city: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          JoyDealsValidators.notOnlyWhitespace]),
        state: new FormControl('',
          [Validators.required]),
        country: new FormControl('',
          [Validators.required]),
        zipCode: new FormControl('',
          [Validators.required,
          Validators.minLength(2),
          JoyDealsValidators.notOnlyWhitespace]),
      }),
      creditCard: this.formBuilder.group({
        /*    cardType: new FormControl('',
              [Validators.required]),
            nameOnCard: new FormControl('',
              [Validators.required,
              Validators.minLength(2),
              JoyDealsValidators.notOnlyWhitespace]),
            cardNumber: new FormControl('',
              [Validators.required, Validators.pattern('[0-9]{16}')]),
            securityCode: new FormControl('',
              [Validators.required, Validators.pattern('[0-9]{3}')]),
            expirationMonth: [''],
            expirationYear: [''], */
      })
    });
    /* populate credit card months

    const startMonth: number = new Date().getMonth() + 1;
    this.joyDealsFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived crdit cared month >>>" + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    );

    // populate credit card years

    this.joyDealsFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrived credeit card years" + JSON.stringify(data));
        this.creditCardYears = data;
      }
    ); */

    // Populate Countries

    this.joyDealsFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved Countries: " + JSON.stringify(data));
        this.countries = data;
      }
    )
  }
  setupStripePaymentForm() {

    //get a handle t strip elements and hide zip code field
    var elements = this.stripe.elements();

    // create a card element
    this.cardElement = elements.create('card', { hidePostalCode: true });

    //add an instance of card UI component into card-element div
    this.cardElement.mount('#card-element');


    //add event binding for the change event on the catd element
    this.cardElement.on('change', (event: any) => {

      // get a handle to card error element
      this.displayError = document.getElementById('card-errors');

      if (event.complete) {
        this.displayError.textConent = "";
      } else if (event.error) {
        // show validation error to customer
        this.displayError.textConent = event.error.message;
      }
    });
  }

  reviewCartDetails() {
    //Subscribe to cartService total quantity
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );
    //Subscribe to cartService total price
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }

  get firstName() { return this.checkoutFormsGroup.get('customer.firstName'); }
  get lastName() { return this.checkoutFormsGroup.get('customer.lastName'); }
  get email() { return this.checkoutFormsGroup.get('customer.email'); }

  get shippingAddressStreet() { return this.checkoutFormsGroup.get('shippingAddress.street'); }
  get shippingAddressCity() { return this.checkoutFormsGroup.get('shippingAddress.city'); }
  get shippingAddressState() { return this.checkoutFormsGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode() { return this.checkoutFormsGroup.get('shippingAddress.zipCode'); }
  get shippingAddressCountry() { return this.checkoutFormsGroup.get('shippingAddress.country'); }

  get billingAddressStreet() { return this.checkoutFormsGroup.get('billingAddress.street'); }
  get billingAddressCity() { return this.checkoutFormsGroup.get('billingAddress.city'); }
  get billingAddressState() { return this.checkoutFormsGroup.get('billingAddress.state'); }
  get billingAddressZipCode() { return this.checkoutFormsGroup.get('billingAddress.zipCode'); }
  get billingAddressCountry() { return this.checkoutFormsGroup.get('billingAddress.country'); }

  get creditCardType() { return this.checkoutFormsGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormsGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormsGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormsGroup.get('creditCard.securityCode'); }


  copyShippingAddressToBillingAddress(event: any) {
    if (event.target.checked) {
      this.checkoutFormsGroup.controls['billingAddress']
        .setValue(this.checkoutFormsGroup.controls['shippingAddress'].value);
      // Assign shipping address to billing address
      this.billingAddressStates = this.shippingAddressStates;
    }
    else {
      this.checkoutFormsGroup.controls['billingAddress'].reset();
      // empty billing address
      this.billingAddressStates = []
    }
  }
  async onSubmit() {
    console.log("Handling Submit Button");

    if (this.checkoutFormsGroup.invalid) {
      this.checkoutFormsGroup.markAllAsTouched();
      return;
    }


    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;


    // get cart items

    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    // long way
    //  let orderItems: OrderItem[] = [];
    //  for (let i = 0; i < cartItems.length; i++) {
    //    orderItems[i] = new OrderItem(cartItems[i]);
    //  }
    // short way

    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));
    //setup purchase
    let purchase = new Purchase();

    //populate purchase - customer
    purchase.customer = this.checkoutFormsGroup.controls['customer'].value;

    //populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormsGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress?.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress?.country));
    purchase.shippingAddress!.state = shippingState.name;
    purchase.shippingAddress!.country = shippingCountry.name;

    //populate purchase - billing address
    purchase.billingAddress = this.checkoutFormsGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress?.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress?.country));
    purchase.billingAddress!.state = billingState.name;
    purchase.billingAddress!.country = billingCountry.name;

    //populate purchase - order and orderitems
    purchase.order = order;
    purchase.orderItems = orderItems;
    this.paymentInfo.amount = Math.round(this.totalPrice * 100);
    this.paymentInfo.currency = "USD";
    this.paymentInfo.receiptEmail = purchase.customer?.email;
    console.log('this.paymentInfo.amount >>>> ', this.paymentInfo.amount);
    // If form is valida 
    //create payment intent
    // confirm card payment
    // place order

    if (!this.checkoutFormsGroup.invalid && this.displayError.textContent === "") {

      this.isDisabled = true;
      await this.checkoutService.createPaymentIntent(this.paymentInfo).subscribe(
        (paymentIntentResponse) => {
          this.stripe.confirmCardPayment(paymentIntentResponse.client_secret,
            {
              payment_method: {
                card: this.cardElement,
                billing_details: {
                  email: purchase.customer?.email,
                  name: `${purchase.customer?.firstName} ${purchase.customer?.lastName}`,
                  address: {
                    line1: purchase.billingAddress?.street,
                    city: purchase.billingAddress?.city,
                    state: purchase.billingAddress?.state,
                    postal_code: purchase.billingAddress?.zipCode,
                    country: this.billingAddressCountry?.value.code
                  }
                }
              }
            }, { handleActions: false })
            .then((result: any) => {
              if (result.error) {
                // inform the customer there was an error
                alert(`There was an error: ${result.error.message}`);
                this.isDisabled = false;
                // call REST API via the CheckoutService
                this.checkoutService.placeOrder(purchase).subscribe({
                  next: (response: any) => {
                    alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

                    // reset cart
                    this.resetCart();
                    this.isDisabled = false;
                  },
                  error: (err: { message: any; }) => {
                    alert(`There was an error: ${err.message}`);
                    this.isDisabled = false;
                  }
                }
                )
              }
            }
            )
        }
      );
    } else {
      this.checkoutFormsGroup.markAllAsTouched();
      return;
    }

  }


  resetCart() {
    //reset cart data
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);
    this.cartService.persistCartItems();
    //reset the form data
    this.checkoutFormsGroup.reset();

    // naviagte back to the products page
    this.router.navigateByUrl("products");
  }

  handleMonthsandYears() {
    const creditCardFormGroup = this.checkoutFormsGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup?.value.expirationYear);

    // if the current year equals the selected year, then start with the current month

    let startMonth: number;
    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }
    this.joyDealsFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrived credit card months:" + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
  }
  getStates(formGroupName: string) {
    const formGroup = this.checkoutFormsGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;
    console.log(`{formGroupName} country Code: ${countryCode}`);
    console.log(`{formGroupName} country name: ${countryName}`);

    this.joyDealsFormService.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAddressStates = data;
          console.log("shipping Address States", JSON.stringify(data));
        }
        else {
          this.billingAddressStates = data;
        }
        //Select forst state as default
        formGroup?.get('state')?.setValue(data[0]);
      }
    );

  }
}