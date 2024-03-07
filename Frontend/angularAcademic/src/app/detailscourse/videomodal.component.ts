import { Component, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ApiService } from '../_services/api.service';
import Swal from 'sweetalert2';

@Component({
  templateUrl: './videomodal.component.html'
  
})
export class VideoModalComponent {
  @Input() referrerId: number;
  @Input() referrerName: string;
  @Input() courseId: number;
  @Input() courseName: string;
 
  loading = false;

  constructor(
    public activeModal: NgbActiveModal,
    private apiService: ApiService
  ) { }

  share(): void {
    this.loading = true;
    
    
  }
}
