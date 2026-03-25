import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthserviceService } from '../authservice.service';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
constructor(private router:Router,private http:HttpClient,public authservice:AuthserviceService, private alertService: AlertService){

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
            this.alertService.show("Welcome Admin! Access granted.", 'success', 'Admin Login', () => {
              this.router.navigate(["/admin_view_restaurant"]);
            });
          }else if(response.customer_name){
            localStorage.setItem("custid",response.customer_id);
            this.authservice.custloggedin = true;
            this.alertService.show(`Welcome back, ${response.customer_name}!`, 'success', 'Login Successful', () => {
              this.router.navigate(["/cust_select_rest"]);
            });

          }else if(response.res_name){
            localStorage.setItem("resid",response.res_id);
            this.authservice.restloggedin = true;
            this.alertService.show(`Restaurant Login Successful: ${response.res_name}`, 'success', 'Partner Login', () => {
              this.router.navigate(["/rest_view_pizza"]);
            });
          }else{
            this.alertService.show("Invalid email or password. Please try again.", 'error', 'Login Failed');
          }
        },
        error:(err)=>{
          console.log("Error In Login: ", err);
          this.alertService.show("Server connection failed. Please check if backend is running.", 'error', 'Error');
        }
      })
  }
}
