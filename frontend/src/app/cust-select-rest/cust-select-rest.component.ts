import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cust-select-rest',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cust-select-rest.component.html',
  styleUrl: './cust-select-rest.component.css'
})
export class CustSelectRestComponent implements OnInit {
  restaurants: any[] = [];
  filteredRestaurants: any[] = [];
  searchText: string = "";

  constructor(private http: HttpClient, private router: Router) { }

  ngOnInit() {
    this.fetchRestaurants();
  }

  fetchRestaurants() {
    this.http.get("http://localhost:3000/fetch_resdetail").subscribe((res: any) => {
      this.restaurants = res;
      this.filteredRestaurants = res;
    }, (err) => {
      console.error("Error fetching restaurants", err);
    });
  }

  filterByCity() {
    if (this.searchText.trim() == "") {
      this.filteredRestaurants = this.restaurants;
    } else {
      this.filteredRestaurants = this.restaurants.filter(res => 
        res.city.toLowerCase().includes(this.searchText.toLowerCase()) ||
        res.res_name.toLowerCase().includes(this.searchText.toLowerCase())
      );
    }
  }

  viewMenu(resid: any) {
    localStorage.setItem("selected_resid", resid);
    this.router.navigate(['/cust_view_pizza']);
  }
}
