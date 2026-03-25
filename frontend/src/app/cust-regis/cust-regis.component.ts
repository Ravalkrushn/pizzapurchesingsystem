import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-cust-regis',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './cust-regis.component.html',
  styleUrl: './cust-regis.component.css'
})
export class CustRegisComponent {
 constructor(private router:Router,private http:HttpClient, private alertService: AlertService){

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
            this.alertService.show("Email Id Already Exists", 'error', 'Duplicate Email');
          }else if(response.customer_name){
            this.alertService.show("Customer Registered Successfully", 'success', 'Congratulations!', () => {
              this.router.navigate(["/login"]);
            });
          }else{
            this.alertService.show("Please check your data and try again.", 'error', 'Registration Failed');
          }
        },
        error:(err)=>{
          console.log("Error In Customer Registration: ",err);
          this.alertService.show("Connection error. Please try again later.", 'error', 'Server Error');
        }
      })
  }
}
