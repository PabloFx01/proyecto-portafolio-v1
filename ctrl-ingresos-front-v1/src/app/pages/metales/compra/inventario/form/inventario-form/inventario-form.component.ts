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
import { InventarioService } from '../../../../../../services/metales/inventario.service';
import { LoginService } from '../../../../../../services/login.service';
import { IInventario } from '../../../../../../models/metales/inventario.models';
import { IUser } from '../../../../../../models/user.models';
import { IMetalCompra } from '../../../../../../models/metales/metal-compra.models';
import { IResponse } from '../../../../../../models/response.models';


@Component({
  selector: 'app-inventario-form',
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
  templateUrl: './inventario-form.component.html',
  styleUrl: './inventario-form.component.css'
})
export class InventarioFormComponent {
  inventarioForm!: FormGroup;
  _inventarioService = inject(InventarioService);
  private _toastr = inject(ToastrService)
  private loginServices = inject(LoginService);
  public dialog = inject(MatDialog)
  title?: string;
  idInventario: number | null = null;
  msjError: string | null = null
  maxMontoPrestar: number = 0;

  InventarioData: IInventario = {
    inventarioId: null,
    fechaIni: null,
    fechaUltAct: null,
    importeTotal: null,
    metal: null,
    stock: null,
    usuario: null
  };

  metalData: IMetalCompra = {
    metalId: null,
    nombre: '',
    precio: 0,
    fechaIni: new Date(),
    fechaFin: null,
    editadoPor: '',
    modificadoEl: null,
    usuario: null
  }

  userLoginOn: boolean = false;
  username: string | null = '';
  role: String | null = '';
  idMetal: string | null;


  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<InventarioFormComponent>) {
    this.title = data.titulo + ' inventario';
    this.idInventario = data.idInventario;
    this.idMetal = data.idMetal;
    this.isUserLogin();
  }

  async ngOnInit(): Promise<void> {
    this.initForm();
    await this.loadGralData();

  }

  initForm(): void {

    this.inventarioForm = this.formBuilder.group(
      {
        material: [{ value: null, disabled: true }],
        stock: [{ value: null, disabled: false }, Validators.required]
      }
    )
  }

  async loadGralData(): Promise<void> {
    if (this.idInventario != null) {
      this.InventarioData = await this.getInventario(this.idInventario!, this.idMetal!);
      if (this.InventarioData) {
        this.inventarioForm.patchValue({
          material: this.InventarioData.metal?.nombre,
          stock: this.InventarioData.stock
        })
      }
    }
  }

  getShortDate(fecha: Date): string {
    let ahora = new Date(fecha);
    let fechaActual = ahora.getFullYear() + '-'
      + ('0' + (ahora.getMonth() + 1)).slice(-2) + '-'
      + ('0' + ahora.getDate()).slice(-2) + ' '
    return fechaActual;
  }

  async getInventario(idInventario: number, idMetal: string): Promise<IInventario> {
    try {
      const inventario: IInventario =
        await firstValueFrom(this._inventarioService.getInventario(idInventario, idMetal));
      return inventario;
    } catch (error) {
      console.error('Error al obtener el inventario:', error);
      throw error;
    }
  }


  async onSave() {
    let msj = 'El inventario se ha generado con éxito.';
    let idInventario = this.idInventario;
    let idMetal = this.idMetal;
    if (idInventario != null) {
      this.InventarioData = await this.getInventario(this.idInventario!, idMetal!);
      msj = 'El inventario se ha actualizado correctamente.';
    }

    const user: IUser = {
      id: null,
      username: this.username!
    }
    this.InventarioData.usuario = user;

    let stock = this.inventarioForm.get("stock")?.value;    
    let nImporte = (stock * this.InventarioData.metal?.precio!)
    let fechaActualizacion = new Date();
    this.metalData.metalId = this.InventarioData.metal?.metalId!;
    this.InventarioData.metal = this.metalData;
    this.InventarioData.fechaUltAct = fechaActualizacion;
    this.InventarioData.stock = stock;
    this.InventarioData.importeTotal = nImporte;

    let response!: IResponse;
    if (idInventario != null) {
      response = await this.update(this.idInventario!, this.idMetal!, this.InventarioData!)
    }

    if (response) {
      this.showSuccess(msj, "Prestamo")
      this.dialogRef.close();
    }

  }


  async update(idInvenario: number, idMetal: string, inventario?: IInventario): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._inventarioService.updateInventario(idInvenario, idMetal!, inventario!));
      return response;
    } catch (error) {
      console.error('Error al actualizar el inventario:', error);
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
    this.inventarioForm.reset();
    this.dialogRef.close();
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }
}

