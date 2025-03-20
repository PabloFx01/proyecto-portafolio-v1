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
import { MatCardModule } from '@angular/material/card';
import { firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import * as moment from 'moment-timezone';
import { Dialog } from '@angular/cdk/dialog';
import { ServicioService } from '../../../services/servicios/servicio.service';
import { IServicio } from '../../../models/servicios/servicio.models';
import { IFactura } from '../../../models/servicios/factura.models';
import { FacturaService } from '../../../services/servicios/factura.service';
import { LoginService } from '../../../services/login.service';
import { ILoginResponse } from '../../../models/login.models';

@Component({
  selector: 'app-dialog-servicio',
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
    MatCardModule],
  templateUrl: './dialog-servicio.component.html',
  styleUrl: './dialog-servicio.component.css'
})
export class DialogServicioComponent implements OnInit {


  tarjetas: any[] = [];
  idService: number;
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
  }

  facturaData: IFactura = {
    id: null,
    detallesFactura: null,
    estado: null,
    fecha: null,
    saldoRest: null,
    servicio: null,
    totPag: null,
    fechaPagoTotVto: null,
    usuario: null
  };
  _serviciosService = inject(ServicioService);
  private _facturaService = inject(FacturaService);
  private _router = inject(Router);

  loginServices = inject(LoginService);

  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }

  late: boolean = false;
  paid: boolean = false;
  diaAct: string = "";
  diaIni: string = "";
  diaFin: string = "";
  mesIni: string = "";
  mesFin: string = "";
  mesAct: string = "";
  yearAct: number = 0;
  yearVto: number = 0;
  diasIniVto: number = 0;
  diasFinVto: number = 0;
  fechaActual: string | null = null;
  ngOnInit(): void {


  }

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<DialogServicioComponent>) {
    this.idService = data.idItem;
    this.isUserLogin();
    this.loadItemData(this.idService);

  }

  getShortDate(fecha: Date): string {
    let ahora = new Date(fecha);
    let fechaActual = ahora.getFullYear() + '-'
      + ('0' + (ahora.getMonth() + 1)).slice(-2) + '-'
      + ('0' + ahora.getDate()).slice(-2) + ' '
    return fechaActual;
  }

  getDayDate(fecha: Date): string {
    let ahora = new Date(fecha);
    let fechaActual = ('0' + ahora.getDate()).slice(-2) + ''
    return fechaActual;
  }

  getMonthDate(fecha: Date): string {
    let ahora = new Date(fecha);
    let fechaActual = ('0' + (ahora.getMonth() + 1)).slice(-2) + ''
    return fechaActual;
  }

  async loadItemData(itemId: number) {
    const servicio: IServicio = await this.getServicio(itemId);
    this.servicioData = servicio;
    if (servicio) {
      this.paid = false;
      try {
        let factura: IFactura = await this.getFactura(this.servicioData.id!);
        if (factura) {
          this.paid = true;
        }
      } catch (error) {
        this.paid = false;
      }


      let fechaDesde = new Date(this.getShortDate(this.servicioData.fechaIniVto!));
      let fechaHasta = new Date(this.getShortDate(this.servicioData.fechaFinVto!));
      this.fechaActual = this.getShortDate(new Date)

      let arrayFechas = this.obtenerFechas(fechaDesde, fechaHasta);
      this.diaIni = this.getDayDate(this.servicioData.fechaIniVto!);
      this.diaFin = this.getDayDate(this.servicioData.fechaFinVto!);
      this.mesIni = this.getMonthDate(this.servicioData.fechaIniVto!);
      this.mesFin = this.getMonthDate(this.servicioData.fechaFinVto!);
      this.diasIniVto = this.calDiasFaltantesVto(this.servicioData.fechaIniVto!, this.servicioData.fechaFinVto!);
      this.diasFinVto = this.calDiasFaltantesVto(this.servicioData.fechaFinVto!, this.servicioData.fechaFinVto!);

      arrayFechas.forEach((fecha, index) => {
        this.tarjetas.push({
          fecha: this.getDayDate(fecha),
          diaSemana: this.obtenerDiaSemana(fecha),
          mes: this.obtenerMesDelAño(fecha),
          fechaCompleta: this.getShortDate(fecha)

        });
      });
      let hoy = new Date();
      let totArray = arrayFechas.length;
      let mitadArray = Math.ceil(totArray / 2);
      this.diaAct = this.getDayDate(hoy);
      this.mesAct = this.obtenerMesDelAño(hoy);
      this.yearAct = hoy.getFullYear();
      this.yearVto = fechaHasta.getFullYear();
      if (hoy >= arrayFechas[mitadArray]) {
        this.late = true
      }

    }
  }
  obtenerDiaSemana(fecha: Date): string {
    const diasDeLaSemana = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
    return diasDeLaSemana[fecha.getDay()];
  }

  obtenerMesDelAño(fecha: Date): string {
    const mesesDelAño = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
    return mesesDelAño[fecha.getMonth()];
  }

  calDiasFaltantesVto(fechaDesde: Date, fechaHasta: Date): number {

    let fechaInicio = new Date();
    let fechaFin = new Date(this.getShortDate(fechaDesde));

    // Convierte las fechas a milisegundos
    var tiempoInicio = fechaInicio.getTime();
    var tiempoFin = fechaFin.getTime();

    // Calcula la diferencia en milisegundos
    var diferenciaMilisegundos = tiempoFin - tiempoInicio;

    // Convierte la diferencia a días
    var diferenciaDias = diferenciaMilisegundos / (1000 * 60 * 60 * 24);

    return Math.ceil(diferenciaDias);
  }

  async getServicio(itemId: number): Promise<IServicio> {
    try {
      const servicio: IServicio =
        await firstValueFrom(this._serviciosService.getServicio(itemId));
      return servicio;
    } catch (error) {
      console.error('Error al obtener el servicio:', error);
      throw error;
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  aFacturacion() {
    this._router.navigate(["/facturacionDetails", this.servicioData.id, this.servicioData.nombre]);
    this.cancel();
  }

  async getFactura(idServicio: number): Promise<IFactura> {
    try {
      const factura: IFactura =
        await firstValueFrom(this._facturaService.getFacturaPaidByUserAndService(idServicio, this.username!));
      return factura;
    } catch (error) {
      console.error('Error al obtener la Factura:', error);
      throw error;
    }
  }

  obtenerFechas(desde: any, hasta: any) {
    let fechas = [];
    let fechaActual = desde;

    while (fechaActual <= hasta) {
      fechas.push(new Date(fechaActual));
      fechaActual.setDate(fechaActual.getDate() + 1);
    }

    return fechas;
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
