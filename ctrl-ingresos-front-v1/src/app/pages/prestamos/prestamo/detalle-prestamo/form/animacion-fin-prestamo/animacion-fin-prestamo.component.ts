import { Component, inject } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'app-animacion-fin-prestamo',
  standalone: true,
  imports: [LottieComponent],
  templateUrl: './animacion-fin-prestamo.component.html',
  styleUrl: './animacion-fin-prestamo.component.css'
})
export class AnimacionFinPrestamoComponent {
  private _router = inject(Router)

  constructor(public dialogRef: MatDialogRef<AnimacionFinPrestamoComponent>){

  }
  options: AnimationOptions = {
    path: '../../../../../../../assets/anim/animacion_congratulation.json',
  };

  animationCreated(animationItem: AnimationItem): void {
    console.log(animationItem);
  }

  styles: Partial<CSSStyleDeclaration> = {
    maxWidth: '500px',
    margin: '0 auto',
  };

  cancel() {
    this.dialogRef.close();
    this._router.navigate(["/prestamos"])
  }
}
