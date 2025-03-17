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
import { Subscription, firstValueFrom } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { ILoginResponse } from '../../../../../../models/login.models';
import { ITicket } from '../../../../../../models/metales/ticket.models';
import { IResponse } from '../../../../../../models/response.models';
import { TicketService } from '../../../../../../services/metales/ticket.service';
import { DataService } from '../../../../../../shared/data.service';
import { IUser } from '../../../../../../models/user.models';
import { LoginService } from '../../../../../../services/login.service';


@Component({
  selector: 'app-ticket-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule],
  templateUrl: './ticket-form.component.html',
  styleUrl: './ticket-form.component.css'
})
export class TicketFormComponent implements OnInit {

  ticketForm!: FormGroup;
  _ApiTicketService = inject(TicketService);
  _DataService = inject(DataService);
  private suscripcion?: Subscription;
  private _toastr = inject(ToastrService)
  title?: string;
  idTicket: number | null = null;
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

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<TicketFormComponent>) {
    this.isUserLogin();
    this.initForm();
    this.title = data.titulo;
    this.idTicket = data.idTicket;
  }

  ngOnInit(): void {
    if (this.idTicket != null) {
      this.loadItemData(this.idTicket);
    } else {
      this.ticketForm.patchValue({
        fechaTicket: Date()
      })
    }
  }


  initForm(): void {
    this.ticketForm = this.formBuilder.group(
      {
        id: [{ value: null, disabled: true }],
        descripcion: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(3)]],
        fechaTicket: [{ value: '', disabled: false }, Validators.required],
      }
    )

  }

  async loadItemData(itemId: number) {

    const ticket: ITicket = await this.getTicket(itemId);
    if (ticket) {
      this.ticketForm.patchValue({
        id: ticket.id,
        descripcion: ticket.descripcion,
        fechaTicket: ticket.fechaTicket
      })
    }

  }

  async getTicket(itemId: number): Promise<ITicket> {
    try {
      const ticket: ITicket =
        await firstValueFrom(this._ApiTicketService.getTicket(itemId));
      return ticket;
    } catch (error) {
      console.error('Error al obtener el ticket:', error);
      throw error;
    }
  }

  async onSave() {

    let usuario: IUser = {
      id: null,
      username: this.username!
    }

    this.ticketData!.id = this.ticketForm.get("id")?.value;
    this.ticketData!.descripcion = this.ticketForm.get("descripcion")?.value;
    this.ticketData!.fechaTicket = this.ticketForm.get("fechaTicket")?.value;
    this.ticketData!.editadoPor = this.username;
    this.ticketData!.modificadoEl = new Date;
    this.ticketData!.usuario = usuario;
    let response!: IResponse;
    if (this.ticketForm.get('id')?.value != null) {
      response = await this.update(this.ticketForm.get('id')?.value, this.ticketData)
    } else {
      response = await this.saveTicket(this.ticketData);
    }

    if (response) {
      this.showSuccess('Se ha guardado correctamente.', this.ticketData!.descripcion)
      this.dialogRef.close();
    }
  }


  async saveTicket(ticket?: ITicket): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiTicketService.saveTicket(ticket!));
      return response;
    } catch (error) {
      console.error('Error al guardar ticket:', error);
      throw error;
    }
  }

  async update(id: number, ticket?: ITicket): Promise<IResponse> {

    try {
      const response: IResponse =
        await firstValueFrom(this._ApiTicketService.updateTicket(id, ticket!));
      return response;
    } catch (error) {
      console.error('Error al actualizar ticket:', error);
      throw error;
    }
  }



  cancel(): void {
    this.ticketForm.reset();
    this.suscripcion?.unsubscribe();
    this.dialogRef.close();
  }

  hasError(formControlName: string, typeError: string) {
    return this.ticketForm.get(formControlName)?.hasError(typeError) &&
      this.ticketForm.get(formControlName)?.touched;
  }
  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
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
