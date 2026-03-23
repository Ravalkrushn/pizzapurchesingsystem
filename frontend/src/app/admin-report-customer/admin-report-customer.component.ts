import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-report-customer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-report-customer.component.html',
  styleUrl: './admin-report-customer.component.css'
})
export class AdminReportCustomerComponent {
  public custdetail: any[] = [];
  public filteredData: any[] = [];
  public filterCity: string = '';
  public showReport: boolean = false;
  public today: Date = new Date();

  constructor(private http: HttpClient) {
    this.fetchcustdetail();
  }

  fetchcustdetail() {
    this.http.get("http://localhost:3000/fetch_custdetail")
      .subscribe({
        next: (response: any) => {
          this.custdetail = response;
          this.filteredData = response;
        },
        error: (err) => {
          console.log("Error In Fetching Customer Detail: ", err);
        }
      });
  }

  generateReport() {
    if (this.filterCity) {
      this.filteredData = this.custdetail.filter(cust => 
        cust.city.toLowerCase().includes(this.filterCity.toLowerCase())
      );
    } else {
      this.filteredData = this.custdetail;
    }
    this.showReport = true;
  }

  printReport() {
    window.print();
  }
}
