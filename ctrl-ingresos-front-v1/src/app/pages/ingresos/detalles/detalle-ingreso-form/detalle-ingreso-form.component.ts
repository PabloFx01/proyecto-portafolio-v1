import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { DataService } from '../../../../shared/data.service';
import { IResponse } from '../../../../models/response.models';
import { DetalleIngresoService } from '../../../../services/ingresos/DetalleIngreso.service';
import { IDetalleIngreso, IDetalleIngresoId } from '../../../../models/ingresos/detalleIngreso.models';
import { LoginService } from '../../../../services/login.service';
import { ILoginResponse } from '../../../../models/login.models';
import { IUser } from '../../../../models/user.models';
import { IIngreso } from '../../../../models/ingresos/ingreso.models';
import { IngresoService } from '../../../../services/ingresos/ingreso.service';
import { IPctXConceptoId, IPorcentajeXConcepto } from '../../../../models/ingresos/porcentajeXConcepto.models';
import { IConcepto, IConceptoId } from '../../../../models/ingresos/concepto.models';
import { SpinnerComponent } from "../../../../shared/spinner/spinner.component";

@Component({
  selector: 'app-detalle-ingreso-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule, SpinnerComponent],
  templateUrl: './detalle-ingreso-form.component.html',
  styleUrl: './detalle-ingreso-form.component.css'
})
export class DetalleIngresoFormComponent implements OnInit {

  detalleIngresoForm!: FormGroup;
  _detalleIngresoService = inject(DetalleIngresoService);
  private _ingresoService = inject(IngresoService);
  private _toastr = inject(ToastrService)
  title?: string;
  msjErrorOnsave: string | null = null;
  nConcepto: string = '';

  detalleData: IDetalleIngreso = {
    detalleIngresoId: null,
    concepto: null,
    montoPorcentaje: null,
    montoPorcentajeRest: null,
    pctXCpto: null,
    idPctXCpto: null,
    usuario: null,
    ingreso: null
  };
  idDetalleData: IDetalleIngresoId = {
    id: null,
    idIngreso: null
  };

  pctIdData: IPctXConceptoId = {
    id: null,
    detalleIngresoId: null,
    idIngreso: null
  }

  pctData: IPorcentajeXConcepto = {
    pctXConceptoId: null,
    montoAsigRest: null,
    montoAsigRealEfec: null,
    montoAsigRealDig: null
  }


  ingresoData: IIngreso = {
    id: null,
    detallesIngreso: null,
    comentario: '',
    fechaDeposito: new Date(),
    montoIngreso: 0,
    tmoneda: '',
    asociarConceptos: false,
    usuario: null
  };

  conceptoData: IConcepto = {
    conceptoId: null,
    nombre: null,
    porcentaje: null,
    activo: null,
    usuario: null
  };

  conceptoIdData: IConceptoId = {
    idConcepto: null,
    idUsuario: null
  }

  loginServices = inject(LoginService);

  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }
  isLoading: boolean = false;
  
  spinnerShow(): void {
    this.isLoading = true
  }
  
    spinnerHide(): void {
    this.isLoading = false
  }
  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DetalleIngresoFormComponent>) {
    this.isUserLogin();
    this.initForm();
    this.title = data.tipoAccion;
    this.idDetalleData = this.getIdDetalle(data.idIngreso, data.idDetalle);

  }

  async ngOnInit(): Promise<void> {
    if (this.idDetalleData.id != null) {
      await this.loadItemData(this.idDetalleData);
    }
    this.resetMessageError();
  }

  initForm(): void {
    this.detalleIngresoForm = this.formBuilder.group(
      {
        montoEfec: [{ value: null, disabled: true }, ],
        montoDig: [{ value: null, disabled: true }, ],
        montoAsig: [{ value: null, disabled: true }],
        montoRes: [{ value: null, disabled: true }],
        montoAReasignarEfec: [{ value: null, disabled: false }, [Validators.required]],
        montoAReasignarDig: [{ value: null, disabled: false }, [Validators.required]]

      }
    )

  }

  resetMessageError(): void {
    this.detalleIngresoForm.get('montoEfec')?.valueChanges.subscribe((nValor) => {
      this.msjErrorOnsave = null;
    })
    this.detalleIngresoForm.get('montoDig')?.valueChanges.subscribe((nValor) => {
      this.msjErrorOnsave = null;
    })
  }

  getIdDetalle(idIngreso: number | null, idDetalle: number | null): IDetalleIngresoId {
    let idDetalleIngreso: IDetalleIngresoId = {
      id: idDetalle!,
      idIngreso: idIngreso!
    }
    return idDetalleIngreso;
  }

  async loadItemData(itemId: IDetalleIngresoId) {
    const detalleIngreso: IDetalleIngreso = await this.getDIngreso(itemId);
    // this.detalleData = detalleIngreso;
    if (detalleIngreso) {
      this.nConcepto = detalleIngreso.concepto?.nombre!;
      this.detalleIngresoForm.patchValue({
        montoEfec: detalleIngreso.pctXCpto!.montoAsigRealEfec,
        montoDig: detalleIngreso.pctXCpto!.montoAsigRealDig,
        montoAsig: detalleIngreso.montoPorcentajeRest,
        montoRes: detalleIngreso.pctXCpto!.montoAsigRest,
        montoAReasignarEfec: 0,
        montoAReasignarDig: 0,

      })
    }

  }

  async getDIngreso(itemId: IDetalleIngresoId): Promise<IDetalleIngreso> {
    try {
      const detalleIngreso: IDetalleIngreso =
        await firstValueFrom(this._detalleIngresoService.getDetalleIngreso(itemId.id!,
          itemId.idIngreso!));
      return detalleIngreso;
    } catch (error) {
      console.error('Error al obtener detalleIngreso:', error);
      throw error;
    }
  }

  cancel(): void {
    this.detalleIngresoForm.reset();
    this.dialogRef.close();
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  async onSave() {
    if (this.idDetalleData.id != null) {
      this.spinnerShow();
      const user: IUser = {
        id: null,
        username: this.username!
      }
      const detalleIngreso: IDetalleIngreso = await this.getDIngreso(this.idDetalleData);
      if (detalleIngreso) {
        let response!: IResponse;
        let nMontoEfec = this.detalleIngresoForm.get('montoEfec')?.value;
        let nMontoDig = this.detalleIngresoForm.get('montoDig')?.value;
        let nMontoRest = this.detalleIngresoForm.get('montoRes')?.value;
        let montoAsig = this.detalleIngresoForm.get('montoAsig')?.value;
        let montoAReasignarEfec = this.detalleIngresoForm.get('montoAReasignarEfec')?.value;
        let montoAReasignarDig = this.detalleIngresoForm.get('montoAReasignarDig')?.value;
        //Validaciones
        let montoTotEnConcepto: number = nMontoEfec + nMontoDig + nMontoRest;
        let montoTotAReasignar: number = montoAReasignarEfec + montoAReasignarDig; 
        // let montoTotal = detalleIngreso.montoPorcentaje!;
        let montoTotal = detalleIngreso.montoPorcentajeRest!;
        let nRestante = (montoTotal - (nMontoDig + nMontoEfec))
        let sumMonto = (nMontoDig + nMontoEfec);

        if (montoTotAReasignar > montoTotEnConcepto) {
          this.msjErrorOnsave = 'El valor a reasignar no puede ser mayor al monto del concepto';
        }  


        if(this.msjErrorOnsave==null) {

          this.detalleData.detalleIngresoId = this.idDetalleData;
          let conceptoId: IConceptoId = {
            idConcepto: detalleIngreso.concepto?.conceptoId?.idConcepto!,
            idUsuario: detalleIngreso.concepto?.conceptoId?.idUsuario!
          }
          let concepto: IConcepto = {
            conceptoId: conceptoId,
            activo: null,
            nombre: null,
            porcentaje: null,
            usuario: null

          }
          this.detalleData.concepto = concepto;
          this.detalleData.montoPorcentajeRest = (montoTotal - nRestante)

          let pctId: IPctXConceptoId = {
            detalleIngresoId: detalleIngreso!.pctXCpto!.pctXConceptoId?.detalleIngresoId!,
            id: detalleIngreso!.pctXCpto!.pctXConceptoId?.id!,
            idIngreso: detalleIngreso!.pctXCpto!.pctXConceptoId?.idIngreso!
          }
          let pct: IPorcentajeXConcepto = {
            montoAsigRealDig: montoAReasignarDig,
            montoAsigRealEfec: montoAReasignarEfec,
            montoAsigRest: 0,
            pctXConceptoId: pctId
          }
          this.detalleData.pctXCpto = pct;
          this.detalleData.idPctXCpto = detalleIngreso!.pctXCpto!.pctXConceptoId?.id!;
          this.detalleData.usuario = user;


          response = await this.update(this.detalleData.detalleIngresoId!, this.detalleData)
          if (response) {
            this.showSuccess('Se ha actualizado correctamente.', this.detalleData!.concepto!.nombre!);
            this.spinnerHide();
            this.dialogRef.close();
          }
        }
      }
    }
  }


  async update(id: IDetalleIngresoId, dIngreso?: IDetalleIngreso): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._detalleIngresoService.updateDIngresoMontos(id.id!, id.idIngreso!, dIngreso!));
      return response;
    } catch (error) {
      console.error('Error al actualizar detalleIngreso:', error);
      throw error;
    }
  }

  async getIngreso(itemId: number): Promise<IIngreso> {
    try {
      const ingreso: IIngreso =
        await firstValueFrom(this._ingresoService.getIngreso(itemId));
      return ingreso;
    } catch (error) {
      console.error('Error al obtener el ingreso:', error);
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

}
