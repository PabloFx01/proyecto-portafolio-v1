import { Component, Inject } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-onUser-form',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './onUser-form.component.html',
  styleUrl: './onUser-form.component.css'
})
export class OnUserFormComponent {

  link?: string;
  title?: string;

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OnUserFormComponent>) {

    this.link = data.link;
    this.title = data.title;
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
