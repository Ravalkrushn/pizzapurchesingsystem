import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

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
  constructor(private http:HttpClient,private router:Router){
  }

  ngOnInit() {
    if (typeof localStorage !== 'undefined') {
      this.restid = localStorage.getItem("resid");
      if(this.restid){
        this.fetchpizzadetail();
      } else {
        alert("Aap logged in nahi hain! Kripya pehle Restaurant account se Login karein.");
        this.router.navigate(['/login']);
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
            alert("Server se pizza fetch nahi ho raha hai. Backend on hai ya nahi check karein.");
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
