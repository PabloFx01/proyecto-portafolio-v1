import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatRadioModule, MatRadioGroup } from '@angular/material/radio';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ServicioService } from '../../../../../services/servicios/servicio.service';
import { DataService } from '../../../../../shared/data.service';
import { LoginService } from '../../../../../services/login.service';
import { IPeriodPay, IServicio } from '../../../../../models/servicios/servicio.models';
import { IUser } from '../../../../../models/user.models';
import { IResponse } from '../../../../../models/response.models';
import { MatSelectModule } from '@angular/material/select';
import { SpinnerComponent } from "../../../../../shared/spinner/spinner.component";

@Component({
  selector: 'app-servicio-form',
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
    MatSelectModule, SpinnerComponent],
  templateUrl: './servicio-form.component.html',
  styleUrl: './servicio-form.component.css'
})
export class ServicioFormComponent implements OnInit {
  servicioForm!: FormGroup;
  _servicioServices = inject(ServicioService);
  private _toastr = inject(ToastrService)
  private _router = inject(Router);
  private _dataService = inject(DataService);
  private loginServices = inject(LoginService);
  title?: string;
  idServicio: number | null = null;
  dateCalendar: Date | null = null;
  servicioData: IServicio = {
    id: null,
    nombre: null,
    valor: null,
    periodoPago: null,
    fechaIniVto: null,
    fechaFinVto: null,
    comentario: null,
    activo: null,
    usuario: null
  };

  //Periodo de pago

  listPeriodPay: IPeriodPay[] = [
    { id: 0.5, descripcion: 'Quincenal' },
    { id: 1, descripcion: 'Mensual' },
    { id: 2, descripcion: 'Bimestral' },
    { id: 3, descripcion: 'Trimestral' },
    { id: 6, descripcion: 'Semestral ' },
    { id: 12, descripcion: 'Anual' }
  ];

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
    public dialogRef: MatDialogRef<ServicioFormComponent>) {
    this.title = data.titulo + ' servicio';
    this.idServicio = data.id;
    this.initForm();

  }

  ngOnInit(): void {
    this.isUserLogin();
    if (this.idServicio != null) {
      this.loadItemData(this.idServicio);
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

  initForm(): void {
    this.servicioForm = this.formBuilder.group(
      {
        nombre: [{ value: null, disabled: false }, Validators.required],
        valor: [{ value: null, disabled: false }, Validators.required],
        activo: [{ value: null, disabled: false }],
        periodoPago: [{ value: null, disabled: false }, Validators.required],
        fechaIniVto: [{ value: null, disabled: false }, Validators.required],
        fechaFinVto: [{ value: null, disabled: false }],
        comentario: [{ value: null, disabled: false }]
      }
    )
  }

  async loadItemData(itemId: number) {

    const servicio: IServicio = await this.getServicio(itemId);


    if (servicio) {    
      let newIniDate = this.getShortDate(servicio.fechaIniVto!)
      let newFinDate = this.getShortDate(servicio.fechaFinVto!)
      this.servicioForm.patchValue({
        nombre: servicio.nombre,
        valor: servicio.valor,
        activo: servicio.activo,
        periodoPago: servicio.periodoPago,
        fechaIniVto: new Date(newIniDate),
        fechaFinVto: new Date(newFinDate),
        comentario: servicio.comentario
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

  async getServicio(itemId: number): Promise<IServicio> {
    try {
      const servicio: IServicio =
        await firstValueFrom(this._servicioServices.getServicio(itemId));
      return servicio;
    } catch (error) {
      console.error('Error al obtener el servicio:', error);
      throw error;
    }
  }

  async onSave() {
    this.spinnerShow();
    let msj = 'Se ha creado correctamente.';
    let idServicio = this.idServicio;
    if (idServicio != null) {
      this.servicioData = await this.getServicio(idServicio);
      msj = 'Se ha actualizado correctamente.';
    }

    this.servicioData.nombre = this.servicioForm.get("nombre")?.value;
    this.servicioData.valor = this.servicioForm.get("valor")?.value;
    this.servicioData.activo = this.servicioForm.get("activo")?.value;
    this.servicioData.periodoPago = this.servicioForm.get("periodoPago")?.value;
    this.servicioData.fechaIniVto = this.servicioForm.get("fechaIniVto")?.value;
    this.servicioData.fechaFinVto = this.servicioForm.get("fechaFinVto")?.value;
    this.servicioData.comentario = this.servicioForm.get("comentario")?.value;


    const user: IUser = {
      id: null,
      username: this.username!
    }
    this.servicioData.usuario = user;
    let response!: IResponse;
    if (idServicio != null) {
      response = await this.update(idServicio, this.servicioData)
    } else {
      response = await this.save(this.servicioData)
    }

    if (response) {
      this.showSuccess(msj, "Servicio")
      this.spinnerHide();
      this.dialogRef.close();
    }

  }

  async update(id: number, servicio?: IServicio): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._servicioServices.updateServicio(id, servicio!));
      return response;
    } catch (error) {
      console.error('Error al actualizar servicio:', error);
      throw error;
    }
  }

  async save(servicio?: IServicio): Promise<IResponse> {
    try {
      const response: any =
        await firstValueFrom(this._servicioServices.saveServicio(servicio!));
      return response;
    } catch (error) {
      console.error('Error al guardar el servicio:', error);
      throw error;
    }
  }


  cancel(): void {
    this.servicioForm.reset();
    this.dialogRef.close();
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }
}
