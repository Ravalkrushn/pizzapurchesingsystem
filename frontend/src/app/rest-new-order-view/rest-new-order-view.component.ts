import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.resid = localStorage.getItem("resid");
    if (!this.resid) {
      alert("Please login as a restaurant to view orders.");
      this.router.navigate(['/login']);
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
        alert("Could not fetch orders from the server.");
      }
    });
  }

  updateStatus(orderId: number, status: string) {
    this.http.post("http://localhost:3000/update_order_status", { order_id: orderId, status: status }).subscribe({
      next: (res: any) => {
        alert("Order status updated to " + status);
        this.fetchOrders();
      },
      error: (err) => {
        console.log("Error updating status:", err);
        alert("Could not update status.");
      }
    });
  }

}
