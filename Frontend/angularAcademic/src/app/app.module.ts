import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app.routing';
import { ReactiveFormsModule } from '@angular/forms'

import { AppComponent } from './app.component';
import { SignupComponent } from './signup/signup.component';
import { LandingComponent } from './landing/landing.component';
import { ProfileComponent } from './profile/profile.component';
import { HomeComponent } from './home/home.component';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';

import { HomeModule } from './home/home.module';
import { LoginComponent } from './login/login.component';
import { DetailsComponent } from './detailscourse/details.component';

import { ApiService } from './_services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { ProfileEditComponent } from './profile/profileedit.component';
import { CheckoutComponent } from './checkout/checkout.component';

import { OrderpageComponent } from './sections/orderpage/orderpage.component';
import { PasswordComponent } from './password/password.component';
import { UserCoursesComponent } from './usercourse/usercourse.component';
import { StartLearningComponent } from './sections/startlearning/startlearning.component';
import { MyOrdersComponent } from './sections/myorders/myorders.component';
import { SuccesComponent } from './success/success.component';
import { ShareModalComponent } from './detailscourse/referralmodal.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { NetworkStatusService } from './networkstaus/network-status.service';
import { OfflineComponent } from './offlinecomponent/offline.component';




@NgModule({
  declarations: [
    AppComponent,
    SignupComponent,
    LandingComponent,
    ProfileComponent,
    NavbarComponent,
    FooterComponent,
    LoginComponent,
    DetailsComponent,
    ProfileEditComponent,
    CheckoutComponent,
   
    OrderpageComponent,
    PasswordComponent,
    UserCoursesComponent,
    StartLearningComponent,
    MyOrdersComponent,
    SuccesComponent,
    ShareModalComponent,
    PagenotfoundComponent,
    OfflineComponent,
    
  ],
  imports: [
    BrowserModule,
    NgbModule,
    FormsModule,
    RouterModule,
    AppRoutingModule,
    HomeModule,
    ReactiveFormsModule,
    HttpClientModule,
    
  
   
    
  ],
 
  providers: [ApiService, NetworkStatusService],
  bootstrap: [AppComponent]
})
export class AppModule { }
