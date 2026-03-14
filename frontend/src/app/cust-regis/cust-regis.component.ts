import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cust-regis',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cust-regis.component.html',
  styleUrl: './cust-regis.component.css'
})
export class CustRegisComponent {
 constructor(private router:Router,private http:HttpClient){

  }

  onsubmit(form:NgForm){
    const rdata = {
      name: form.value.txtname,
      add: form.value.txtadd,
      city: form.value.txtcity,
      mno: form.value.txtmno,
      email: form.value.txtemail,
      pwd: form.value.txtpwd
    }

    this.http.post("http://localhost:3000/cust_regis",rdata)
      .subscribe({
        next:(response:any)=>{
          if(response.message == "Email Id Already Exists"){
            alert("Email Id Already Exists");
          }else if(response.customer_name){
            alert("Customer Registered Successfully");
            this.router.navigate(["/login"]);
          }else{
            alert("Check Your Data");
          }
        },
        error:(err)=>{
          console.log("Error In Restaurant Registration: ",err);
        }
      })
  }
}
