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
    });
  }
}
