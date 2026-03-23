import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-report-bill',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-report-bill.component.html',
  styleUrl: './admin-report-bill.component.css'
})
export class AdminReportBillComponent {
  public bills: any[] = [];
  public filteredData: any[] = [];
  public filterFromDate: string = '';
  public filterToDate: string = '';
  public showReport: boolean = false;
  public today: Date = new Date();

  constructor(private http: HttpClient) {
    this.fetchAllBills();
  }

  fetchAllBills() {
    this.http.get("http://localhost:3000/fetch_all_bills")
      .subscribe({
        next: (response: any) => {
          this.bills = response;
          this.filteredData = response;
        },
        error: (err) => {
          console.log("Error In Fetching All Bills: ", err);
        }
      });
  }

  generateReport() {
    if (this.filterFromDate || this.filterToDate) {
      this.filteredData = this.bills.filter(bill => {
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
 else {
      this.filteredData = this.bills;
    }
    this.showReport = true;
  }

  getTotalRevenue() {
    return this.filteredData.reduce((acc, bill) => acc + (bill.total_amount || 0), 0);
  }

  printReport() {
    window.print();
  }
}
