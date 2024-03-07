import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../_services/api.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './referralmodal.component.html'
})
export class ShareModalComponent {
  @Input() referrerId: number;
  @Input() referrerName: string;
  @Input() courseId: number;
  @Input() courseName: string;
  refereeEmail: string;
  loading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private apiService: ApiService
  ) { }

  share(): void {
    this.loading = true;
    const data = {
      referrerId: this.referrerId,
      referrerName: this.referrerName,
      courseId: this.courseId,
      courseName: this.courseName,
      refereeEmail: this.refereeEmail
    };
    this.apiService.shareReferral(data).subscribe((response) => {
      console.log('response', response)
      if (response.data) {
        Swal.fire({
          icon: 'success',
          title: 'Email sent!',
          text: response.message,
        });
      }
      this.activeModal.close(data);
      this.loading = false;
    });
  }
}
