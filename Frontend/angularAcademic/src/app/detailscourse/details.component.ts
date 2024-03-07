import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../_services/api.service';
import { AuthService } from '../_services/auth.services';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ShareModalComponent } from './referralmodal.component';
import { VideoModalComponent } from './videomodal.component';

@Component({
  templateUrl: './details.component.html',
  styleUrls: ['./details.css']
})
export class DetailsComponent implements OnInit {
  courseId: string;
  course: any;
  userId: any;
  userCourses: any;
  userName: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private authService: AuthService,
    private modalService: NgbModal
  
    
    
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.courseId = params['courseId'];
      const courseIdAsNumber = +this.courseId;
      this.apiService.getCourseById(courseIdAsNumber).subscribe((courseDetails) => {
        this.course = courseDetails;
      });
      this.apiService.getUserByToken().subscribe(
        (userResponse) => {
          this.userId = userResponse.id;
          this.userName = userResponse.firstName;
          this.getUserCourses();
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    });
  }

  isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  redirectToLogin(): void {
    localStorage.setItem('courseToBuy', this.courseId);
    this.router.navigate(['/login']);
  }

  redirectToCheckout(): void {
    this.router.navigate(['/checkout', this.courseId]);
  }
  redirectToPurchasedCourses(): void {
    this.router.navigate(['/my-course']);
  }

  getUserCourses(): void {
    this.apiService.UserCourseByuserId(this.userId).subscribe(
      (response) => {
        this.userCourses = response.userCourses;
      },
      (error) => {
        console.error('Error fetching user courses:', error);
      }
    );
  }

  isCoursePurchased(): boolean {
    if (!this.userCourses || !this.course) {
      return false;
    }
    return this.userCourses.some(course => course.courseId === this.course.id);
  }

  openShareModal(): void {
  const modalRef = this.modalService.open(ShareModalComponent);
  modalRef.componentInstance.referrerId = this.userId; // Pass referrerId to modal
  modalRef.componentInstance.referrerName = this.userName; // Pass referrerName to modal
  modalRef.componentInstance.courseId = this.courseId; // Pass courseId to modal
  modalRef.componentInstance.courseName = this.course.courseTitle; // Pass courseName to modal
}


openModal(): void {
  const modalRef = this.modalService.open(VideoModalComponent);
 
}

}
