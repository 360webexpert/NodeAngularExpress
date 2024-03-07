import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';

@Component({
 
  templateUrl: 'startlearning.component.html',
  styleUrls: ['startlearning.css']


})
export class StartLearningComponent implements OnInit {
  
  constructor(
    private router: Router,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
    // Fetch courses from API and set them in the 'courses' array
    
  }
}