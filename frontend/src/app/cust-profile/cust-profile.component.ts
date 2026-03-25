import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-cust-profile',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cust-profile.component.html',
  styleUrl: './cust-profile.component.css'
})
export class CustProfileComponent implements OnInit {
  customerData: any = null;
  isEditing: boolean = false;
  editData: any = {};
  showPassword: boolean = false;

  constructor(private http: HttpClient, private alertService: AlertService) {}

  ngOnInit(): void {
    this.fetchProfile();
  }

  fetchProfile() {
    const custId = localStorage.getItem('custid');
    if (custId) {
      this.http.get(`http://localhost:3000/fetch_single_custdetail/${custId}`)
        .subscribe({
          next: (res: any) => {
            if (res) {
              this.customerData = res;
            }
          },
          error: (err) => {
            console.error('Error fetching customer details', err);
          }
        });
    }
  }

  onEdit() {
    this.isEditing = true;
    this.editData = { ...this.customerData };
  }

  onCancel() {
    this.isEditing = false;
  }

  onSave() {
    if(!this.editData.customer_name || !this.editData.email_id || !this.editData.mobile_no || !this.editData.city || !this.editData.address || !this.editData.pwd) {
      this.alertService.show("All fields are required to update your profile.", 'info', 'Incomplete Form');
      return;
    }

    const payload = {
      cid: this.editData.customer_id,
      name: this.editData.customer_name,
      add: this.editData.address,
      city: this.editData.city,
      mno: this.editData.mobile_no,
      email: this.editData.email_id,
      pwd: this.editData.pwd
    };

    this.http.post('http://localhost:3000/update_customer', payload)
      .subscribe({
        next: (res: any) => {
          this.alertService.show("Your profile details have been updated successfully.", 'success', 'Profile Updated');
          this.isEditing = false;
          this.fetchProfile(); // Refresh the data
        },
        error: (err) => {
          console.error("Error updating profile", err);
          this.alertService.show("An error occurred while updating your profile.", 'error', 'Error');
        }
      });
  }
}
