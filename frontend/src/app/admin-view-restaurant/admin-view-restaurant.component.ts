import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-view-restaurant',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-view-restaurant.component.html',
  styleUrl: './admin-view-restaurant.component.css'
})
export class AdminViewRestaurantComponent {
  public resdetail: any [] = [];  
  constructor(private http:HttpClient,private router:Router){
    this.fetchresdetail();
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
    if(confirm("Are You Sure To Delete This Restaurant? Then Press OK ")){
      this.http.delete("http://localhost:3000/delete_restaurant/"+rid)
        .subscribe({
          next:(response: any)=>{
            alert("Restaurant Delete Successfully");
            this.fetchresdetail();
          },
          error: (err)=>{
            console.log("Error In Deletion Of Restaurant: ",err);
          }
        })
    }
  }
}
