import { NgModule } from '@angular/core';
import { CommonModule, } from '@angular/common';
import { BrowserModule  } from '@angular/platform-browser';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { LoginComponent } from './login/login.component';
import { DetailsComponent } from './detailscourse/details.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { ProfileEditComponent } from './profile/profileedit.component';
import { CourseSectionComponent } from './sections/course/course-section.component';
import { PasswordComponent } from './password/password.component';
import { UserCoursesComponent } from './usercourse/usercourse.component';
import { AuthGuard } from './_services/authguard';
import { OrderpageComponent } from './sections/orderpage/orderpage.component';
import { StartLearningComponent } from './sections/startlearning/startlearning.component';
import { MyOrdersComponent } from './sections/myorders/myorders.component';
import { SuccesComponent } from './success/success.component';

import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { OfflineComponent } from './offlinecomponent/offline.component';

const routes: Routes =[
    { path: '', redirectTo: 'home', pathMatch: 'full' },

    { path: 'home',             component: HomeComponent },
    { path: 'user-profile',     component: ProfileComponent,canActivate: [AuthGuard] },
    { path: 'register',           component: SignupComponent },
    { path: 'landing',          component: LandingComponent },
    { path: 'login',          component: LoginComponent },
    { path: 'course-details/:courseId',component: DetailsComponent, },
    { path: 'checkout/:courseId',          component: CheckoutComponent,canActivate: [AuthGuard] },
    { path: 'profile-edit',          component: ProfileEditComponent ,canActivate: [AuthGuard]},
    { path: 'all-course',          component: CourseSectionComponent },
    { path: 'forgot-password',          component: PasswordComponent },
    { path: 'reset-password',          component: PasswordComponent },
    { path: 'my-course',          component: UserCoursesComponent,canActivate: [AuthGuard] },
    { path: 'placed-order',          component: OrderpageComponent,canActivate: [AuthGuard] },
    { path: 'start-learning',          component: StartLearningComponent,canActivate: [AuthGuard] },
    { path: 'my-orders',          component: MyOrdersComponent,canActivate: [AuthGuard] },
    { path: 'success',          component: SuccesComponent,canActivate: [AuthGuard] },
    { path: '/offline', component: OfflineComponent },

    
    { path: '**', component: PagenotfoundComponent },



];  
@NgModule({
  imports: [
    CommonModule,
    BrowserModule,
    RouterModule.forRoot(routes,{
      useHash: false
    })  
  ],
  exports: [
  ],
})
export class AppRoutingModule { }




