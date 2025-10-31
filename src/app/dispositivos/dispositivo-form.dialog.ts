import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { Dispositivo, DispositivoStatus } from '../models/dispositivo';

export interface DispositivoFormData {
  dispositivo?: Dispositivo;
}

@Component({
  selector: 'app-dispositivo-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './dispositivo-form.dialog.html',
  styleUrl: './dispositivo-form.dialog.css'
})
export class DispositivoFormDialogComponent {
  form: FormGroup;
  readonly statusOptions: DispositivoStatus[] = ['info', 'warn', 'error'];

  constructor(
    private readonly dialogRef: MatDialogRef<DispositivoFormDialogComponent>,
    private readonly fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DispositivoFormData | null
  ) {
    const d = this.data?.dispositivo;
    this.form = this.fb.group({
      id: [d?.id ?? null],
      name: [d?.name ?? '', [Validators.required, Validators.maxLength(80)]],
      category_id: [d?.category_id ?? 1, [Validators.required]],
      category: [d?.category ?? '', [Validators.required]],
      status: [d?.status ?? 'info', [Validators.required]],
      value: [d?.value ?? 1],
      on: [d?.on ?? false]
    });

    // Define categoria: se vier em data?.dispositivo usa-a; senão mapeia do category_id selecionado
    const hasCategory = !!(d?.category && d.category.trim().length);
    const initialCategoryId = this.form.get('category_id')!.value as number;
    const initialCategory = hasCategory ? d!.category : this.mapCategoryFromId(initialCategoryId);
    this.form.get('category')!.setValue(initialCategory, { emitEvent: false });

    // Mantém category sincronizado com a seleção de category_id
    this.form.get('category_id')!.valueChanges.subscribe((cid: number) => {
      const name = this.mapCategoryFromId(cid);
      this.form.get('category')!.setValue(name, { emitEvent: false });
    });
  }

  save(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }

  cancel(): void {
    this.dialogRef.close();
  }

  private mapCategoryFromId(categoryId: number): string {
    switch (categoryId) {
      case 1:
        return 'Atuador';
      case 2:
        return 'sensor_agua';
      case 3:
        return 'sensor_umidade';
      case 4:
        return 'sensor_temperatura';
      case 5:
        return 'sensor_nivel_de_agua';
      default:
        return 'Atuador';
    }
  }
}


