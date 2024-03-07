import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import { ApiService } from '../_services/api.service';
// import { AngularFireAuth } from '@angular/fire/auth';
import Swal from 'sweetalert2';


interface University {
  country: string;
  university_name: string;
  university_url: string;
}
@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  //   styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm: FormGroup;
  focus1: boolean = false;
  focus2: boolean = false;
  focus3: boolean = false;
  focus4: boolean = false;
  focus5: boolean = false;
  focus6: boolean = false;
  focus7: boolean = false;
  focus8: boolean = false;
  focus9: boolean = false;
  focus10: boolean = false;
  focus11: boolean = false;
  focus12: boolean = false;
  focus13: boolean = false;
  focus14: boolean = false;
  focus15: boolean = false;
  focus16: boolean = false;
  focus17: boolean = false;
  focus18: boolean = false;
  focus19: boolean = false;
  focus20: boolean = false;

  countries: ICountry[] = [];
  states: IState[] = [];
  cities: ICity[] = [];
  universities: University[] = [];
  loading: boolean;

  constructor(private fb: FormBuilder, private formBuilder: FormBuilder,
    private route: ActivatedRoute,

    private router: Router,

    private apiService: ApiService,) {
    this.signupForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      phoneNumber: ['', Validators.required],
      addressLane1: ['', Validators.required],
      addressLane2: [''],
      country: ['', Validators.required],
      state: ['', Validators.required],
      city: ['', Validators.required],
      zipCode: ['', Validators.required],
      interestedInInternship: ['', Validators.required],
      // interestedInInternship: this.formBuilder.control(null),

      universityName: ['', Validators.required],
      otherUniversityName: [''],
      currentProgram: ['', Validators.required],
      // currentProgram: this.formBuilder.control(null),
      graduatingYear: ['', [Validators.required]],
      alreadyGraduated: ['', Validators.required],
      schoolEmail: [''],
    });
    this.countries = Country.getAllCountries();
  }
  onCountryChange() {
    const countryIsoCode = this.signupForm.value.country;
    this.states = State.getStatesOfCountry(countryIsoCode);
    this.signupForm.patchValue({ state: '' }); // Reset state and city when country changes
    this.cities = [];
  }

  // Event handler for state change
  onStateChange() {
    const countryIsoCode = this.signupForm.value.country; 
    const stateIsoCode = this.signupForm.value.state;
    this.cities = City.getCitiesOfState(countryIsoCode, stateIsoCode);
    this.signupForm.patchValue({ city: '' }); // Reset city when state changes
  }

  ngOnInit() {
    this.apiService.getalluniversities().subscribe((universities: University[]) => {
      this.universities = universities;
      console.log(this.universities,"jjjjjjjjj")
    });
  }
  onSubmit() {
    // Check if the form is valid
    if (this.signupForm.valid) {
      // Your API call logic here
      this.loading = true; 
      this.apiService
        .registerUser(this.signupForm.value)
        .subscribe({
          next: (res) => {
            Swal.fire({
              icon: 'success',
              title: 'Registered successfully',
              text: 'Check your email to verify your account',
            })
              .then(() => {
                this.router.navigate(['/login'], { relativeTo: this.route });
              });
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Signup failed',
              text: `${error?.error?.message}`,
            });
            this.loading = false; 
          },
        });
    } else {
      // If the form is not valid, mark all fields as touched to trigger error messages
      this.markAllFieldsAsTouched(this.signupForm);
    }
  }

  // Recursive function to mark all form fields as touched
  private markAllFieldsAsTouched(formGroup: FormGroup) {
    Object.values(formGroup.controls).forEach(control => {
      if (control instanceof FormGroup) {
        this.markAllFieldsAsTouched(control);
      } else {
        control.markAsTouched();
      }
    });
  }
}