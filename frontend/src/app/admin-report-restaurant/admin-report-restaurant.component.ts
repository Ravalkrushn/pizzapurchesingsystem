import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-report-restaurant',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-report-restaurant.component.html',
  styleUrl: './admin-report-restaurant.component.css'
})
export class AdminReportRestaurantComponent {
  public resdetail: any[] = [];
  public filteredData: any[] = [];
  public filterCity: string = '';
  public showReport: boolean = false;
  public today: Date = new Date();

  constructor(private http: HttpClient) {
    this.fetchresdetail();
  }

  fetchresdetail() {
    this.http.get("http://localhost:3000/fetch_resdetail")
      .subscribe({
        next: (response: any) => {
          this.resdetail = response;
          this.filteredData = response;
        },
        error: (err) => {
          console.log("Error In Fetching Restaurant Detail: ", err);
        }
      });
  }

  generateReport() {
    if (this.filterCity) {
      this.filteredData = this.resdetail.filter(res => 
        res.city.toLowerCase().includes(this.filterCity.toLowerCase())
      );
    } else {
      this.filteredData = this.resdetail;
    }
    this.showReport = true;
  }

  printReport() {
    window.print();
  }
}
