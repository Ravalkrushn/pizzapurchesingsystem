import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { AlertService } from '../services/alert.service';

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
  categories: any[] = [];
  isEditMode: boolean = false;
  currentEditingCatId: number | null = null;
  Math = Math;

  // Pagination
  currentPage: number = 1;
  itemsPerPage: number = 7;

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) {
    this.fetchCategories();
  }

  fetchCategories() {
    this.http.get("http://localhost:3000/fetch_categories").subscribe((res: any) => {
      this.categories = res;
    }, (err) => {
      console.error("Error fetching categories:", err);
    });
  }

  get paginatedCategories() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.categories.slice(startIndex, startIndex + this.itemsPerPage);
  }

  get totalPages() {
    return Math.ceil(this.categories.length / this.itemsPerPage);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }

  onsubmit() {
    if (this.catname == "" || this.cattype == "") {
      this.alertService.show("Please enter both category name and type.", 'info', 'Incomplete Form');
    } else {
      if (this.isEditMode) {
        this.updateCategory();
      } else {
        this.addCategory();
      }
    }
  }

  addCategory() {
    let obj = {
      name: this.catname,
      type: this.cattype
    };
    this.http.post("http://localhost:3000/add_category", obj).subscribe((res: any) => {
      if (res.cat_id) {
        this.alertService.show("New Category added to the system.", 'success', 'Success');
        this.resetForm();
        this.fetchCategories();
      } else {
        this.alertService.show("Could not add category. " + (res.message || ""), 'error', 'Error');
      }
    }, (err) => {
      console.error(err);
      this.alertService.show("A server error occurred while adding category.", 'error', 'Server Error');
    });
  }

  updateCategory() {
    let obj = {
      id: this.currentEditingCatId,
      name: this.catname,
      type: this.cattype
    };
    this.http.post("http://localhost:3000/update_category", obj).subscribe((res: any) => {
      this.alertService.show("Category details updated successfully.", 'success', 'Updated');
      this.resetForm();
      this.fetchCategories();
    }, (err) => {
      console.error(err);
      this.alertService.show("Failed to update category details.", 'error', 'Update Failed');
    });
  }

  onDelete(cat_id: number) {
    this.alertService.confirm("Are you sure you want to delete this category? This might affect pizzas associated with it.", () => {
      this.http.delete("http://localhost:3000/delete_category/" + cat_id).subscribe((res: any) => {
        this.alertService.show("Category has been removed from the system.", 'success', 'Deleted');
        this.fetchCategories();
      }, (err) => {
        console.error(err);
        this.alertService.show("An error occurred while deleting the category.", 'error', 'Delete Error');
      });
    }, () => {
      console.log("Category deletion cancelled.");
    }, "Delete Category?");
  }

  onEdit(cat: any) {
    this.isEditMode = true;
    this.currentEditingCatId = cat.cat_id;
    this.catname = cat.cat_name;
    this.cattype = cat.cat_type;
  }

  cancelEdit() {
    this.resetForm();
  }

  resetForm() {
    this.catname = "";
    this.cattype = "";
    this.isEditMode = false;
    this.currentEditingCatId = null;
  }
}
