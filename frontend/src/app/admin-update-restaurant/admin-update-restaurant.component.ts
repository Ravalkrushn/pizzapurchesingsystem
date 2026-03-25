import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-admin-update-restaurant',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-update-restaurant.component.html',
  styleUrl: './admin-update-restaurant.component.css'
})
export class AdminUpdateRestaurantComponent {
  public resdetail: any;  
  public rid;
    constructor(private http:HttpClient,private router:Router,private route:ActivatedRoute, private alertService: AlertService){
      this.rid = this.route.snapshot.params["rid"];
    }
    ngOnInit()
    {
      this.fetchsingleresdetail();
    }
    fetchsingleresdetail(){
      this.http.get("http://localhost:3000/fetch_single_resdetail/"+this.rid)
        .subscribe({
          next: (response:any)=>{
              this.resdetail = response;
          },
          error:(err)=>{
            console.log("Error In Fetching Restaurant Detail: ",err);
          }
        })
    }
  onsubmit(form:NgForm){
    const rdata = {
      name: form.value.txtname,
      add: form.value.txtadd,
      city: form.value.txtcity,
      mno: form.value.txtmno,
      email: form.value.txtemail,
      pwd: form.value.txtpwd,
      rid: form.value.txtrid
    }

    this.http.post("http://localhost:3000/update_restaurant",rdata)
      .subscribe({
        next:(response:any)=>{
            this.alertService.show("Restaurant information updated in the system.", 'success', 'Update Successful', () => {
                this.router.navigate(["/admin_view_restaurant"]);
            });
        },
        error:(err)=>{
          console.log("Error In Restaurant Registration: ",err);
          this.alertService.show("Could not update restaurant details.", 'error', 'Error');
        }
      })
  }
}
