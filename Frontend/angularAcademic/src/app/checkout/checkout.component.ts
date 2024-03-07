  import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ApiService } from '../_services/api.service';
import { AuthService } from '../_services/auth.services';
import { first, switchMap } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
declare var Stripe: any;

@Component({
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.css']
})
export class CheckoutComponent implements OnInit {
  private stripe: any;
  private elements: any;
  private card: any;
  paymentForm: FormGroup;
  courseId: any;
  course: any;
  userId: any;
  tokenId:any;
  loading: boolean = false; // Loader variable
  user: any;
  countries: ICountry[] = [];
  states: IState[] = [];
  cities: ICity[] = [];
  stripeError: any;
  referralCode: string = ''; 

  refalCode: string = '';
  isVerified: boolean = false;
  constructor(
    private apiService: ApiService,
    private fb: FormBuilder,
    private router: Router, 
    private route: ActivatedRoute
  ) {
    this.stripe = Stripe('pk_test_51OZ6zBSAa9J9qe5pGNCHIFQIFZrVdSJSyYJPQkG6WIR5DO0bYQLPn5edv7CJqnakNztPxcdooy2DE5ba1oGNObnv00BngyhWke');
    this.paymentForm = this.createPaymentForm();
    this.countries = Country.getAllCountries();
  }

  ngOnInit() {
    

    this.route.params.subscribe(params => {
      this.courseId = params['courseId'];
      const courseIdAsNumber = +this.courseId;
    // Set course ID in localStorage
    localStorage.setItem('courseId', this.courseId);
      this.apiService.getCourseById(courseIdAsNumber).subscribe((courseDetails) => {
        console.log("courseDetails", courseDetails);
        this.course = courseDetails;
        
        // Update form value based on course price
        this.paymentForm.patchValue({
          amount: courseDetails.coursePrice
        });
      });

      this.apiService.getUserByToken().subscribe(
        (response) => {
          this.userId = response;
          console.log(response,"response");
          const countryIsoCode = response.country;
                const stateIsoCode = response.state;

                // Populate countries, states, and cities
                this.countries = Country.getAllCountries();
                this.states = State.getStatesOfCountry(countryIsoCode);
                this.cities = City.getCitiesOfState(countryIsoCode, stateIsoCode);
          // Prefill form fields with user details
          this.paymentForm.patchValue({
            email: response.email,
            UserName: response.firstName,
            Address: response.addressLane1,
            country: response.country,
            state: response.state,
            city: response.city,
            Zip: response.zipCode
          });
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    });

    this.elements = this.stripe.elements();
    this.card = this.elements.create('card');
    this.card.mount('#card-element');
  }


  createPaymentForm(): FormGroup {
    return this.fb.group({
      amount: [1000, Validators.required],
      email: ['', Validators.required],
      UserName: ['', Validators.required],
      Address: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      Zip: ['', Validators.required],
      token:[this.tokenId]
      
    });
  }
  
  async submitPayment() {
    this.loading = true; // Set loader to true
    
    

    try {
      const { token, error } = await this.stripe.createToken(this.card);
      console.log( this.stripe.createToken, "kkkkkkkk");
      this.stripeError = error
      this.tokenId = token.id;
      const formValues = this.paymentForm.value;
    console.log('formValues', formValues);

      if (error) {
        this.loading = false
        console.error('Error creating token:', error);
        // Show an error message using Swal
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Error creating payment token. Please try again.',
        });
      } else {
        console.log('formValues', formValues)
        this.apiService.checkoutCourse({
          amount: formValues.amount,
          currency: 'usd',
          email: formValues.email,
          userName: formValues.UserName,
          address: formValues.Address,
          country: formValues.country,
          state: formValues.state,
          city: formValues.city,
          Zip: formValues.Zip,
          token: token.id,
          courseTitle:this?.course?.courseTitle,
          courseId:this?.course?.id,
           userId:this?.userId?.id,
        }).subscribe(
          (data) => {
            console.log('datasda', data)
            this.apiService.CreateUserCourse({
              userId: this?.userId?.id,
              courseId: this?.course?.id,
              courseTitle: this?.course?.courseTitle,
              coursePrice: this?.course?.coursePrice,
              courseDescription: this.course.courseDescription,
              courseImage:this.course.courseImage
            }).subscribe(
              (response) => {
                console.log('response', response);
                debugger;
                this.stripe.confirmCardPayment(data.clientSecret, {
                  payment_method: {
                    card: this.card,
                  },
                }).then(result => {
                  if (result.error) {
                    this.loading = false
                    console.error('Payment failed:', result.error.message);
                    // Show an error message using Swal
                    Swal.fire({
                      icon: 'error',
                      title: 'Payment Failed',
                      text: result.error.message,
                    });
                  } else {
                    if (result.paymentIntent.status === 'succeeded') {
                      console.log('Payment succeeded:', result.paymentIntent);
                    
                      // Navigate to the 'my-orders' page
                      this.router.navigate(['/success']);
                    
                    

                    } else {
                      console.log('Payment status:', result.paymentIntent.status);
                    } 
                  }
                  this.loading = false;
                });
              });
          },
          (error) => {
            console.error('Error creating payment intent:', error.error?.error);
            // Show an error message using Swal
            Swal.fire({
              icon: 'error',
              title: 'Error',
              text: `${error?.error?.error}`,
            });
            this.loading = false;
          }
        );
      }
    } catch (e) {
      // console.error('An unexpected error occurred:', e);
      if(this.stripeError){
        console.log('this.stripeError', this.stripeError)
      }else{

      // Show a generic error message using Swal
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: `'An unexpected error occurred. Please try again.'`,
      });
    }
      this.loading = false;
    }
  }
  onCountryChange() {
    const countryIsoCode = this.paymentForm.value.country;
    this.states = State.getStatesOfCountry(countryIsoCode);
    this.paymentForm.patchValue({ state: '' }); // Reset state and city when country changes
    this.cities = [];
  }

  onStateChange() {
    const countryIsoCode = this.paymentForm.value.country;
    const stateIsoCode = this.paymentForm.value.state;
    this.cities = City.getCitiesOfState(countryIsoCode, stateIsoCode);
    this.paymentForm.patchValue({ city: '' }); // Reset city when state changes
  }


  // verifyRefalCode() {
  //   // Implement your validation logic here
  //   if (this.refalCode.trim() !== '') {
  //     // Set the verification status to true
  //     this.isVerified = true;
  //   } else {
  //     // Handle invalid refal code if needed
  //     alert('Please enter a valid refal code.');
  //   }
  // }

  onRefalCodeInput() {
    // Update the verification status based on the input
    this.isVerified = this.refalCode.trim() !== '';
  }
  


  verifyRefalCode(form: NgForm) {
    if (form.valid) {
      const requestData = { referralCode: this.referralCode }; // Update variable name here
  
      console.log('requestData', requestData);
  
      this.apiService.verifyreferral(requestData).subscribe(
        (response) => {
          console.log('Referral code verified successfully.', response);
  
          Swal.fire({
            icon: 'success',
            title: 'Referral Code Verified',
            text: 'The referral code has been verified successfully.',
          });
        },
        (error) => {
          console.error('Failed to verify referral code.', error);
  
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: `${error.error.message}`,
          });
        }
      );
    } else {
      console.error('Form is invalid. Please check the fields.');
    }
  }
  
  
  

}

