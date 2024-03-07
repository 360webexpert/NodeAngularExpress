import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/_services/api.service';
declare var $: any;

@Component({
  templateUrl: 'myorders.component.html',
  styleUrls: ['myorders.css']
})
export class MyOrdersComponent implements OnInit {
  userId: number;
  userCourses: any[];
  selectedCourse: any;
  courstransaction: any;

  constructor(private apiService: ApiService, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.apiService.getUserByToken().subscribe(
      (userResponse) => {
        this.userId = userResponse.id;
        this.getUserCourses();
        
      },
      (error) => {
        console.error('Error fetching user details:', error);
      }
    );


    
  }

  
    // this.apiService.gettransactionsid(transactionId).subscribe(
    //   console.log("gettransactionsid", gettransactionsid);
    //   this.alltransation = gettransactionsid.reverse();

    
  // });




  // getUserCourses(): void {
  //   this.apiService.UserCourseByuserId(this.userId).subscribe(
  //     (response) => {
  //       this.userCourses = response.userCourses;
  //       if (this.userCourses && this.userCourses.length > 0) {
  //          this.apiService.getalltransaction().subscribe(
  //           (response) => {

  //             console.log('responskjhkjhe', response)
  //           })
  //         // Set the default selected course to the first one in the array
  //         this.selectedCourse = this.userCourses;
  //         console.log(this.userCourses,"jjjjjjjj")
  //         // Show details of the default selected course
          
  //         this.showCourseDetails();
  //       }
  //     },
  //     (error) => {
  //       console.error('Error fetching user courses:', error);
  //     }
  //   );
  // }

  getUserCourses(): void {
    this.apiService.UserCourseByuserId(this.userId).subscribe(
      (userCoursesResponse) => {
        this.userCourses = userCoursesResponse.userCourses;
  
        if (this.userCourses && this.userCourses.length > 0) {
          this.apiService.getalltransaction().subscribe(
            (transactionsResponse) => {
              console.log('All Transactions:', transactionsResponse);
  
              // For each user course, find the corresponding transaction
              this.userCourses.forEach(userCourse => {
                const matchingTransaction = transactionsResponse.find(transaction => 
                  transaction.courseId === userCourse.courseId && transaction.userId === this.userId
                );
  
                if (matchingTransaction) {
                  this.courstransaction=matchingTransaction
                  // You have the matching transaction, do something with it
                  console.log(`Transaction found for courseId ${userCourse.courseId}:`, matchingTransaction);
                } else {
                  // No matching transaction found
                  console.log(`No transaction found for courseId ${userCourse.courseId}`);
                }
              });
  
              // Set the default selected course to the first one in the array
              this.selectedCourse = this.userCourses[0];
  
              // Show details of the default selected course
              this.showCourseDetails();
            },
            (transactionsError) => {
              console.error('Error fetching transactions:', transactionsError);
            }
          );
        }
      },
      (userCoursesError) => {
        console.error('Error fetching user courses:', userCoursesError);
      }
    );
  }
  
  openModal(courseId: string): void {
    const courseIdAsNumber: number = parseInt(courseId, 10);
    this.apiService.getCourseById(courseIdAsNumber).subscribe(
      (courseDetails) => {
        if (courseDetails) {
          this.selectedCourse = courseDetails;
          console.log(courseDetails,"jkjjjjjjjj")
          this.showCourseDetails();
        } else {
          console.log('Course details not found.');
        }
      },
      (error) => {
        console.error('Error fetching course details:', error);
      }
    );
  }

  showCourseDetails(): void {
    // Call a function to open the side panel with the selected course details
    // You can customize this function based on your specific requirements
    this.openSidePanel();
  }

  openSidePanel(): void {
    // Update side panel content based on the details fetched from UserCourseByuserId
    this.apiService.UserCourseByuserId(this.userId).subscribe(
      (response) => {
        const sidePanel = document.getElementById('sidePanel');
        if (sidePanel) {
          // Update side panel content based on the response
          // For example: sidePanel.innerHTML = `<p>${response.courseTitle}</p>`;
          // Show the side panel
          sidePanel.style.display = 'block';
        }
      },
      (error) => {
        console.error('Error fetching course details from UserCourseByuserId:', error);
      }
    );
  }
closeModal(): void {
  const modalId = 'exampleModalLong' + this.selectedCourse.id;
  this.closeModalById(modalId);
}

closeModalById(modalId: string): void {
  const modal = document.getElementById(modalId);
  if (modal) {
    modal.classList.remove('show');
    modal.style.display = 'none';
    document.body.classList.remove('modal-open');
  }
}




  
}