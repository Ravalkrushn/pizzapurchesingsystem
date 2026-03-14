import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-update-customer',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './admin-update-customer.component.html',
  styleUrl: './admin-update-customer.component.css'
})
export class AdminUpdateCustomerComponent {
public custdetail: any;  
  public cid;
    constructor(private http:HttpClient,private router:Router,private route:ActivatedRoute){
      this.cid = this.route.snapshot.params["cid"];
    }
    ngOnInit()
    {
      this.fetchsinglecustdetail();
    }
    fetchsinglecustdetail(){
      this.http.get("http://localhost:3000/fetch_single_custdetail/"+this.cid)
        .subscribe({
          next: (response:any)=>{
              this.custdetail = response;
          },
          error:(err)=>{
            console.log("Error In Fetching Customer Detail: ",err);
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
      cid: form.value.txtcid
    }

    this.http.post("http://localhost:3000/update_customer",rdata)
      .subscribe({
        next:(response:any)=>{
          
            alert("Customer Detail Updated Successfully");
            this.router.navigate(["/admin_view_customer"]);
          
        },
        error:(err)=>{
          console.log("Error In Customer Detail Updation: ",err);
        }
      })
  }
}
