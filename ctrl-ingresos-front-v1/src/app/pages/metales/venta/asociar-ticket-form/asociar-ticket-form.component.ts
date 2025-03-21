import { CommonModule } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Subscription, firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { ITicket } from '../../../../models/metales/ticket.models';
import { IVenta } from '../../../../models/metales/venta.models';
import { IResponse } from '../../../../models/response.models';
import { TicketService } from '../../../../services/metales/ticket.service';
import { VentaService } from '../../../../services/metales/venta.service';
import { DataService } from '../../../../shared/data.service';
import { ILoginResponse } from '../../../../models/login.models';
import { LoginService } from '../../../../services/login.service';
import { IUser } from '../../../../models/user.models';
import { SpinnerComponent } from "../../../../shared/spinner/spinner.component";

@Component({
  selector: 'app-asociar-ticket-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatSelectModule,
    MatIconModule,
    MatToolbarModule, SpinnerComponent],
  templateUrl: './asociar-ticket-form.component.html',
  styleUrl: './asociar-ticket-form.component.css'
})
export class AsociarTicketFormComponent implements OnInit, OnDestroy {


  asociarTicketForm!: FormGroup;
  _DataService = inject(DataService);
  private suscripcion?: Subscription;
  private _toastr = inject(ToastrService);
  private _apiTicketServices = inject(TicketService);
  private _apiVentaServices = inject(VentaService);
  private _router = inject(Router)
  listTicket: ITicket[] = [];
  title?: string;
  idVentaParam: number = 0;

  ventaData: IVenta = {
    id: 0,
    descripcion: '',
    fechaVenta: null,
    ventaIndividual: false,
    gananciaTotal: 0,
    editadoPor: null,
    modificadoEl: null,
    ticket: null,
    usuario: null
  };

  ticketData: ITicket = {
    id: 0,
    descripcion: '',
    fechaTicket: null,
    editadoPor: null,
    importTotal: null,
    modificadoEl: null,
    used: false,
    usuario: null
  };

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
    public dialogRef: MatDialogRef<AsociarTicketFormComponent>) {
    this.isUserLogin();
    this.initForm();
    this.title = data.titulo;
    this.idVentaParam = data.idVenta;
  }

  ngOnInit(): void {
    this.loadTickets();
  }

  initForm(): void {
    this.asociarTicketForm = this.formBuilder.group(
      {
        ticketDescripcion: [{ value: '', disabled: false }, [Validators.required]],

      }
    )
  }

  loadTickets() {
    this._apiTicketServices.getTicketsNotUsed(this.username!).subscribe((tickets: ITicket[]) => {
      this.listTicket = tickets;
    })

  }

  newTicket() {
    this._router.navigate(["/ticket"])
    this.close()
  }

  async onSave() {
    if (this.idVentaParam > 0) {
      this.spinnerShow();
      let ventaUpdate: IVenta = await this.getVenta(this.idVentaParam);
      if (ventaUpdate) {

        let usuario: IUser = {
          id: null,
          username: this.username!
        }

        let idTicket = this.asociarTicketForm.get('ticketDescripcion')?.value;
        let ticket: ITicket = await this.getTicket(idTicket)
        if (ticket) {

          this.ventaData!.id = ventaUpdate.id;
          this.ventaData!.descripcion = ventaUpdate.descripcion;
          this.ventaData!.fechaVenta = ventaUpdate.fechaVenta;
          this.ventaData!.ventaIndividual = ventaUpdate.ventaIndividual;
          this.ventaData!.editadoPor = this.username!;
          this.ventaData!.modificadoEl = new Date;
          this.ventaData.usuario = usuario;


          this.ticketData.id = ticket.id;
          this.ventaData.ticket = this.ticketData;

          let response: IResponse = await this.actualizarVenta(this.idVentaParam, this.ventaData!);
          if (response) {
            this._DataService.dataUpdated$.next();
            this.spinnerHide();
            this.close();
          }
        }
      }
    }
  }

  async getVenta(idVenta: number): Promise<IVenta> {
    try {
      const venta: IVenta =
        await firstValueFrom(this._apiVentaServices.getVenta(idVenta));
      return venta;
    } catch (error) {
      console.error('Error al optener venta:', error);
      throw error;
    }

  }

  async getTicket(idTicket: number): Promise<ITicket> {
    try {
      const Ticket: ITicket =
        await firstValueFrom(this._apiTicketServices.getTicket(idTicket));
      return Ticket;
    } catch (error) {
      console.error('Error al optener venta:', error);
      throw error;
    }

  }

  async actualizarVenta(ventaId: number, venta: IVenta): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._apiVentaServices.updateVenta(ventaId, venta));
      return response;
    } catch (error) {
      console.error('Error al actualizar venta:', error);
      throw error;
    }
  }


  cancel(): void {
    this.close()
  }

  close(): void {
    this.asociarTicketForm.reset();
    this.suscripcion?.unsubscribe();
    this.dialogRef.close();
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  ngOnDestroy(): void {

    this.dialogRef.close();
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
