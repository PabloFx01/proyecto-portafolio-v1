import { Component, inject, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA,  MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';


@Component({
  selector: 'app-factura-pagada-form',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './factura-pagada-form.component.html',
  styleUrl: './factura-pagada-form.component.css'
})
export class facturaPagadaFormComponent {
  private _router = inject(Router)
  username?: string;
  dialogIngreso:any;
  
  

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<facturaPagadaFormComponent>) {

    this.username = data.username;
    this.dialogIngreso = data.dialogIngreso;
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
