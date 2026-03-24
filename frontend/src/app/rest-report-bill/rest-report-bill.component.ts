import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rest-report-bill',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './rest-report-bill.component.html',
  styleUrl: './rest-report-bill.component.css'
})
export class RestReportBillComponent {
  public bills: any[] = [];
  public filteredData: any[] = [];
  public filterFromDate: string = '';
  public filterToDate: string = '';
  public showReport: boolean = false;
  public today: Date = new Date();
  public resid: string | null = localStorage.getItem("resid");
  public totalRevenue: number = 0;

  constructor(private http: HttpClient) {
    if (this.resid) {
      this.fetchBills();
    }
  }

  fetchBills() {
    this.http.get(`http://localhost:3000/fetch_rest_bills_enriched/${this.resid}`)
      .subscribe({
        next: (response: any) => {
          this.bills = response;
          this.filteredData = response;
          this.calculateTotalRevenue();
        },
        error: (err) => {
          console.log("Error In Fetching Restaurant Enriched Bills: ", err);
        }
      });
  }

  generateReport() {
    let tempData = this.bills;

    // Filter by Date Range
    if (this.filterFromDate || this.filterToDate) {
      tempData = tempData.filter(bill => {
        const billDate = new Date(bill.bill_date);
        
        if (this.filterFromDate) {
          const fromDate = new Date(this.filterFromDate);
          fromDate.setHours(0, 0, 0, 0);
          if (billDate < fromDate) return false;
        }
        
        if (this.filterToDate) {
          const toDate = new Date(this.filterToDate);
          toDate.setHours(23, 59, 59, 999);
          if (billDate > toDate) return false;
        }
        
        return true;
      });
    }

    this.filteredData = tempData;
    this.calculateTotalRevenue();
    this.showReport = true;
  }

  calculateTotalRevenue() {
    this.totalRevenue = this.filteredData.reduce((sum, bill) => sum + (bill.total_amount || 0), 0);
  }

  printReport() {
    window.print();
  }
}
