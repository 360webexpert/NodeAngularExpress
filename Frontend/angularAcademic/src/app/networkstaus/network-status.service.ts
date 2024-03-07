import { Injectable, OnInit } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class NetworkStatusService implements OnInit {
  ngOnInit() {
    // Implement ngOnInit logic here if needed
  }

  isOnline(): boolean {
    return navigator.onLine;
  }
}
