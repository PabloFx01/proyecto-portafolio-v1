import { Component, inject, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-onResponsive-form',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  templateUrl: './onResponsive-form.component.html',
  styleUrl: './onResponsive-form.component.css'
})
export class OnResponsiveComponent {

  link?: string;
  title?: string;
  private _router = inject(Router);
  private _DataService = inject(DataService);


  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<OnResponsiveComponent>) {

    this.link = data.link;
    this.title = data.title;
  }

  cancel(): void {
    this.irAlink("home")
    this.dialogRef.close();
  }
  continuar(): void {
    this._DataService.setSelectedUserContinue(true);
    this.dialogRef.close();

  }

  irAlink(link: string) {
    this._router.navigateByUrl(`/${link}`);
  }


}
