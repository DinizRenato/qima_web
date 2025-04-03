import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { Router } from '@angular/router';
import { Product, ProductService } from '../../services/product.service';
import { ProductFormComponent } from './form/product-form/product-form.component';
import { DialogConfirmComponent } from '../../shared/dialog/dialog-confirm.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-products',
  standalone: true,
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];
  displayedColumns: string[] = ['id', 'name', 'description', 'price', 'available', 'category', 'actions'];

  constructor(
    private productService: ProductService,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  addProduct(): void {
    const dialogRef = this.dialog.open(ProductFormComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  editProduct(id: number): void {
    const dialogRef = this.dialog.open(ProductFormComponent, { width: '400px', data: { id } });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadProducts();
      }
    });
  }

  confirmDelete(product: any) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '400px',
      data: {
        title: 'Delete Product',
        message: `Are you sure?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteProduct(product.id);
      }
    });
  }

  deleteProduct(productId: number) {
    this.productService.deleteProduct(productId)
      .subscribe({
        next: () => {
          this.loadProducts();
        }, error: (err) => {
          this.snackBar.open(`Status: ${err.status} Message: ${err.error.message}`, 'Close', {
            duration: 5000,
            panelClass: ['error-snackbar'],
            verticalPosition: 'top',
            horizontalPosition: 'center'
          });
        }
      });
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Error loading categories:', err)
    })
  }

}
