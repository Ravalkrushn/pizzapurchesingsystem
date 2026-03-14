import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rest-add-pizza',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './rest-add-pizza.component.html',
  styleUrl: './rest-add-pizza.component.css'
})
export class RestAddPizzaComponent {
fileTypeError: boolean = false;
  txtimg: File | null = null;
  restid:any;
  constructor(public router: Router, public http: HttpClient) { }
  
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
