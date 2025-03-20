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
import { IUser } from '../../../../models/user.models';
import { LoginService } from '../../../../services/login.service';
import { ILoginResponse } from '../../../../models/login.models';


@Component({
  selector: 'app-asig-total-form',
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
  templateUrl: './asig-total-form.component.html',
  styleUrl: './asig-total-form.component.css'
})
export class AsigTotalFormComponent {
  asigRestTotForm!: FormGroup;
  _detalleIngresoService = inject(DetalleIngresoService);
  _conceptoService = inject(ConceptoService);
  private _toastr = inject(ToastrService)
  title: string = 'Asignar monto restante';
  detalleData?: IDetalleIngreso;
  idDetalleData?: IDetalleIngresoId;
  idIngresoParam: number | null = null;
  msjErrorOnsave: string | null = null;
  listConcepto: IConcepto[] = [];
  listDetallesIngreso: IDetalleIngreso[] = [];
  ingresoData?: IIngreso;
  private _ingresoService = inject(IngresoService);

  loginServices = inject(LoginService);

  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<AsigTotalFormComponent>) {
    this.isUserLogin();
    this.initForm();
    this.idIngresoParam = data.idIngreso;
  }

  async ngOnInit(): Promise<void> {
    if (this.idIngresoParam != null) {
      this.ingresoData = await this.getIngreso(this.idIngresoParam);
      this.loadItemData(this.idIngresoParam);
      this.loadListConceptos(this.username!)

    }

  }

  initForm(): void {
    this.asigRestTotForm = this.formBuilder.group(
      {
        montoTotRes: [{ value: null, disabled: true }],
        conceptoDestino: [{ value: null, disabled: false }, [Validators.required]],
        optDestino: [{ value: null, disabled: false }, [Validators.required]]
      }
    )
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

  async getAllDetalle(itemId: number): Promise<IDetalleIngreso[]> {
    try {
      const dIngreso: IDetalleIngreso[] =
        await firstValueFrom(this._detalleIngresoService.getAllDetallesByIdIngreso(itemId));
      return dIngreso;
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



  async loadItemData(idIngreso: number | null) {
    this.listDetallesIngreso = await this.getAllDetalle(idIngreso!);
    let tipoDeposito: string = this.ingresoData?.tmoneda!;
    if (this.listDetallesIngreso.length > 0) {
      let totRest = this.getTotalRestante();
      this.asigRestTotForm.patchValue({
        montoTotRes: totRest,
        optDestino: tipoDeposito
      })
    }

  }

  getTotalRestante() {
    return this.listDetallesIngreso.map(g => g.pctXCpto!.montoAsigRest).reduce((acc, value) => acc! + value!, 0);
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


  async getDIngresoByCpto(cpto: string, idIngreso: number | null): Promise<IDetalleIngreso> {
    try {
      const detalleIngreso: IDetalleIngreso =
        await firstValueFrom(this._detalleIngresoService.getDetalleIngresoByCpto(cpto,
          idIngreso!));
      return detalleIngreso;
    } catch (error) {
      console.error('Error al obtener detalleIngresoByCpto:', error);
      throw error;
    }
  }

  cancel(): void {
    this.asigRestTotForm.reset();
    this.dialogRef.close();
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  async onSave() {


    let response!: IResponse;
    let nMonto = this.asigRestTotForm.get('montoTotRes')?.value;
    let cptoDestino = this.asigRestTotForm.get('conceptoDestino')?.value;
    let nOpcDestino = this.asigRestTotForm.get('optDestino')?.value;
    let detalleDestino: IDetalleIngreso = await this.getDIngresoByCpto(cptoDestino, this.idIngresoParam);

    if (detalleDestino) {
      if (nOpcDestino == 'EFECTIVO') {
        let montoDestinoActual = detalleDestino.pctXCpto!.montoAsigRealEfec;
        let nMontoDestino = montoDestinoActual + nMonto
        detalleDestino.pctXCpto!.montoAsigRealEfec = nMontoDestino;
      } else {
        let montoDestinoActual = detalleDestino.pctXCpto!.montoAsigRealDig;
        let nMontoDestino = montoDestinoActual + nMonto
        detalleDestino.pctXCpto!.montoAsigRealDig = nMontoDestino;
      }
      const user: IUser = {
        id: null,
        username: this.username!
      }

      detalleDestino.usuario = user;
      let conceptoId: IConceptoId = {
        idConcepto: detalleDestino.concepto?.conceptoId?.idConcepto!,
        idUsuario: detalleDestino.concepto?.conceptoId?.idUsuario!
      }
      let concepto: IConcepto = {
        conceptoId: conceptoId,
        activo: null,
        nombre: null,
        porcentaje: null,
        usuario: null

      }
      detalleDestino.concepto = concepto;


      response = await this.update(detalleDestino.detalleIngresoId!, detalleDestino)
      if (response) {
        //Se actualiza el destino
        this.showSuccess('Se ha actualizado correctamente.', detalleDestino!.concepto!.nombre!);
        this.dialogRef.close();
      }
    }


    // if (dIngresoCpto.detalleIngresoId.id != null) {
    //   this.detalleData.pctXCpto.montoAsigRest = montoRestFinal;
    //   if (nOpcDestino == 'EFECTIVO') {
    //     let montoDestinoActual = dIngresoCpto.pctXCpto.montoAsigRealEfec;
    //     let nMontoDestino = montoDestinoActual + nMonto
    //     dIngresoCpto.pctXCpto.montoAsigRealEfec = nMontoDestino;
    //   } else {
    //     let montoDestinoActual = dIngresoCpto.pctXCpto.montoAsigRealDig;
    //     let nMontoDestino = montoDestinoActual + nMonto
    //     dIngresoCpto.pctXCpto.montoAsigRealDig = nMontoDestino;
    //   }

    //   // Se actualiza el origen
    //   response = await this.update(this.detalleData.detalleIngresoId, this.detalleData)
    //   if (response) {
    //     //Se actualiza el destino
    //     response = await this.update(dIngresoCpto.detalleIngresoId, dIngresoCpto)
    //     if (response) {
    //       this.showSuccess('Se ha actualizado correctamente.', this.detalleData.concepto.nombre);
    //       this.dialogRef.close();
    //     }
    //   }
    // }



  }


  async update(id: IDetalleIngresoId, dIngreso?: IDetalleIngreso): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._detalleIngresoService.updateDIngresoAndTotRest(id.id!, id.idIngreso!, dIngreso!));
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
