import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../_services/api.service';

@Component({
  selector: 'app-user-courses',
  templateUrl: './usercourse.component.html',
  // styleUrls: ['./usercourses.component.css']
})
export class UserCoursesComponent implements OnInit {
  userId: number;
  userCourses: any[]; // Replace 'any' with the actual type of your userCourses
  course: any;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Call the service method to get user details
    this.apiService.getUserByToken().subscribe(
      (userResponse) => {
        // Extract user ID from the user details response
        this.userId = userResponse.id;
        console.log('userResponse', userResponse)
        // Call your API service to get user courses
        this.getUserCourses();
      },
      (error) => {
        console.error('Error fetching user details:', error);
        // Handle the error as needed
      }
    );
  }

  getUserCourses(): void {
    // Call the service method to get user courses
    this.apiService.UserCourseByuserId(this.userId).subscribe(
      (response) => {
        console.log('response', response)
        this.userCourses = response.userCourses;
        // Do anything else you need to do with the data
      },
      (error) => {
        console.error('Error fetching user courses:', error);
        // Handle the error as needed
      }
    );
  }
  isCoursePurchased(): boolean {
    if (!this.userCourses || !this.course) {
      return false;
    }
    return this.userCourses.some(course => course.courseId === this.course.id);
  }
}
