import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-view-customer',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './admin-view-customer.component.html',
  styleUrl: './admin-view-customer.component.css'
})
export class AdminViewCustomerComponent {
public custdetail: any [] = [];  
  constructor(private http:HttpClient,private router:Router){
    this.fetchcustdetail();
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
