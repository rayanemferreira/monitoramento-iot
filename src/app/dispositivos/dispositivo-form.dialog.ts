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
      category: [d?.category ?? 'Leitura', [Validators.required]],
      status: [d?.status ?? 'info', [Validators.required]],
      value: [d?.value ?? 0, [Validators.required, Validators.min(0)]],
      on: [d?.on ?? false]
    });

    this.form.get('category_id')!.valueChanges.subscribe((cid: number) => {
      const name = cid === 2 ? 'Controle' : 'Leitura';
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
}


