import { Component, OnInit } from '@angular/core';
import { Category, CategoryService } from '../../services/category.service';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { CategoryFormComponent } from './form/category-form/category-form.component';
import { DialogConfirmComponent } from '../../shared/dialog/dialog-confirm.component';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-categories',
  standalone: true,
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css',
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatTooltipModule,
  ],
})
export class CategoriesComponent implements OnInit {

  categories: Category[] = [];
  displayedColumns: string[] = ['id', 'name', 'actions'];

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.categoryService.getAllCategories().subscribe({
      next: (data) => (this.categories = data),
      error: (err) => console.error('Error loading categories:', err)
    });
  }

  addCategory(): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, { width: '400px' });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  editCategory(id: number): void {
    const dialogRef = this.dialog.open(CategoryFormComponent, { width: '400px', data: { id } });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCategories();
      }
    });
  }

  confirmDelete(category: any) {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '400px',
      data: {
        title: 'Delete Category',
        message: `Deleting this category will remove all related products. Are you sure?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteCategory(category.id);
      }
    });
  }

  deleteCategory(categoryId: number) {
    this.categoryService.deleteCategory(categoryId)

      .subscribe({
        next: () => {
          this.loadCategories();
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

}
