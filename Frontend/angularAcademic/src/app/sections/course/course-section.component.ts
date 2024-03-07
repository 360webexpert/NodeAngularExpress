import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';

@Component({
  selector: 'app-course-section',
  templateUrl: 'course.component.html',
  styleUrls: ['course.css']
})
export class CourseSectionComponent implements OnInit {
  courses: any[] = []; // Assuming your courses have a specific structure
  showAllCourses: boolean = false;

  constructor(
    private router: Router,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    // Fetch courses from API and set them in the 'courses' array
    this.apiService.getAllCourses().subscribe((allCourses) => {
      // console.log("allCourses", allCourses);
      this.courses = allCourses.reverse();
      
      // Check if the current route is '/all-course'
      this.showAllCourses = this.router.url.includes('/all-course');
    });
  }
}
