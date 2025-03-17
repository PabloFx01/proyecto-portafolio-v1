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
import { IngresoService } from '../../../../services/ingresos/ingreso.service';
import { IIngreso } from '../../../../models/ingresos/ingreso.models';
import { IResponse } from '../../../../models/response.models';
import { IUser } from '../../../../models/user.models';
import { Router } from '@angular/router';
import { DataService } from '../../../../shared/data.service';
import { LoginService } from '../../../../services/login.service';
import { ConceptoService } from '../../../../services/ingresos/concepto.service';
import { IConcepto } from '../../../../models/ingresos/concepto.models';
import { onConceptosFormComponent } from '../onConceptos-form/onConceptos-form.component';


@Component({
  selector: 'app-ingreso-form',
  standalone: true,
  imports: [
    CommonModule,
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
    MatIconModule
  ],
  templateUrl: './ingreso-form.component.html',
  styleUrl: './ingreso-form.component.css'
})
export class IngresoFormComponent {

  ingresoForm!: FormGroup;
  _apiIngresoService = inject(IngresoService);
  private _toastr = inject(ToastrService)
  private _router = inject(Router);
  private _conceptoService = inject(ConceptoService);
  private loginServices = inject(LoginService);
  public dialog = inject(MatDialog)
  title?: string;
  idIngreso: number | null = null;
  dateCalendar: Date | null = null;
  ingresoData: IIngreso = {
    id: null,
    comentario: '',
    detallesIngreso: null,
    fechaDeposito: new Date(),
    montoIngreso: 0,
    tmoneda: '',
    asociarConceptos: false,
    usuario: null
  };
  tMonedas: string[] = ['EFECTIVO', 'DIGITAL'];
  conceptos: IConcepto[] = [];
  totPcjeActivo: number | null = 0;

  edit: boolean = false;
  asociarCptos: boolean = false;
  userLoginOn: boolean = false;
  username: string | null = '';
  role: String | null = '';


  habilitar(): void {
    this.ingresoForm.enable();
    this.edit = true;
    console.log(this.edit);

  }
  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<IngresoFormComponent>) {
    this.title = data.titulo + ' ingreso';
    this.idIngreso = data.idItem;
    this.dateCalendar = new Date(this.getShortDate(data.dateCalendar))
    this.initForm();
    console.log('viene el siguiente id: ' + data.idItem);

  }

  ngOnInit(): void {
    this.isUserLogin();
    if (this.idIngreso != null) {
      this.loadItemData(this.idIngreso);
    } else {
      this.habilitar();
    }
    console.log(this.edit);
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

  initForm(): void {
    this.ingresoForm = this.formBuilder.group(
      {
        monto: [{ value: null, disabled: true }, Validators.required],
        tipoMoneda: [{ value: 'EFECTIVO', disabled: true }, Validators.required],
        comentario: [{ value: null, disabled: true }, Validators.required],
        fechaDeposito: [{ value: this.dateCalendar, disabled: true }, Validators.required],
        asociarConcepto: [{ value: '', disabled: true }]
      }
    )
  }

  async loadItemData(itemId: number) {

    const ingreso: IIngreso = await this.getIngreso(itemId);
    this.ingresoData = ingreso;
    if (ingreso) {
      let nuevaFecha = this.getShortDate(ingreso.fechaDeposito)
      this.ingresoForm.patchValue({
        id: ingreso.id,
        monto: ingreso.montoIngreso,
        tipoMoneda: ingreso.tmoneda,
        comentario: ingreso.comentario,
        fechaDeposito: new Date(nuevaFecha),
        asociarConcepto: ingreso.asociarConceptos
      })
    }

  }

  getShortDate(fecha: Date): string {
    let ahora = new Date(fecha);
    let fechaActual = ahora.getFullYear() + '-'
      + ('0' + (ahora.getMonth() + 1)).slice(-2) + '-'
      + ('0' + ahora.getDate()).slice(-2) + ' '
    return fechaActual;
  }

  async getIngreso(itemId: number): Promise<IIngreso> {
    try {
      const ingreso: IIngreso =
        await firstValueFrom(this._apiIngresoService.getIngreso(itemId));
      return ingreso;
    } catch (error) {
      console.error('Error al obtener el ingreso:', error);
      throw error;
    }
  }

  editar() {
    this.habilitar();
  }

  irDetalles(idIngreso: number | null) {
    this._router.navigate(["/detallesIngreso", idIngreso])
    this.dialogRef.close();
  }


  openForm() {
    const dialogRef = this.dialog.open(onConceptosFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30vh' },
        width: '300px',
        height: '250px',
        data: {
          username: this.username,
          dialogIngreso: this.dialogRef
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
    });
  }

  async fncOnsave(): Promise<void> {

    let msj = 'Se ha creado correctamente.';
    let idIngreso = this.idIngreso;
    if (idIngreso != null) {
      this.ingresoData! = await this.getIngreso(idIngreso);
      msj = 'Se ha actualizado correctamente.';
    }

    this.ingresoData!.montoIngreso = this.ingresoForm!.get("monto")?.value;
    this.ingresoData!.comentario = this.ingresoForm.get("comentario")?.value;
    this.ingresoData!.fechaDeposito = new Date(this.getShortDate(this.ingresoForm!.get("fechaDeposito")?.value));
    this.ingresoData!.tmoneda = this.ingresoForm!.get("tipoMoneda")?.value;
    this.ingresoData!.asociarConceptos = this.ingresoForm!.get("asociarConcepto")?.value;
    const user: IUser = {
      id: null,
      username: this.username!
    }
    
    this.ingresoData!.usuario = user;
    let response!: IResponse;
    if (idIngreso != null) {
      response = await this.update(idIngreso, this.ingresoData)
    } else {
      response = await this.save(this.ingresoData)
    }

    if (response) {
      this.showSuccess(msj, "Ingreso")
      this.dialogRef.close();
    }
  }

  async onSave() {
    this.asociarCptos = this.ingresoForm!.get("asociarConcepto")?.value;
    if (this.asociarCptos) {
      this.conceptos = await this.getAllConceptosAct(this.username!)
      if (this.conceptos.length > 0) {
        this.totPcjeActivo = this.getTotPcjeAct();
      }

      if (this.totPcjeActivo != 100) {
        this.openForm();
      } else {
          this.fncOnsave();     
      }
    }else{
      this.fncOnsave();
    }

  }

  async update(id: number, ingreso?: IIngreso): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._apiIngresoService.updateIngreso(id, ingreso!));
      return response;
    } catch (error) {
      console.error('Error al actualizar ingreso:', error);
      throw error;
    }
  }

  async save(ingreso: IIngreso): Promise<IResponse> {
    try {
      const response: any =
        await firstValueFrom(this._apiIngresoService.saveIngreso(ingreso));
      return response;
    } catch (error) {
      console.error('Error al guardar el ingreso:', error);
      throw error;
    }
  }

  async eliminar(idIngreso: number | null): Promise<void> {
    if (window.confirm('¿Seguro que deseas eliminar este elemento?')) {
      const response = await this.eliminarIngreso(idIngreso!);
      if (response) {
        console.log(response.message);
        this.showSuccess(response.message, 'Ingreso');
        this.dialogRef.close();
      }

    }
  }

  async eliminarIngreso(id: number): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._apiIngresoService.deleteIngreso(id));
      return response;
    } catch (error) {
      console.error('Error al eliminar el ingreso:', error);
      throw error;
    }
  }

  getTotPcjeAct(): number | null {
    return this.conceptos.map(c => c.porcentaje).reduce((acc, value) => acc! + value!, 0);
  }

  async getAllConceptosAct(username: string): Promise<IConcepto[]> {
    try {
      const conceptos: IConcepto[] =
        await firstValueFrom(this._conceptoService.getAllConceptosAct(username));
      return conceptos;
    } catch (error) {
      console.error('Error al obtener los conceptos:', error);
      throw error;
    }
  }

  cancel(): void {
    this.ingresoForm.reset();
    this.dialogRef.close();
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

}
