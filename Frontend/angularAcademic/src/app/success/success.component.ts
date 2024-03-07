import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../_services/api.service';

@Component({
 
  templateUrl: './success.component.html',
  styleUrls: ['./success.css']
})
export class SuccesComponent implements OnInit {
  
  userId: number;
  userCourses: any[]; 
  course: any;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    const courseId = localStorage.getItem('courseId');
    if (courseId) {
      const courseIdAsNumber = +courseId;
  
      this.apiService.getUserByToken().subscribe(
        (userResponse) => {
          this.userId = userResponse.id;
  
         
          this.apiService.getCourseById(courseIdAsNumber).subscribe(
            (courseDetails) => {
              this.course = courseDetails;
              console.log('Course details fetched successfully:', courseDetails);
            },
            (error) => {
              console.error('Error fetching course details:', error);
            }
          );
        },
        (error) => {
          console.error('Error fetching user details:', error);
        }
      );
    } else {
      console.error('CourseId not found in localStorage.');
    }
  }
  
  isCoursePurchased(): boolean {
    if (!this.userCourses || !this.course || !this.course.id) {
      return false;
    }
    return this.userCourses.some(course => course.courseId === this.course.id);
  }
  
  
}