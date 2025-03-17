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
import { MatSelectModule } from '@angular/material/select';
import { WishListService } from '../../../../services/wishList/wishList.service';
import { IWishList, IWishListDetail } from '../../../../models/wishList/wishList.models';
import { ICuenta } from '../../../../models/ctrlEfectivo/cuenta.models';
import { ISobre } from '../../../../models/ctrlEfectivo/sobre.models';
import { ICoutasPay, IPrestamo, IDetallePrestamo } from '../../../../models/prestamos/prestamo.models';
import { IResponse } from '../../../../models/response.models';
import { IUser } from '../../../../models/user.models';
import { CuentaService } from '../../../../services/ctrlEfectivo/cuenta.service';
import { MovimientoService } from '../../../../services/ctrlEfectivo/movimiento.service';
import { SobreService } from '../../../../services/ctrlEfectivo/sobre.service';
import { LoginService } from '../../../../services/login.service';
import { PrestamoFormComponent } from '../../../prestamos/prestamo/form/prestamo-form/prestamo-form.component';


@Component({
  selector: 'app-wish-list-form',
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
    MatIconModule,
    MatSelectModule],
  templateUrl: './wish-list-form.component.html',
  styleUrl: './wish-list-form.component.css'
})
export class WishListFormComponent {
  wishListForm!: FormGroup;
  _wishListService = inject(WishListService);
  _cuentaService = inject(CuentaService);
  _sobreService = inject(SobreService);
  _movimientoService = inject(MovimientoService);
  private _toastr = inject(ToastrService)
  private loginServices = inject(LoginService);
  public dialog = inject(MatDialog)
  title?: string;
  idWish: number | null = null;
  paid: boolean = false;
  msjError: string | null = null
  listSobre: ISobre[] = [];
  maxMontoPrestar: number = 0;

  wishListData: IWishList = {
    id: null,
    wishListDetails:  null,
    titulo: null,
    fechaCreacion: null,
    meta:  null,
    cuentaOrigen:  null,
    estado:  null,
    fechaFin:  null,
    procesarWish: null,
    usuario:  null
  };

  wishListDetailData: IWishListDetail = {
    wishDetailId: null,
    fechaDetail: null,
    itemName: null,
    precio: null,
    comentario: null,
    link:  null,
    procesarDetail:  null,
    wishList:  null
  }


  sobreDataOrigen: ISobre = {
    id: null,
    descripcion: null,
    usuario: null
  };

  sobreDataDestino: ISobre = {
    id: null,
    descripcion: null,
    usuario: null
  };

  cuentaOrigenData: ICuenta = {
    id: 0,
    saldo: 0,
    sobre: this.sobreDataOrigen
  };

  cuentaDestinoData: ICuenta = {
    id: 0,
    saldo: 0,
    sobre: this.sobreDataDestino
  };

  userLoginOn: boolean = false;
  username: string | null = '';
  role: String | null = '';


  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<PrestamoFormComponent>) {
    this.title = data.titulo + ' lista de deseos.';
    this.idWish = data.idWish;
    this.isUserLogin();
  }

  async ngOnInit(): Promise<void> {
    this.initForm();
    await this.loadGralData();
    await this.getListSobres();
    this.setSaldoActual();
  }

  initForm(): void {

    this.wishListForm = this.formBuilder.group(
      {
        titulo: [{ value: null, disabled: false }, Validators.required],
        fechaCreacion: [{ value: null, disabled: false }, Validators.required],
        meta: [{ value: null, disabled: false }],
        cOrigen: [{ value: null, disabled: false }, Validators.required],   
        saldoDisponibleOrigen: [{ value: null, disabled: true }]        
      }
    )
  }

  async loadGralData(): Promise<void> {
    if (this.idWish != null) {
      // this.enableElementByCuentaOrigen();
      this.wishListData = await this.getWishList(this.idWish!);
      if (this.wishListData) {
        let newDate = this.getShortDate(this.wishListData.fechaCreacion!)

        this.wishListForm.patchValue({
          titulo: this.wishListData.titulo,
          fechaCreacion: new Date(newDate),
          meta: this.wishListData.meta,
          cOrigen: this.wishListData.cuentaOrigen?.sobre?.id         
        })
        await this.getSaldoCuenta(this.wishListData.cuentaOrigen?.sobre?.id!)

      }
    }
  }

  async getListSobres(): Promise<void> {
    this._sobreService.getSobres(this.username!).subscribe((sobre: ISobre[]) => {
      this.listSobre = sobre;
    });
  }

  setSaldoActual(): void {
    this.wishListForm.get('cOrigen')?.valueChanges.subscribe(async (idSobre) => {
      if (idSobre != null) {
        let cuenta = await this.getCuentaByIdSobre(idSobre);
        if (cuenta) {
          this.wishListForm.patchValue({
            saldoDisponibleOrigen: cuenta.saldo
          })
        }
        // this.prestamoForm.get("montoAPrestar")?.enable();
        // this.prestamoForm.get("coutas")?.enable();
      }

    })
  }

  async getSaldoCuenta(idSobre: number): Promise<void> {
    let cuenta = await this.getCuentaByIdSobre(idSobre);

    if (cuenta) {
      this.maxMontoPrestar = cuenta.saldo!;
      this.wishListForm.patchValue({
        saldoDisponibleOrigen: cuenta.saldo
      })
    }
  }

  async getCuentaByIdSobre(idSobre: number): Promise<ICuenta> {
    try {
      const cuenta: ICuenta =
        await firstValueFrom(this._cuentaService.getCuentaByIdSobre(idSobre));
      return cuenta;
    } catch (error) {
      console.error('Error al buscar cuenta:', error);
      throw error;
    }
  }

  enableElementByCuentaOrigen():void{
    this.wishListForm.get('cOrigen')?.valueChanges.subscribe(async (cOrigen) => {
      this.wishListForm.get("montoAPrestar")?.enable();
      this.wishListForm.get("coutas")?.enable();
    })
  }

  // setInteresYMonto(): void {
  //   this.prestamoForm.get('coutas')?.valueChanges.subscribe(async (idCuota) => {
  //     if (idCuota != null) {

  //       let interes: number = this.getInteresCoutasPay(idCuota);
  //       if (interes != null) {
  //         if (interes > 0) {
  //           this.prestamoForm.patchValue({
  //             interes: interes + '%'
  //           })
  //           let monto: number = this.prestamoForm.get("montoAPrestar")?.value
  //           if (monto != 0 && monto != null) {
  //             let porcentajeDecimal: number = interes / 100;
  //             let newMontoTotal: number = monto * (1 + porcentajeDecimal);
  //             let pagoMes: number = newMontoTotal / idCuota;
  //             this.prestamoForm.patchValue({
  //               totAPagar: Number(newMontoTotal.toFixed(0)),
  //               pagoPorMes: pagoMes
  //             })
  //           }
  //         } else if (interes == 0) {
  //           let monto: number = this.prestamoForm.get("montoAPrestar")?.value;
  //           if (monto != 0 && monto != null) {
  //             this.prestamoForm.patchValue({
  //               interes: null,                
  //               totAPagar: Number(monto.toFixed(0)),
  //               pagoPorMes: monto
  //             })
  //           }
  //         }

  //       }
  //     }
  //   })

  //   this.prestamoForm.get('montoAPrestar')?.valueChanges.subscribe(async (nMonto) => {

  //     let idCuota: number = this.prestamoForm.get("coutas")?.value;
  //     let interes: number = this.getInteresCoutasPay(idCuota);
  //     if (interes != null) {

  //       if (interes > 0) {
  //         let porcentajeDecimal: number = interes / 100;
  //         let newMontoTotal: number = nMonto * (1 + porcentajeDecimal);
  //         let pagoMes: number = newMontoTotal / idCuota;
  //         this.prestamoForm.patchValue({
  //           totAPagar: Number(newMontoTotal.toFixed(0)),
  //           pagoPorMes: pagoMes
  //         })
  //       } else if (interes == 0) {
  //         if (nMonto != 0 && nMonto != null) {
  //           this.prestamoForm.patchValue({
  //             totAPagar: Number(nMonto.toFixed(0)),
  //             pagoPorMes: nMonto
  //           })
  //         }
  //       }
  //     }
  //   })
  // }


  resetMessageError(): void {
    this.wishListForm.get('pago')?.valueChanges.subscribe((newMonto) => {
      this.msjError = null;
    })
  }

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
    let msj = 'La lista de deseo se ha generado con éxito.';
    let idWishList = this.idWish;
    if (idWishList != null) {
      this.wishListData = await this.getWishList(idWishList!);
      msj = 'La lista de deseo se ha actualizado correctamente.';
    }

    const user: IUser = {
      id: null,
      username: this.username!
    }
    this.wishListData.usuario = user;

    let titulo = this.wishListForm.get("titulo")?.value;
    let fechaCreacion = this.wishListForm.get("fechaCreacion")?.value;
    let cOrigen = this.wishListForm.get("cOrigen")?.value;
    let meta = this.wishListForm.get("meta")?.value;


    let cuentaOrigenData :ICuenta = await this.getCuentaByIdSobre(cOrigen);
 
    this.cuentaOrigenData.id =cuentaOrigenData.id;

    this.wishListData.titulo = titulo;
    this.wishListData.fechaCreacion = fechaCreacion;
    this.wishListData.cuentaOrigen = this.cuentaOrigenData;
    this.wishListData.meta = meta;
    this.wishListData.estado = false;
    this.wishListData.fechaFin = null;
    this.wishListData.procesarWish = false;

    let detalle : IWishListDetail[] = [];
    this.wishListData.wishListDetails = detalle;

    let response!: IResponse;
    if (idWishList != null) {
      response = await this.update(this.idWish!, this.wishListData)
    } else {
      response = await this.save(this.wishListData)
    }

    if (response) {
      this.showSuccess(msj, "Lista de deseo")
      this.dialogRef.close();
    }

  }


  async update(idWishList: number, wishList?: IWishList): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._wishListService.updateWishList(idWishList, wishList!));
      return response;
    } catch (error) {
      console.error('Error al actualizar lista de deseo:', error);
      throw error;
    }
  }

  async save(wishList?: IWishList): Promise<IResponse> {
    try {
      const response: any =
        await firstValueFrom(this._wishListService.saveWishList(wishList!));
      return response;
    } catch (error) {
      console.error('Error al guardar el wishList:', error);
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
    this.wishListForm.reset();
    this.dialogRef.close();
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }
}
