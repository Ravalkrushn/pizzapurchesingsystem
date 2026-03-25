import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-rest-view-pizza',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './rest-view-pizza.component.html',
  styleUrl: './rest-view-pizza.component.css'
})
export class RestViewPizzaComponent implements OnInit {
  public pizzadetail: any [] = [];  
  restid:any;
  constructor(private http:HttpClient,private router:Router, private alertService: AlertService){
  }

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      this.restid = localStorage.getItem("resid");
      if(this.restid){
        this.fetchpizzadetail();
      } else {
        this.alertService.show("You are not logged in! Please login with your Restaurant account first.", 'info', 'Session Expired', () => {
             this.router.navigate(['/login']);
        });
      }
    }
  }

  fetchpizzadetail(){
    this.http.get("http://localhost:3000/fetch_pizza_detail/"+this.restid)
      .subscribe({
        next: (response:any)=>{
            this.pizzadetail = response;
            console.log("Fetched Pizza Data: ", response);
        },
        error:(err)=>{
          console.log("Error In Fetching Pizza Detail: ",err);
            this.alertService.show("Could not fetch pizza menu from server.", 'error', 'Server Error');
        }
      })
  }

  ondelete(pid:Number){
    this.alertService.confirm("Are you sure you want to remove this pizza from your menu? This action is permanent.", () => {
      this.http.delete("http://localhost:3000/delete_pizza/"+pid)
        .subscribe({
          next:(response: any)=>{
            this.alertService.show("Pizza has been removed from your menu.", 'success', 'Deleted');
            this.fetchpizzadetail();
          },
          error: (err)=>{
            console.log("Error In Deletion Of Customer Detail: ",err);
            this.alertService.show("Failed to delete the pizza.", 'error', 'Error');
          }
        });
    }, () => {
      console.log("Pizza deletion cancelled.");
    }, "Delete Pizza?");
  }

}
