import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CategoryService } from '../../../../services/category.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category-form',
  standalone: true,
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.css',
  imports: [
    CommonModule,
    MatCardModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class CategoryFormComponent implements OnInit {

  form: FormGroup;
  categoryId: number | null = null;
  isEditMode = false;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private snackBar: MatSnackBar,
    private dialogRef: MatDialogRef<CategoryFormComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    if (this.data?.id) {
      this.categoryId = this.data.id;
      this.isEditMode = true;
      this.loadCategory();
    }
  }

  loadCategory(): void {
    if (this.categoryId) {
      this.categoryService.getCategoryById(this.categoryId).subscribe((category) => {
        this.form.patchValue(category);
      });
    }
  }

  saveCategory(): void {
    if (this.form.valid) {
      const categoryData = this.form.value;

      if (this.isEditMode) {
        this.categoryService.updateCategory(this.categoryId!, categoryData)
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
        this.categoryService.createCategory(categoryData)
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

  closeDialog() {
    this.dialogRef.close();
  }

}
