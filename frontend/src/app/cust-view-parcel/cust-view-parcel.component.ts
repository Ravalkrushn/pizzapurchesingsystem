import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cust-view-parcel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cust-view-parcel.component.html',
  styleUrl: './cust-view-parcel.component.css'
})
export class CustViewParcelComponent implements OnInit {
  orders: any[] = [];
  activeOrders: any[] = [];
  pastOrders: any[] = [];
  custid: any;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.custid = localStorage.getItem("custid");
    if (!this.custid) {
      this.router.navigate(['/login']);
      return;
    }
    this.fetchOrders();
  }

  fetchOrders() {
    this.http.get("http://localhost:3000/fetch_cust_orders/" + this.custid).subscribe((res: any) => {
      this.orders = res;
      this.activeOrders = this.orders.filter(o => o.status !== 'Delivered' && o.status !== 'Cancelled');
      this.pastOrders = this.orders.filter(o => o.status === 'Delivered' || o.status === 'Cancelled');
    });
  }

  cancelOrder(orderId: number) {
    if (confirm("Are you sure you want to cancel this order?")) {
      this.http.post("http://localhost:3000/cancel_order", { order_id: orderId }).subscribe((res: any) => {
        if (res.modifiedCount > 0) {
          alert("Order cancelled successfully.");
          this.fetchOrders();
        } else {
          alert("Could not cancel order. It might already be accepted.");
        }
      });
    }
  }

  submitRating(orderId: number, rating: number) {
    this.http.post("http://localhost:3000/submit_rating", { order_id: orderId, rating: rating }).subscribe((res: any) => {
      alert("Thanks for your rating!");
      this.fetchOrders();
    });
  }

  reorder(order: any) {
    localStorage.setItem("pizza_cart", JSON.stringify(order.items));
    this.router.navigate(['/cust_cart']);
  }
}
