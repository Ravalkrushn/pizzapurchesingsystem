import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-rest-view-pizza',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './rest-view-pizza.component.html',
  styleUrl: './rest-view-pizza.component.css'
})
export class RestViewPizzaComponent {
  public pizzadetail: any [] = [];  
  restid:any;
  constructor(private http:HttpClient,private router:Router){
    this.fetchpizzadetail();
  }
  fetchpizzadetail(){
    this.restid = localStorage.getItem("resid");
    this.http.get("http://localhost:3000/fetch_pizza_detail/"+this.restid)
      .subscribe({
        next: (response:any)=>{
            this.pizzadetail = response;
        },
        error:(err)=>{
          console.log("Error In Fetching Pizza Detail: ",err);
        }
      })
  }

  ondelete(pid:Number){
    if(confirm("Are You Sure To Delete This Pizza Detial? Then Press OK ")){
      this.http.delete("http://localhost:3000/delete_pizza/"+pid)
        .subscribe({
          next:(response: any)=>{
            alert("Pizza Deleted Successfully");
            this.fetchpizzadetail();
          },
          error: (err)=>{
            console.log("Error In Deletion Of Customer Detail: ",err);
          }
        })
    }
  }

}
