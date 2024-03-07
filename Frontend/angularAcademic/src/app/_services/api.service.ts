import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.services';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = environment.apiUrl;
  // private apiUrl = 'http://360coder.com:8080/api'; // Replace with your API URL
  // private apiUrl = 'http://localhost:8080/api'; 

  constructor(private http: HttpClient, private authService: AuthService) { }

  registerUser(userData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/createuser`, userData);
  }

  loginUser(userData: any): Observable<any> {


    return this.http.post(`${this.apiUrl}/login`, userData);
  }

  getUserByToken(): Observable<any> {

    const url = `${this.apiUrl}/user`;

    // Get the authentication token from your authentication service
    const authToken = this.authService.getToken();

    // Set up headers with the authentication token
    const headers = new HttpHeaders().set('Authorization', `${authToken}`);

    // Make the GET request with headers
    return this.http.get<any>(url, { headers });
  }
  updateUser(userId: number, userData: any): Observable<any> {
    const url = `${this.apiUrl}/updateuser/${userId}`;

    // Get the authentication token from your authentication service
    const authToken = this.authService.getToken();

    // Set up headers with the authentication token
    const headers = new HttpHeaders().set('Authorization', `${authToken}`);

    // Make the PUT request with headers
    return this.http.post(url, userData, { headers });
  }

  // get all courses
  getAllCourses(): Observable<any> {
    const url = `${this.apiUrl}/getallcourses`;

    // Make the GET request without headers
    return this.http.get<any>(url);

  }
// get couse by id
  getCourseById(courseId: number): Observable<any> {
    const url = `${this.apiUrl}/getcoursedetails/${courseId}`;

    // Make the GET request without headers
    return this.http.get<any>(url);
  }

  // checkout user
  checkoutCourse(checkoutData: any): Observable<any> {

    const authToken = this.authService.getToken();

    // Set up headers with the authentication token
    const headers = new HttpHeaders().set('Authorization', `${authToken}`);

    return this.http.post(`${this.apiUrl}/usercheckout`, checkoutData, { headers });
  }

   // CreateUserCourse
  CreateUserCourse(createCourseData: any): Observable<any> {

    const authToken = this.authService.getToken();

    // Set up headers with the authentication token
    const headers = new HttpHeaders().set('Authorization', `${authToken}`);

    return this.http.post(`${this.apiUrl}/createusercourse`, createCourseData, { headers });
  }
  forgotPassword(userData: any): Observable<any> {

    // const url = `${this.apiUrl}/forgot-password`;
    // const body = { userData };  // Assuming your backend expects the new password in the request body
  
    // // Make the POST request with the new password in the body
    // return this.http.post<any>(url, body);
    // return this.http.post(`${this.apiUrl}/forgot-password`, userData);
    return this.http.post(`${this.apiUrl}/forgot-password`, userData)
  }
  resetPassword(token: string, newPassword: string): Observable<any> {
    const url = `${this.apiUrl}/reset-password`;
    const body = { token, newPassword };
  
    // Make the POST request with both token and new password in the body
    return this.http.post<any>(url, body);
  }
  
  // get couse by id
  UserCourseByuserId(userId: number): Observable<any> {
    const url = `${this.apiUrl}/user-courses/${userId}`;
  
    // Get the authentication token from your authentication service
    const authToken = this.authService.getToken();
  
    // Set up headers with the authentication token
    const headers = new HttpHeaders().set('Authorization', `${authToken}`);
  
    // Make the GET request with headers
    return this.http.get(url, { headers });
  }
  
  getalltransaction(): Observable<any> {
    const url = `${this.apiUrl}/getTransactions`;
    const authToken = this.authService.getToken();

    // Set up headers with the authentication token
    const headers = new HttpHeaders().set('Authorization', `${authToken}`);
    // Make the GET request with headers
    return this.http.get<any>(url, { headers });
  }
   // shareReferral user
   shareReferral(refferData: any): Observable<any> {

    const authToken = this.authService.getToken();

    // Set up headers with the authentication token
    const headers = new HttpHeaders().set('Authorization', `${authToken}`);

    return this.http.post(`${this.apiUrl}/createreferral`, refferData, { headers });
  }


  verifyreferral(completeReferral: any): Observable<any> {

    console.log('completeReferral', completeReferral)
    // Set up headers with the authentication token
    

    return this.http.post(`${this.apiUrl}/verifyreferral`, completeReferral);
  }
  getalluniversities(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getalluniversities`);
    }

}