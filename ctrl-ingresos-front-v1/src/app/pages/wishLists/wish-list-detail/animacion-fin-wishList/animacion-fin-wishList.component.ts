import { Component, Inject, inject } from '@angular/core';
import { AnimationItem } from 'lottie-web';
import { LottieComponent, AnimationOptions } from 'ngx-lottie';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IWishList } from '../../../../models/wishList/wishList.models';

@Component({
  selector: 'app-animacion-fin-wishList',
  standalone: true,
  imports: [LottieComponent],
  templateUrl: './animacion-fin-wishList.component.html',
  styleUrl: './animacion-fin-wishList.component.css'
})
export class AnimacionFinwishListComponent {
  private _router = inject(Router)
  wishListData: IWishList = {
    id: null,
    wishListDetails: null,
    titulo: null,
    fechaCreacion: null,
    meta: null,
    cuentaOrigen: null,
    estado: null,
    fechaFin: null,
    procesarWish: null,
    usuario: null
  };
  idWishList: number;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AnimacionFinwishListComponent>) {
    this.idWishList = data.idWishList;
    this.wishListData = data.wishListData;
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
    this._router.navigate(["/wishList"])
  }
}
