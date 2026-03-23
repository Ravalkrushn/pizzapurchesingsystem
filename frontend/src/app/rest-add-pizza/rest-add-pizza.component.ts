import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rest-add-pizza',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './rest-add-pizza.component.html',
  styleUrl: './rest-add-pizza.component.css'
})
export class RestAddPizzaComponent implements OnInit {
fileTypeError: boolean = false;
  txtimg: File | null = null;
  restid:any;
  categories: any[] = [];
  selectedType: string = '';

  constructor(public router: Router, public http: HttpClient) { }
  
  ngOnInit() {
    this.http.get("http://localhost:3000/fetch_categories").subscribe((res: any) => {
      console.log("Categories fetched:", res);
      this.categories = res;
    }, (err) => {
      console.error("Error fetching categories:", err);
    });
  }

  onCategoryChange(catId: any) {
    const selectedCat = this.categories.find(c => c.cat_id == catId);
    if (selectedCat) {
      this.selectedType = selectedCat.cat_type;
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.txtimg = input.files[0];
      this.validateFileType(input); // Pass the input element for validation
     
    } else {
      
    }
  }

  validateFileType(input: HTMLInputElement): void {
    this.fileTypeError = false;
   
    if (this.txtimg) {
      // Validate file type (e.g., only images)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
      if (!allowedTypes.includes(this.txtimg.type)) {
        this.fileTypeError = true;
      }
    }
  }

  onsubmit(form:NgForm){
    this.restid = localStorage.getItem("resid");
    if (this.txtimg) {
        const formData = new FormData();
        formData.append('image', this.txtimg, this.txtimg.name);
        formData.append('name', form.value.txtname); // Append other data
        formData.append('desc', form.value.txtdesc);
        formData.append('price', form.value.txtprice);
        formData.append('restid', this.restid);
        formData.append('catid', form.value.txtcatid);
        formData.append('type', form.value.txttype);
        
        this.http.post('http://localhost:3000/rest_add_pizza', formData)
        .subscribe({
            next:(response)=>{
              alert("Pizza Detail Saved Succesfully");
              this.router.navigate(["/rest_view_pizza"]);
            },
            error: (err)=>{
              alert("Error In Pizza uploading "+err);
              this.router.navigate(["/rest_add_pizza"]);
            }
        });
          
      }
  }
}
