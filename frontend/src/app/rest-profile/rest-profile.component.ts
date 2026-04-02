import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-rest-profile',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './rest-profile.component.html',
  styleUrl: './rest-profile.component.css'
})
export class RestProfileComponent implements OnInit {
  public resdetail: any = {};
  public rid: any;

  constructor(private http: HttpClient, private alertService: AlertService) {
    this.rid = localStorage.getItem("resid");
  }

  ngOnInit() {
    if (this.rid) {
      this.fetchProfile();
    }
  }

  fetchProfile() {
    this.http.get("http://localhost:3000/fetch_single_resdetail/" + this.rid)
      .subscribe({
        next: (response: any) => {
          this.resdetail = response;
        },
        error: (err) => {
          console.error("Error fetching restaurant profile:", err);
          this.alertService.show("Could not load profile details.", 'error', 'Error');
        }
      });
  }

  onsubmit(form: NgForm) {
    const rdata = {
      name: form.value.txtname,
      add: form.value.txtadd,
      city: form.value.txtcity,
      mno: form.value.txtmno,
      email: form.value.txtemail,
      pwd: form.value.txtpwd,
      rid: this.rid // Current restaurant ID
    };

    this.http.post("http://localhost:3000/update_restaurant", rdata)
      .subscribe({
        next: (response: any) => {
          this.alertService.show("Profile updated successfully.", 'success', 'Update Complete');
          this.fetchProfile(); // Refresh data
        },
        error: (err) => {
          console.error("Error updating profile:", err);
          this.alertService.show("Could not update profile.", 'error', 'Error');
        }
      });
  }
}
