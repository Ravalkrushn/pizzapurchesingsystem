import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rest-report-customer',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './rest-report-customer.component.html',
  styleUrl: './rest-report-customer.component.css'
})
export class RestReportCustomerComponent {
  public custdetail: any[] = [];
  public filteredData: any[] = [];
  public filterCity: string = '';
  public showReport: boolean = false;
  public today: Date = new Date();
  public resid: string | null = localStorage.getItem("resid");

  constructor(private http: HttpClient) {
    if (this.resid) {
      this.fetchcustdetail();
    }
  }

  fetchcustdetail() {
    this.http.get(`http://localhost:3000/fetch_rest_customers/${this.resid}`)
      .subscribe({
        next: (response: any) => {
          this.custdetail = response;
          this.filteredData = response;
        },
        error: (err) => {
          console.log("Error In Fetching Restaurant Customer Detail: ", err);
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
