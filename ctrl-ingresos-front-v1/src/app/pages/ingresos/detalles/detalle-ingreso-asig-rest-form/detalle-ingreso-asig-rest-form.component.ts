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
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { IConcepto, IConceptoId } from '../../../../models/ingresos/concepto.models';
import { ConceptoService } from '../../../../services/ingresos/concepto.service';
import { IIngreso } from '../../../../models/ingresos/ingreso.models';
import { IngresoService } from '../../../../services/ingresos/ingreso.service';
import { LoginService } from '../../../../services/login.service';
import { ILoginResponse } from '../../../../models/login.models';
import { IUser } from '../../../../models/user.models';

@Component({
  selector: 'app-detalle-ingreso-asig-rest-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatRadioModule,
    MatSelectModule],
  templateUrl: './detalle-ingreso-asig-rest-form.component.html',
  styleUrl: './detalle-ingreso-asig-rest-form.component.css'
})
export class DetalleIngresoAsigRestFormComponent implements OnInit {
  asigRestForm!: FormGroup;
  loginServices = inject(LoginService);
  _detalleIngresoService = inject(DetalleIngresoService);
  _conceptoService = inject(ConceptoService);
  private _toastr = inject(ToastrService)
  title: string = 'Asignar monto restante';
  detalleData?: IDetalleIngreso;
  idDetalleData?: IDetalleIngresoId;
  msjErrorOnsave: string | null = null;
  listConcepto: IConcepto[] = [];
  username: string = 'pablofx01';
  ingresoData?: IIngreso;
  private _ingresoService = inject(IngresoService);
  origen : string = 'asigRestForm';

  role: String | null = '';
  userLoginOn: boolean = false;

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }


  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DetalleIngresoAsigRestFormComponent>) {
    this.isUserLogin();
    this.initForm();
    this.idDetalleData = this.getIdDetalle(data.idIngreso, data.idDetalle);
  }

  async ngOnInit(): Promise<void> {
    if (this.idDetalleData?.id != null) {
      this.ingresoData = await this.getIngreso(this.idDetalleData.idIngreso!);
      this.loadItemData(this.idDetalleData);
      this.loadListConceptos(this.username)

    }
    this.resetMessageError();
  }

  initForm(): void {
    this.asigRestForm = this.formBuilder.group(
      {
        conceptoOrigen: [{ value: null, disabled: true }],
        montoRes: [{ value: null, disabled: true }],
        conceptoDestino: [{ value: null, disabled: false }, [Validators.required]],
        monto: [{ value: null, disabled: false }, [Validators.required]],
        optDestino: [{ value: null, disabled: false }, [Validators.required]]
      }
    )
  }

  resetMessageError(): void {
    this.asigRestForm.get('monto')?.valueChanges.subscribe((nValor) => {
      this.msjErrorOnsave = null;
    })

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

  getIdDetalle(idIngreso: number | null, idDetalle: number | null): IDetalleIngresoId {
    let idDetalleIngreso: IDetalleIngresoId = {
      id: idDetalle!,
      idIngreso: idIngreso!
    }
    return idDetalleIngreso;
  }



  async loadItemData(itemId: IDetalleIngresoId) {
    const detalleIngreso: IDetalleIngreso = await this.getDIngreso(itemId);
    this.detalleData = detalleIngreso;
    if (detalleIngreso) {
      let tipoDeposito: string = this.ingresoData?.tmoneda!;
      this.asigRestForm.patchValue({
        conceptoOrigen: detalleIngreso.concepto!.nombre,
        montoRes: detalleIngreso.pctXCpto!.montoAsigRest,
        optDestino: tipoDeposito
      })
    }

  }

  loadListConceptos(username: string) {
    this._conceptoService.getAllConceptosAct(username).subscribe((conceptos: IConcepto[]) => {
      this.listConcepto = conceptos;
    })
  }

  async getAllConceptoss(username: string): Promise<IConcepto[]> {
    try {
      const conceptos: IConcepto[] =
        await firstValueFrom(this._conceptoService.getAllConceptos(username));
      return conceptos;
    } catch (error) {
      console.error('Error al obtener los conceptos:', error);
      throw error;
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

  async getDIngresoByCpto(cpto: string, itemId: IDetalleIngresoId): Promise<IDetalleIngreso> {
    try {
      const detalleIngreso: IDetalleIngreso =
        await firstValueFrom(this._detalleIngresoService.getDetalleIngresoByCpto(cpto,
          itemId.idIngreso!));
      return detalleIngreso;
    } catch (error) {
      console.error('Error al obtener detalleIngresoByCpto:', error);
      throw error;
    }
  }

  cancel(): void {
    this.asigRestForm.reset();
    this.dialogRef.close();
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  async onSave() {

    if (this.detalleData?.detalleIngresoId!.id != null) {
      const user: IUser = {
        id: null,
        username: this.username!
      }
      
      let response!: IResponse;
      let nMonto = this.asigRestForm.get('monto')?.value;
      let MontoRest = this.asigRestForm.get('montoRes')?.value;
      let cptoDestino = this.asigRestForm.get('conceptoDestino')?.value;
      let nOpcDestino = this.asigRestForm.get('optDestino')?.value;
      let montoRestFinal = MontoRest - nMonto;
      let dIngresoCpto: IDetalleIngreso = await this.getDIngresoByCpto(cptoDestino, this.detalleData?.detalleIngresoId);
      if (dIngresoCpto.detalleIngresoId!.id != null) {
        this.detalleData.pctXCpto!.montoAsigRest = montoRestFinal;
        if (nOpcDestino == 'EFECTIVO') {
          let montoDestinoActual = dIngresoCpto.pctXCpto!.montoAsigRealEfec;
          let nMontoDestino = montoDestinoActual + nMonto
          dIngresoCpto.pctXCpto!.montoAsigRealEfec = nMontoDestino;
        } else {
          let montoDestinoActual = dIngresoCpto.pctXCpto!.montoAsigRealDig;
          let nMontoDestino = montoDestinoActual + nMonto
          dIngresoCpto.pctXCpto!.montoAsigRealDig = nMontoDestino;
        }
        this.detalleData.usuario = user;
        let conceptoId: IConceptoId = {
          idConcepto: this.detalleData.concepto?.conceptoId?.idConcepto!,
          idUsuario: this.detalleData.concepto?.conceptoId?.idUsuario!
        }
        let concepto: IConcepto = {
          conceptoId: conceptoId,
          activo: null,
          nombre: null,
          porcentaje: null,
          usuario: null

        }
        this.detalleData.concepto = concepto;

        let conceptoIdDestino: IConceptoId = {
          idConcepto: dIngresoCpto.concepto?.conceptoId?.idConcepto!,
          idUsuario: dIngresoCpto.concepto?.conceptoId?.idUsuario!
        }
        let conceptoDestino: IConcepto = {
          conceptoId: conceptoId,
          activo: null,
          nombre: null,
          porcentaje: null,
          usuario: null

        }
        this.detalleData.concepto = concepto;
        dIngresoCpto.concepto = conceptoDestino;
        dIngresoCpto.usuario = user;
        // Se actualiza el origen
        response = await this.updateMontoRest(this.detalleData.detalleIngresoId, this.detalleData)
        if (response) {
          //Se actualiza el destino
          response = await this.updateTranferir(dIngresoCpto.detalleIngresoId!, dIngresoCpto)
          if (response) {
            this.showSuccess('Se ha actualizado correctamente.', this.detalleData.concepto!.nombre!);
            this.dialogRef.close();
          }
        }
      }


    }
  }


  async updateMontoRest(id: IDetalleIngresoId, dIngreso?: IDetalleIngreso): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._detalleIngresoService.updateDIngresoMontoRest(id.id!, id.idIngreso!, dIngreso!));
      return response;
    } catch (error) {
      console.error('Error al actualizar detalleIngreso:', error);
      throw error;
    }
  }

  async updateTranferir(id: IDetalleIngresoId, dIngreso?: IDetalleIngreso): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._detalleIngresoService.updateDIngresoTransferir(id.id!, id.idIngreso!, dIngreso!));
      return response;
    } catch (error) {
      console.error('Error al actualizar detalleIngreso:', error);
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
