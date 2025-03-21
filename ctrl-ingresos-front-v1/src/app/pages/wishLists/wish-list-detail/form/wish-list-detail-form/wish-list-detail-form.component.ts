import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule, MatRadioGroup } from '@angular/material/radio';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { IPrestamo, IDetallePrestamo, IDetallePrestamoId } from '../../../../../models/prestamos/prestamo.models';
import { IResponse } from '../../../../../models/response.models';
import { IWishDetailId, IWishList, IWishListDetail } from '../../../../../models/wishList/wishList.models';
import { CuentaService } from '../../../../../services/ctrlEfectivo/cuenta.service';
import { MovimientoService } from '../../../../../services/ctrlEfectivo/movimiento.service';
import { LoginService } from '../../../../../services/login.service';
import { WishListService } from '../../../../../services/wishList/wishList.service';
import { WishListDetailService } from '../../../../../services/wishList/wishListDetails.service';
import { SpinnerComponent } from "../../../../../shared/spinner/spinner.component";

@Component({
  selector: 'app-wish-list-detail-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatRadioGroup,
    MatIconModule, SpinnerComponent],
  templateUrl: './wish-list-detail-form.component.html',
  styleUrl: './wish-list-detail-form.component.css'
})
export class WishListDetailFormComponent implements OnInit {
  detalleWishListForm!: FormGroup;
  _wishListDetailServices = inject(WishListDetailService);
  _wishListService = inject(WishListService);
  _cuentaService = inject(CuentaService);
  _movimientoService = inject(MovimientoService);
  private _toastr = inject(ToastrService)
  private loginServices = inject(LoginService);
  public dialog = inject(MatDialog)
  title?: string;
  idDetalle: number | null = null;
  idWishList: number | null = null;
  dateCalendar: Date | null = null;
  paid: boolean = false;
  msjError: string | null = null

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

  wishListDetailData: IWishListDetail = {
    wishDetailId: null,
    fechaDetail: null,
    itemName: null,
    precio: null,
    comentario: null,
    link: null,
    procesarDetail: null,
    wishList: null
  }


  userLoginOn: boolean = false;
  username: string | null = '';
  role: String | null = '';

  isLoading: boolean = false;
  
  spinnerShow(): void {
    this.isLoading = true
  }
  
    spinnerHide(): void {
    this.isLoading = false
  }
  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<WishListDetailFormComponent>) {
    this.title = data.titulo + ' deseo';
    this.idDetalle = data.idDetalle;
    this.idWishList = data.idWishList;
    this.isUserLogin();


  }

  async ngOnInit(): Promise<void> {
    this.initForm();
    if (this.idDetalle != null) {
      await this.loadItemData(this.idDetalle, this.idWishList!);
    }
    // this.resetMessageError();
  }


  initForm(): void {

    this.detalleWishListForm = this.formBuilder.group(
      {
        fechaCreacion: [{ value: null, disabled: false }, Validators.required],
        itemName: [{ value: null, disabled: false }, Validators.required],
        precio: [{ value: null, disabled: false }, Validators.required],
        comentario: [{ value: null, disabled: false }],
        link: [{ value: null, disabled: false }],

      }
    )
  }

  async loadItemData(idDetalle: number, idWishList: number) {

    const dWish: IWishListDetail = await this.getDetWishList(idDetalle, idWishList);
    if (dWish) {
      let newDate = this.getShortDate(dWish.fechaDetail!)
      this.detalleWishListForm.patchValue({
        fechaCreacion: new Date(newDate),
        itemName: dWish.itemName,
        precio: dWish.precio,
        comentario: dWish.comentario,
        link: dWish.link
      })
    }

  }

  async getDetWishList(idDetalleWishList: number, idWishList: number): Promise<IWishListDetail> {
    try {
      const detalle: IWishListDetail =
        await firstValueFrom(this._wishListDetailServices.getDetalleWish(idDetalleWishList, idWishList));
      return detalle;
    } catch (error) {
      console.error('Error al obtener el detalle del deseo:', error);
      throw error;
    }
  }

  // async loadGralData(): Promise<void> {
  //   this.wishListData = await this.getWishList(this.idWishList!);

  //   if (this.wishListData) {
  //     this.maxPago = this.prestamoData.saldoRest!;
  //     this.loadCuentaBeneficiaria();
  //     this.loadPagoSugerido(this.prestamoData);
  //     if (this.idDetallePrestamo != null) {
  //       await this.loadItemData(this.idDetallePrestamo, this.idPrestamo!);
  //       if (this.idDetallePrestamo != null) {
  //         let restActual = this.maxPago;
  //         this.maxPago = restActual + this.pagoActual;
  //       }
  //     }
  //   }
  // }


  // loadPagoSugerido(prestamo: IPrestamo): void {
  //   let nPagoSugerido: number = Number((prestamo.totAPagar! / prestamo.cuotas!).toFixed(2));
  //   this.detallePrestamoForm.patchValue({
  //     pagoSugerido: nPagoSugerido
  //   })
  // }


  // loadCuentaBeneficiaria(): void {

  //   this.detallePrestamoForm.patchValue({
  //     cBenefi: this.prestamoData.cuentaBeneficiario?.sobre?.descripcion,
  //     saldoDisponible: this.prestamoData.cuentaBeneficiario?.saldo
  //   })
  // }




  // resetMessageError(): void {
  //   this.detallePrestamoForm.get('pago')?.valueChanges.subscribe((newMonto) => {
  //     this.msjError = null;
  //   })
  // }

  getShortDate(fecha: Date): string {
    let ahora = new Date(fecha);
    let fechaActual = ahora.getFullYear() + '-'
      + ('0' + (ahora.getMonth() + 1)).slice(-2) + '-'
      + ('0' + ahora.getDate()).slice(-2) + ' '
    return fechaActual;
  }



  async getWishList(idWishList: number): Promise<IWishList> {
    try {
      const wishList: IWishList =
        await firstValueFrom(this._wishListService.getWishList(idWishList));
      return wishList;
    } catch (error) {
      console.error('Error al obtener la lista:', error);
      throw error;
    }
  }




  async onSave() {
    this.spinnerShow();
    let msj = 'El item se ha generado con éxito.';
    let idDetalle = this.idDetalle;
    if (idDetalle != null) {
      this.wishListDetailData = await this.getDetWishList(idDetalle, this.idWishList!);
      msj = 'El item se ha actualizado correctamente.';
    } else {
      let detalleId: IWishDetailId = {
        id: null,
        idWish: this.idWishList!
      }
      this.wishListDetailData.wishDetailId = detalleId;
    }

    let fechaCreacion = this.detalleWishListForm.get("fechaCreacion")?.value;
    let itemName = this.detalleWishListForm.get("itemName")?.value;
    let precio = this.detalleWishListForm.get("precio")?.value;
    let comentario = this.detalleWishListForm.get("comentario")?.value;
    let link = this.detalleWishListForm.get("link")?.value;

    this.wishListDetailData.fechaDetail = fechaCreacion;
    this.wishListDetailData.itemName = itemName;
    this.wishListDetailData.precio = precio;
    this.wishListDetailData.comentario = comentario;
    this.wishListDetailData.link = link;


    let response!: IResponse;
    if (idDetalle != null) {
      response = await this.update(idDetalle, this.idWishList!, this.wishListDetailData)
    } else {
      response = await this.save(this.wishListDetailData)
    }

    if (response) {
      this.showSuccess(msj, "Item")
      this.spinnerHide();
      this.dialogRef.close();
    }
  }

  async update(idDetalle: number, idWish: number, wishListDetail?: IWishListDetail): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._wishListDetailServices.updateWishListDetail(idDetalle, idWish, wishListDetail!));
      return response;
    } catch (error) {
      console.error('Error al actualizar el detalle del deseo:', error);
      throw error;
    }
  }

  async save(wishListDetail?: IWishListDetail): Promise<IResponse> {
    try {
      const response: any =
        await firstValueFrom(this._wishListDetailServices.saveDetalleWish(wishListDetail!));
      return response;
    } catch (error) {
      console.error('Error al guardar el detalle del deseo:', error);
      throw error;
    }
  }



  isUserLogin() {
    this.loginServices.currentUserLoginOn.subscribe(
      {
        next: (userLoginOn) => {
          this.userLoginOn = userLoginOn;
        }
      }
    )

    this.loginServices.currentUsername.subscribe(
      {
        next: (username) => {
          this.username = username;
        }
      }
    )

    this.loginServices.currentUserRole.subscribe(
      {
        next: (role) => {
          this.role = role;
        }
      }
    )
  }
  cancel(): void {
    this.detalleWishListForm.reset();
    this.dialogRef.close();
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }
}
