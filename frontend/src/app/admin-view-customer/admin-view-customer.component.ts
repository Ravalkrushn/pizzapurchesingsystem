import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-view-customer',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule],
  templateUrl: './admin-view-customer.component.html',
  styleUrl: './admin-view-customer.component.css'
})
export class AdminViewCustomerComponent {
public custdetail: any [] = [];  
Math = Math;
currentPage: number = 1;
itemsPerPage: number = 6;

  constructor(private http:HttpClient,private router:Router){
    this.fetchcustdetail();
  }

  get paginatedCustDetail() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.custdetail.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.custdetail.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
  fetchcustdetail(){
    this.http.get("http://localhost:3000/fetch_custdetail")
      .subscribe({
        next: (response:any)=>{
            this.custdetail = response;
        },
        error:(err)=>{
          console.log("Error In Fetching Customer Detail: ",err);
        }
      })
  }

  ondelete(cid:Number){
    if(confirm("Are You Sure To Delete This Customer Detial? Then Press OK ")){
      this.http.delete("http://localhost:3000/delete_customer/"+cid)
        .subscribe({
          next:(response: any)=>{
            alert("Customer Deleted Successfully");
            this.fetchcustdetail();
          },
          error: (err)=>{
            console.log("Error In Deletion Of Customer Detail: ",err);
          }
        })
    }
  }
}
