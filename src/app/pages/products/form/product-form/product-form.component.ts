import { CommonModule, NgFor } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatInputModule } from '@angular/material/input';
import { ProductService } from '../../../../services/product.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Category, CategoryService } from '../../../../services/category.service';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-product-form',
  standalone: true,
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
  imports: [
    CommonModule,
    MatCardModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatOptionModule,
    MatSelectModule,
    NgFor,
    ReactiveFormsModule,
  ],
})
export class ProductFormComponent implements OnInit {

  form: FormGroup;
  productId: number | null = null;
  categories: Category[] = [];
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private productService: ProductService,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<ProductFormComponent>,
    private snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(0)]],
      available: [true, Validators.required],
      categoryId: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadCategories();
    if (this.data?.id) {
      this.productId = this.data.id;
      this.isEditMode = true;
      this.loadProduct();
    }
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  loadProduct() {
    if (this.productId) {
      this.productService.getProductById(this.productId).subscribe(
        (product) => {
          this.form.patchValue({
            name: product.name,
            description: product.description,
            price: product.price,
            available: product.available,
            categoryId: product.category.id
          })
        });
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }

  saveProduct() {
    if (this.form.valid) {
      const productData = this.form.value;

      if (this.isEditMode) {
        this.productService.updateProduct(this.productId!, productData)
          .subscribe({
            next: () => {
              this.dialogRef.close(true);
            }, error: (err) => {
              this.dialogRef.close(false);
              this.snackBar.open(`Status: ${err.status} Message: ${err.error.message}`, 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar'],
                verticalPosition: 'top',
                horizontalPosition: 'center'
              });
            }
          });
      } else {
        this.productService.createProduct(productData)
          .subscribe({
            next: () => {
              this.dialogRef.close(true);
            }, error: (err) => {
              this.dialogRef.close(false);
              this.snackBar.open(`Status: ${err.status} Message: ${err.error.message}`, 'Close', {
                duration: 5000,
                panelClass: ['error-snackbar'],
                verticalPosition: 'top',
                horizontalPosition: 'center'
              });
            }
          });
      }
    }
  }

}
