import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

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

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) { }

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
    this.alertService.confirm("Are you sure you want to cancel this order? This cannot be undone once confirmed.", () => {
      this.http.post("http://localhost:3000/cancel_order", { order_id: orderId }).subscribe((res: any) => {
        if (res.modifiedCount > 0) {
          this.alertService.show("Your order has been cancelled successfully.", 'success', 'Order Cancelled');
          this.fetchOrders();
        } else {
          this.alertService.show("Could not cancel the order at this stage. It may have already been processed.", 'info', 'Status Update');
        }
      });
    }, () => {
      console.log("Order cancellation aborted.");
    }, "Cancel Order?");
  }

  submitRating(orderId: number, rating: number) {
    this.http.post("http://localhost:3000/submit_rating", { order_id: orderId, rating: rating }).subscribe((res: any) => {
      this.alertService.show("Thank you for your feedback! It helps us improve.", 'success', 'Rating Submitted');
      this.fetchOrders();
    });
  }

  reorder(order: any) {
    localStorage.setItem("pizza_cart", JSON.stringify(order.items));
    this.router.navigate(['/cust_cart']);
  }
}
