import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-cust-view-pizza',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cust-view-pizza.component.html',
  styleUrl: './cust-view-pizza.component.css'
})
export class CustViewPizzaComponent implements OnInit {
  pizzas: any[] = [];
  filteredPizzas: any[] = [];
  categories: any[] = [];
  selectedRes: any = null;
  
  // Filter variables
  searchName: string = "";
  selectedCatId: string = "";
  selectedType: string = "";
  
  resid: any;

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.resid = localStorage.getItem("selected_resid");
    if (!this.resid) {
      this.router.navigate(['/cust_select_rest']);
      return;
    }
    this.fetchRestaurantInfo();
    this.fetchCategories();
    this.fetchPizzas();
  }

  fetchRestaurantInfo() {
    this.http.get("http://localhost:3000/fetch_single_resdetail/" + this.resid).subscribe((res: any) => {
      this.selectedRes = res;
    });
  }

  fetchCategories() {
    this.http.get("http://localhost:3000/fetch_categories").subscribe((res: any) => {
      this.categories = res;
    });
  }

  fetchPizzas() {
    this.http.get("http://localhost:3000/fetch_pizza_detail/" + this.resid).subscribe((res: any) => {
      // Add a 'qty' property to each pizza for the counter
      this.pizzas = res.map((p: any) => ({ ...p, qty: 1 }));
      this.filteredPizzas = this.pizzas;
    });
  }

  applyFilters() {
    this.filteredPizzas = this.pizzas.filter(p => {
      const matchName = p.pizza_name.toLowerCase().includes(this.searchName.toLowerCase());
      const matchCat = this.selectedCatId === "" || p.cat_id == this.selectedCatId;
      const matchType = this.selectedType === "" || p.pizza_type == this.selectedType;
      return matchName && matchCat && matchType;
    });
  }

  addToCart(pizza: any) {
    let cart = JSON.parse(localStorage.getItem("pizza_cart") || "[]");
    
    // Check if pizza already exists in cart for this restaurant
    const index = cart.findIndex((item: any) => item.pizza_id === pizza.pizza_id);
    
    if (index > -1) {
      cart[index].qty += pizza.qty;
    } else {
      cart.push({
        pizza_id: pizza.pizza_id,
        pizza_name: pizza.pizza_name,
        price: pizza.price,
        qty: pizza.qty,
        pizza_img: pizza.pizza_img,
        res_id: this.resid
      });
    }

    localStorage.setItem("pizza_cart", JSON.stringify(cart));
    alert(pizza.pizza_name + " added to cart!");
  }
}
