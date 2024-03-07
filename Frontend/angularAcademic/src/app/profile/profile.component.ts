import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { first } from 'rxjs/operators';
import { ApiService } from '../_services/api.service';
import { Country, State, City, ICountry, IState, ICity } from 'country-state-city';
import Swal from 'sweetalert2';
@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
    form!: FormGroup;
    loading = false;
    submitted = false;


    // Define variables to store country, state, and city data
    countries: ICountry[] = [];
    states: IState[] = [];
    cities: ICity[] = [];
    userId: any;


    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,

        private apiService: ApiService,
    ) { }

    ngOnInit() {
        // Fetch user data from API and set it in the form fields
        this.apiService.getUserByToken().subscribe((userData) => {
            console.log("userdata", userData)
            this.userId = userData.id;

            // Assuming userData has properties country, state, and city
            const countryIsoCode = userData.country;
            const stateIsoCode = userData.state;

            // Populate countries
            this.countries = Country.getAllCountries();

            // Populate states based on the user's country
            this.states = State.getStatesOfCountry(countryIsoCode);

            // Populate cities based on the user's country and state
            this.cities = City.getCitiesOfState(countryIsoCode, stateIsoCode);

            // Initialize the form after populating countries, states, and cities
            this.form = this.formBuilder.group({
                firstName: [userData.firstName, Validators.required],
                lastName: [userData.lastName, Validators.required],
                email: [userData.email, [Validators.required, Validators.email]],
                password: [userData.password, [Validators.required, Validators.minLength(6)]],
                phoneNumber: [userData.phoneNumber, Validators.required],
                addressLane1: [userData.addressLane1, Validators.required],
                addressLane2: [userData.addressLane2, Validators.required],
                country: [userData.country, Validators.required],
                state: [userData.state, Validators.required],
                city: [userData.city, Validators.required],
                zipCode: [userData.zipCode, Validators.required],
                interestedInInternship: [userData.interestedInInternship, Validators.required],
                universityName: [userData.universityName, Validators.required],
                otherUniversityName: [userData.otherUniversityName, Validators.required],
                currentProgram: [userData.currentProgram, Validators.required],
                graduatingYear: [userData.graduatingYear, [Validators.required]],
                alreadyGraduated: [userData.alreadyGraduated.toString(), Validators.required],
                schoolEmail: [userData.schoolEmail],
                userId: [this.userId],
            });
        });
    }
    get f() {
        return this.form.controls;
    }
    // ... (rest of the component code)
    // Event handler for country change
    onCountryChange() {
        const countryIsoCode = this.form.value.country;
        this.states = State.getStatesOfCountry(countryIsoCode);
        this.form.patchValue({ state: '' }); // Reset state and city when country changes
        this.cities = [];
    }

    // Event handler for state change
    onStateChange() {
        const countryIsoCode = this.form.value.country;
        const stateIsoCode = this.form.value.state;
        this.cities = City.getCitiesOfState(countryIsoCode, stateIsoCode);
        this.form.patchValue({ city: '' }); // Reset city when state changes
    }

    onSubmit() {

    }
}

