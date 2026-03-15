import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cust-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cust-cart.component.html',
  styleUrl: './cust-cart.component.css'
})
export class CustCartComponent implements OnInit {
  cartItems: any[] = [];
  totalAmount: number = 0;
  customerDetail: any = null;
  deliveryAddress: string = "";
  deliveryMobileNo: string = "";
  useDefaultAddress: boolean = true;
  
  custid: any;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.custid = localStorage.getItem("custid");
    if (!this.custid) {
      this.router.navigate(['/login']);
      return;
    }
    
    this.loadCart();
    this.fetchCustomerDetail();
  }

  loadCart() {
    this.cartItems = JSON.parse(localStorage.getItem("pizza_cart") || "[]");
    this.calculateTotal();
  }

  calculateTotal() {
    this.totalAmount = this.cartItems.reduce((acc, item) => acc + (item.price * item.qty), 0);
  }

  fetchCustomerDetail() {
    this.http.get("http://localhost:3000/fetch_single_custdetail/" + this.custid).subscribe((res: any) => {
      this.customerDetail = res;
      this.deliveryAddress = res.address;
      this.deliveryMobileNo = res.mobile_no;
    });
  }

  removeItem(index: number) {
    this.cartItems.splice(index, 1);
    localStorage.setItem("pizza_cart", JSON.stringify(this.cartItems));
    this.calculateTotal();
  }

  updateQty(index: number, newQty: number) {
    if (newQty < 1) return;
    this.cartItems[index].qty = newQty;
    localStorage.setItem("pizza_cart", JSON.stringify(this.cartItems));
    this.calculateTotal();
  }

  onAddressTypeChange() {
    if (this.useDefaultAddress && this.customerDetail) {
      this.deliveryAddress = this.customerDetail.address;
      this.deliveryMobileNo = this.customerDetail.mobile_no;
    } else if (!this.useDefaultAddress) {
      this.deliveryAddress = "";
      this.deliveryMobileNo = "";
    }
  }

  placeOrder() {
    if (this.cartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }
    if (this.deliveryAddress.trim() === "") {
      alert("Please provide a delivery address!");
      return;
    }

    const orderData = {
      customer_id: this.custid,
      parcel_id: this.cartItems[0].res_id, // Using res_id as parcel_id for now as per schema
      res_id: this.cartItems[0].res_id,
      items: this.cartItems.map(item => ({
        pizza_id: item.pizza_id,
        pizza_name: item.pizza_name,
        qty: item.qty,
        price: item.price
      })),
      total_amount: this.totalAmount,
      del_address: this.deliveryAddress,
      delivery_address: this.deliveryAddress,
      del_moblie_no: this.deliveryMobileNo
    };

    this.http.post("http://localhost:3000/place_order", orderData).subscribe((res: any) => {
      if (res.order_id) {
        alert("Order Placed Successfully! Order ID: " + res.order_id);
        localStorage.removeItem("pizza_cart");
        this.router.navigate(['/cust_view_parcel']);
      } else {
        alert("Error placing order. Please try again.");
      }
    }, (err) => {
      alert("Server Error while placing order.");
    });
  }
}
