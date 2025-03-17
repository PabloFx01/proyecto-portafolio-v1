import { Component, inject, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA,  MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { IngresoFormComponent } from '../ingreso-form/ingreso-form.component';

@Component({
  selector: 'app-onConceptos-form',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './onConceptos-form.component.html',
  styleUrl: './onConceptos-form.component.css'
})
export class onConceptosFormComponent {
  private _router = inject(Router)
  username?: string;
  dialogIngreso:any;
  
  

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<onConceptosFormComponent>) {

    this.username = data.username;
    this.dialogIngreso = data.dialogIngreso;
  }


  irAlink(link: string) {
    this._router.navigateByUrl(`/${link}`);
    this.dialogIngreso.close();
    this.cancel();
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
