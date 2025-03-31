import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.css']
})
export class IndexComponent implements OnInit {
  responseMessage = '';
  reportsHtml: string = '';  

  constructor(private api: ApiService) {}

  ngOnInit(): void {
    this.loadReports();  
  }

  callHello(): void {
    console.log('Hello from IndexComponent!');
    this.api.getHello().subscribe({
      next: (res: string) => {
        console.log('Response from API:', res);
        this.responseMessage = res;
      },
      error: (err) => {
        console.error('Error calling API:', err);
      }
    });
  }

  loadReports(): void {
    this.api.getDistinctProfileIDs().subscribe({
      next: (data) => {
        this.reportsHtml = data; 
      },
      error: (error) => {
        console.error('Error fetching reports:', error);
      }
    });
  }
}
