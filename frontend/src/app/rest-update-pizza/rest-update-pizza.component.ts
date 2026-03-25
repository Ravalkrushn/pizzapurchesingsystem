import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

@Component({
  selector: 'app-rest-update-pizza',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './rest-update-pizza.component.html',

  styleUrl: './rest-update-pizza.component.css'
})
export class RestUpdatePizzaComponent implements OnInit {
  fileTypeError: boolean = false;
  txtimg: File | null = null;
  public pizzadetail: any;
  categories: any[] = [];

  restid: any;
  pid: any;
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute, private alertService: AlertService) {
    this.pid = this.route.snapshot.params["pid"];

  }
  ngOnInit() {
    this.fetchcategories();
    this.fetchpizzadetail();
  }
  fetchcategories() {
    this.http.get("http://localhost:3000/fetch_categories").subscribe((res: any) => {
      this.categories = res;
    });
  }

  fetchpizzadetail() {

    this.http.get("http://localhost:3000/fetch_single_pizza_detail/" + this.pid)
      .subscribe({
        next: (response: any) => {
          this.pizzadetail = response;
        },
        error: (err) => {
          console.log("Error In Fetching Pizza Detail: ", err);
        }
      })
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

  onCategoryChange(event: any) {
    const selectedCatId = event.target.value;
    const selectedCategory = this.categories.find(cat => cat.cat_id == selectedCatId);
    if (selectedCategory) {
      this.pizzadetail.pizza_type = selectedCategory.cat_type;
    }
  }

  onsubmit(form: NgForm) {
    this.restid = localStorage.getItem("resid");
    if (this.txtimg) {
      const formData = new FormData();
      formData.append('image', this.txtimg, this.txtimg.name);
      formData.append('name', form.value.txtname); // Append other data
      formData.append('desc', form.value.txtdesc);
      formData.append('price', form.value.txtprice);
      formData.append('restid', this.restid);
      formData.append('pizzaid', form.value.txtpid);
      formData.append('catid', form.value.txtcatid);
      formData.append('type', form.value.txttype);


      this.http.post('http://localhost:3000/rest_update_pizza_withimg', formData)
        .subscribe({
          next: (response) => {
            this.alertService.show("Pizza details and image updated successfully.", 'success', 'Update Complete', () => {
                this.router.navigate(["/rest_view_pizza"]);
            });
          },
          error: (err) => {
            this.alertService.show("Failed to update pizza with image.", 'error', 'Error');
          }
        });

    }else{
       const pdata ={
        name: form.value.txtname,
        desc: form.value.txtdesc,
        price: form.value.txtprice,
        restid: this.restid,
        pizzaid: form.value.txtpid,
        catid: form.value.txtcatid,
        type: form.value.txttype
       }


      this.http.post("http://localhost:3000/rest_update_pizza", pdata)
        .subscribe({
          next: (response) => {
            this.alertService.show("Pizza details updated successfully.", 'success', 'Update Complete', () => {
                this.router.navigate(["/rest_view_pizza"]);
            });
          },
          error: (err) => {
            this.alertService.show("Failed to update pizza details.", 'error', 'Error');
          }
        });
    }
  }

}
