import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-rest-new-order-view',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rest-new-order-view.component.html',
  styleUrl: './rest-new-order-view.component.css'
})
export class RestNewOrderViewComponent implements OnInit {
  orders: any[] = [];
  resid: any;

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) { }

  ngOnInit() {
    this.resid = localStorage.getItem("resid");
    if (!this.resid) {
      this.alertService.show("Please login as a restaurant to view orders.", 'info', 'Login Required', () => {
          this.router.navigate(['/login']);
      });
      return;
    }
    this.fetchOrders();
  }

  fetchOrders() {
    this.http.get("http://localhost:3000/fetch_rest_orders/" + this.resid).subscribe({
      next: (res: any) => {
        this.orders = res;
      },
      error: (err) => {
        console.log("Error fetching orders:", err);
        this.alertService.show("Could not fetch orders from the server.", 'error', 'Server Error');
      }
    });
  }

  updateStatus(orderId: number, status: string) {
    this.http.post("http://localhost:3000/update_order_status", { order_id: orderId, status: status }).subscribe({
      next: (res: any) => {
        this.alertService.show(`Order status has been updated to: ${status}`, 'success', 'Status Updated');
        this.fetchOrders();
      },
      error: (err) => {
        console.log("Error updating status:", err);
        this.alertService.show("Could not update the order status.", 'error', 'Error');
      }
    });
  }

}
