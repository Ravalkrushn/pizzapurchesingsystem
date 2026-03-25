import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-restaurant-regis',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './restaurant-regis.component.html',
  styleUrl: './restaurant-regis.component.css'
})
export class RestaurantRegisComponent {
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

    this.http.post("http://localhost:3000/res_regis",rdata)
      .subscribe({
        next:(response:any)=>{
          if(response.message == "Email Id Already Exists"){
            this.alertService.show("Email Id Already Exists", 'error', 'Duplicate Email');
          }else if(response.res_name){
            this.alertService.show("Restaurant Registered Successfully", 'success', 'Welcome Partner!', () => {
              this.router.navigate(["/login"]);
            });
          }else{
            this.alertService.show("Please check your data and try again.", 'error', 'Registration Failed');
          }
        },
        error:(err)=>{
          console.log("Error In Restaurant Registration: ",err);
          this.alertService.show("Connection error. Please try again later.", 'error', 'Server Error');
        }
      })
  }
}
