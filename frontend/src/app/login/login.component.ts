import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
constructor(private router:Router,private http:HttpClient,public authservice:AuthserviceService){

  }

  onsubmit(form:NgForm){
    const rdata = {
     
      email: form.value.txtemail,
      pwd: form.value.txtpwd
    }

    this.http.post("http://localhost:3000/login_user",rdata)
      .subscribe({
        next:(response:any)=>{
          console.log("Login Response from Backend: ", response);
          if(response.message=="Admin Login Successfully"){
            localStorage.setItem("adminemail","admin");
            this.authservice.adminloggedin= true;
            alert("Admin Login Successfully");
            this.router.navigate(["/admin_view_restaurant"]);
          }else if(response.customer_name){
            localStorage.setItem("custid",response.customer_id);
            this.authservice.custloggedin = true;
            alert("Customer Login Successfully");
            this.router.navigate(["/cust_select_rest"]);

          }else if(response.res_name){
            localStorage.setItem("resid",response.res_id);
            this.authservice.restloggedin = true;
            alert("Restaurant Login Successfully");
            this.router.navigate(["/rest_view_pizza"]);
          }else{
            alert("Check Your Email Id Or Password")
          }
        },
        error:(err)=>{
          console.log("Error In Login: ", err);
          alert("Server se connect nahi ho pa raha hai. F12 daba kar Console check karein.");
        }
      })
  }
}
