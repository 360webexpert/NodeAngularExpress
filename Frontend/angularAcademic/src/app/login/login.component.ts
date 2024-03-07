import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../_services/api.service'; // Replace with the correct path
import { AuthService } from '../_services/auth.services';
import Swal from 'sweetalert2';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  focus: boolean;
  focus1: boolean;
  loginForm: FormGroup;

  constructor(private apiService: ApiService, private authService: AuthService, private route: ActivatedRoute,
    private router: Router, private formBuilder: FormBuilder) {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  ngOnInit() {
  }

  onSubmit() {
    // Check if the form is valid
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
  
      this.apiService.loginUser({ email, password })
        .subscribe({
          next: (res) => {
            // console.log('login res', res?.data?.role === 'student')
            if(res?.data?.role === 'student' || res?.data?.role === 'instructor' ){

              this.authService.setToken(res.token);
              this.router.navigate(['/home'], { relativeTo: this.route });
            }else{
              Swal.fire({
                icon: 'error',
                title: 'Login failed',
                text: 'Login with student credentials!',
              });
            }
          },
          error: (error) => {
            Swal.fire({
              icon: 'error',
              title: 'Login failed',
              text: `${error?.error?.message}`,
            });
          },
        });
    } else {
      // If the form is not valid, mark all fields as touched to trigger error messages
      this.markAllFieldsAsTouched(this.loginForm);
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
