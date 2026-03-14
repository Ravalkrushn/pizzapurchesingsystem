import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-admin-add-category',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  templateUrl: './admin-add-category.component.html',
  styleUrl: './admin-add-category.component.css'
})
export class AdminAddCategoryComponent {
  catname: string = "";
  cattype: string = ""; // Veg/Non-Veg

  constructor(private http: HttpClient, private router: Router) {}

  onsubmit() {
    if (this.catname == "" || this.cattype == "") {
      alert("Please enter all details");
    } else {
      let obj = {
        name: this.catname,
        type: this.cattype
      };
      this.http.post("http://localhost:3000/add_category", obj).subscribe((res: any) => {
        console.log("Category Add Response:", res);
        if (res.cat_id) {
          alert("Category Added Successfully");
          this.catname = "";
          this.cattype = "";
        } else {
          alert("Error adding category: " + (res.message || "Unknown error"));
        }
      }, (err) => {
        console.error(err);
        alert("Server Error: Please make sure the backend is running and you have RESTARTED it after the code changes.");
      });
    }
  }
}
