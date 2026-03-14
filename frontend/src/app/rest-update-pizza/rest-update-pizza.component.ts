import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-rest-update-pizza',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './rest-update-pizza.component.html',
  styleUrl: './rest-update-pizza.component.css'
})
export class RestUpdatePizzaComponent {
  fileTypeError: boolean = false;
  txtimg: File | null = null;
  public pizzadetail: any;
  restid: any;
  pid: any;
  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
    this.pid = this.route.snapshot.params["pid"];

  }
  ngOnInit() {
    this.fetchpizzadetail();
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

      this.http.post('http://localhost:3000/rest_update_pizza_withimg', formData)
        .subscribe({
          next: (response) => {
            alert("Pizza Detail Updated Succesfully");
            this.router.navigate(["/rest_view_pizza"]);
          },
          error: (err) => {
            alert("Error In Pizza Detail Updating " + err);
            this.router.navigate(["/rest_update_pizza"]);
          }
        });

    }else{
       const pdata ={
        name: form.value.txtname,
        desc: form.value.txtdesc,
        price: form.value.txtprice,
        restid: this.restid,
        pizzaid: form.value.txtpid
       }

      this.http.post("http://localhost:3000/rest_update_pizza", pdata)
        .subscribe({
          next: (response) => {
            alert("Pizza Detail Updated Succesfully");
            this.router.navigate(["/rest_view_pizza"]);
          },
          error: (err) => {
            alert("Error In Pizza Detail Updating " + err);
            this.router.navigate(["/rest_update_pizza"]);
          }
        });
    }
  }

}
