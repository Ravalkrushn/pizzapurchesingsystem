import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-admin-report-order',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin-report-order.component.html',
  styleUrl: './admin-report-order.component.css'
})
export class AdminReportOrderComponent {
  public orders: any[] = [];
  public filteredData: any[] = [];
  public filterStatus: string = '';
  public filterFromDate: string = '';
  public filterToDate: string = '';
  public showReport: boolean = false;
  public today: Date = new Date();

  constructor(private http: HttpClient) {
    this.fetchAllOrders();
  }

  fetchAllOrders() {
    this.http.get("http://localhost:3000/fetch_all_orders")
      .subscribe({
        next: (response: any) => {
          this.orders = response;
          this.filteredData = response;
        },
        error: (err) => {
          console.log("Error In Fetching All Orders: ", err);
        }
      });
  }

  generateReport() {
    let tempData = this.orders;

    // Filter by Status
    if (this.filterStatus) {
      tempData = tempData.filter(order => 
        order.status.toLowerCase() === this.filterStatus.toLowerCase()
      );
    }

    // Filter by Date Range
    if (this.filterFromDate || this.filterToDate) {
      tempData = tempData.filter(order => {
        const orderDate = new Date(order.order_date);
        
        if (this.filterFromDate) {
          const fromDate = new Date(this.filterFromDate);
          fromDate.setHours(0, 0, 0, 0);
          if (orderDate < fromDate) return false;
        }
        
        if (this.filterToDate) {
          const toDate = new Date(this.filterToDate);
          toDate.setHours(23, 59, 59, 999);
          if (orderDate > toDate) return false;
        }
        
        return true;
      });
    }

    this.filteredData = tempData;
    this.showReport = true;
  }

  printReport() {
    window.print();
  }
}
