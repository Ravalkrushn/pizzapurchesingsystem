import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-cust-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cust-cart.component.html',
  styleUrl: './cust-cart.component.css'
})
export class CustCartComponent implements OnInit {
  paymentMode: string = 'cod';
  cartItems: any[] = [];
  totalAmount: number = 0;
  customerDetail: any = null;
  deliveryAddress: string = "";
  deliveryMobileNo: string = "";
  useDefaultAddress: boolean = true;
  
  custid: any;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private alertService: AlertService) { }

  ngOnInit() {
    this.custid = localStorage.getItem("custid");
    if (!this.custid) {
      this.router.navigate(['/login']);
      return;
    }
    
    // Check if returning from Stripe Checkout
    this.route.queryParams.subscribe(params => {
      if (params['payment_success'] === 'true') {
        const tempDetails = JSON.parse(localStorage.getItem("temp_order_details") || "{}");
        if (tempDetails.deliveryAddress) {
          this.deliveryAddress = tempDetails.deliveryAddress;
          this.deliveryMobileNo = tempDetails.deliveryMobileNo;
          this.cartItems = JSON.parse(localStorage.getItem("pizza_cart") || "[]");
          this.calculateTotal();
          // Auto submit the order since payment is done
          this.submitOrderToBackend();
        }
      } else {
        this.loadCart();
        this.fetchCustomerDetail();
      }
    });
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
      this.alertService.show("Your cart is empty! Please add some pizzas first.", 'info', 'Empty Cart');
      return;
    }
    if (this.deliveryAddress.trim() === "") {
      this.alertService.show("Please provide a valid delivery address.", 'info', 'Missing Address');
      return;
    }

    if (this.paymentMode === 'online') {
      // Temporarily save details before leaving the site for Stripe
      localStorage.setItem("temp_order_details", JSON.stringify({
        deliveryAddress: this.deliveryAddress,
        deliveryMobileNo: this.deliveryMobileNo
      }));

      // Call backend to create checkout session
      this.http.post("http://localhost:3000/create-checkout-session", { amount: this.totalAmount })
        .subscribe((res: any) => {
          if (res.url) {
            window.location.href = res.url; // Redirects browser to Stripe Checkout page
          } else {
            this.alertService.show("Stripe payment URL could not be generated.", 'error', 'Payment Error');
          }
        }, (err) => {
          this.alertService.show("Server error connecting to Stripe. Please check backend configuration.", 'error', 'Error');
        });
    } else {
      this.submitOrderToBackend(); // COD
    }
  }

  submitOrderToBackend() {
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
        this.alertService.show(`Your order #ORD${res.order_id} has been placed successfully! Enjoy your meal.`, 'success', 'Order Confirmed', () => {
             localStorage.removeItem("pizza_cart");
             localStorage.removeItem("temp_order_details"); // Clean up
             this.router.navigate(['/cust_view_parcel']);
        });
      } else {
        this.alertService.show("We encountered an error while placing your order. Please try again.", 'error', 'Error');
      }
    }, (err) => {
      this.alertService.show("A server-side error occurred while processing your order.", 'error', 'Server Error');
    });
  }
}
