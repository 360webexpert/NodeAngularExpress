import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../_services/auth.services';
import { ApiService } from '../_services/api.service';
import Swal from 'sweetalert2';

@Component({
    selector: 'app-password',
    templateUrl: './password.component.html',
    //   styleUrls: ['./password.component.css']
})
export class PasswordComponent implements OnInit {

    passwordForm: FormGroup;
    isForgotPassword: boolean;
    resetToken: string;
    passwordResetSuccess: any;

    constructor(
        private formBuilder: FormBuilder,
        // private authService: AuthService,
        private apiService: ApiService,
        private route: ActivatedRoute,
        private router: Router
    ) {
        this.passwordForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            newPassword: ['', Validators.required],
        });
    }

    ngOnInit(): void {
        this.route.url.subscribe(segments => {
            this.isForgotPassword = segments[0]?.path === 'forgot-password';
        });

        this.route.queryParams.subscribe(params => {
            this.resetToken = params.token;
        });

        if (this.isForgotPassword) {
            this.passwordForm.removeControl('newPassword');
        }
    }

    onSubmit() {
        if (this.isForgotPassword) {
            const { email } = this.passwordForm.value;
            this.apiService.forgotPassword({ email })
                .subscribe({
                    next: (res) => {
                        Swal.fire({
                            icon: 'success',
                            title: 'Email sent',
                            text: 'To reset you password check your email!',
                        })
                        // console.log('Forgot password email sent successfully.');
                    },
                    error: (error) => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Password reset failed',
                            text: `${error?.error?.message}`,
                        });
                        // console.error('Error sending forgot password email:', error);
                    },
                })

        } else {
            const password = this.passwordForm.value.newPassword;
            console.log('password', password)
            console.log('passwordform', this.passwordForm.value)
            const token = this.resetToken;
            this.apiService.resetPassword(token, password)
            .subscribe({
                next: (res) => {
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Password reset successfully',
                    }).then(() => {
                        this.router.navigate(['/login'], { relativeTo: this.route });
                      });
                    // console.log('Forgot password email sent successfully.');
                },
                error: (error) => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Password reset failed',
                        text: `${error?.error?.message}`,
                    });
                    // console.error('Error sending forgot password email:', error);
                },
            })
        }
    }
}
