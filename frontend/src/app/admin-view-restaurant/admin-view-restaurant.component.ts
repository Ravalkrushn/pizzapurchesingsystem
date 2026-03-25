import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-admin-view-restaurant',
  standalone: true,
  imports: [RouterLink, CommonModule, MatIconModule],
  templateUrl: './admin-view-restaurant.component.html',
  styleUrl: './admin-view-restaurant.component.css'
})
export class AdminViewRestaurantComponent {
  public resdetail: any [] = [];  
  Math = Math;
  currentPage: number = 1;
  itemsPerPage: number = 6;

  constructor(private http:HttpClient,private router:Router, private alertService: AlertService){
    this.fetchresdetail();
  }

  get paginatedResDetail() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.resdetail.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.resdetail.length / this.itemsPerPage);
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

  fetchresdetail(){
    this.http.get("http://localhost:3000/fetch_resdetail")
      .subscribe({
        next: (response:any)=>{
            this.resdetail = response;
        },
        error:(err)=>{
          console.log("Error In Fetching Restaurant Detail: ",err);
        }
      })
  }

  ondelete(rid:Number){
    this.alertService.confirm("Are you sure you want to permanently delete this restaurant? This action cannot be undone.", () => {
      this.http.delete("http://localhost:3000/delete_restaurant/"+rid)
        .subscribe({
          next:(response: any)=>{
            this.alertService.show("Restaurant has been permanently removed.", 'success', 'Deleted');
            this.fetchresdetail();
          },
          error: (err)=>{
            console.log("Error In Deletion Of Restaurant: ",err);
            this.alertService.show("An error occurred while deleting the restaurant.", 'error', 'Error');
          }
        });
    }, () => {
      console.log("Deletion cancelled by user.");
    }, "Delete Restaurant?");
  }
}
