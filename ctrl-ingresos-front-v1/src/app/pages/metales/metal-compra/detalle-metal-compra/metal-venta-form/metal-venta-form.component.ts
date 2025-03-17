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
import { MetalVentaId, IMetalVenta } from '../../../../../models/metales/metal-venta.models';
import { IResponse } from '../../../../../models/response.models';
import { MetalVentaService } from '../../../../../services/metales/metal-venta.service';
import { DataService } from '../../../../../shared/data.service';


@Component({
  selector: 'app-metal-venta-form',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule
  ],
  templateUrl: './metal-venta-form.component.html',
  styleUrl: './metal-venta-form.component.css'
})
export class MetalVentaFormComponent implements OnInit {
  metalVentaForm!: FormGroup;
  _ApiMetalVentaService = inject(MetalVentaService);
  _DataService = inject(DataService);
  private suscripcion?: Subscription;
  private _toastr = inject(ToastrService)
  title?: string;
  idMetalVentaData: MetalVentaId = {
    id: 0,
    idMetalCompra: ''
  };
  metalVentaData: IMetalVenta = {
    metalVentaId: this.idMetalVentaData,
    descripcion: '',
    editadoPor: null,
    modificadoEl: null
  };

  constructor(private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<MetalVentaFormComponent>) {
    this.initForm();
    this.title = data.titulo;
    if (data.idMetalVenta != null) {
      this.idMetalVentaData.id = data.idMetalVenta;
    }
    this.idMetalVentaData.idMetalCompra = data.idMetalCompra;
  }

  ngOnInit(): void {
    if (this.idMetalVentaData.id != 0) {
      this.loadItemData(this.idMetalVentaData);
    } else {
      this.metalVentaForm.patchValue({
        idMetalCompra: this.idMetalVentaData.idMetalCompra
      })
    }
  }

  initForm(): void {
    this.metalVentaForm = this.formBuilder.group(
      {
        idMetalCompra: [{ value: null, disabled: true }],
        periodMetalCompra: [{ value: null, disabled: true }],
        idMetalVenta: [{ value: null, disabled: true }],
        descripcion: [{ value: '', disabled: false }, [Validators.required, Validators.minLength(3)]]
      }
    )

  }

  async loadItemData(itemId: MetalVentaId) {

    const metalVenta: IMetalVenta = await this.getMetalVenta(itemId);
    if (metalVenta) {
      this.metalVentaForm.patchValue({
        idMetalCompra: metalVenta.metalVentaId.idMetalCompra,
        idMetalVenta: metalVenta.metalVentaId.id,
        descripcion: metalVenta.descripcion,
      })
    }

  }

  async getMetalVenta(itemId: MetalVentaId): Promise<IMetalVenta> {
    try {
      const metalVenta: IMetalVenta =
        await firstValueFrom(this._ApiMetalVentaService.getMetalVenta(itemId.id,
          itemId.idMetalCompra));
      return metalVenta;
    } catch (error) {
      console.error('Error al obtener metalVenta:', error);
      throw error;
    }
  }

  async onSave() {

    this.idMetalVentaData.id = this.metalVentaForm.get("idMetalVenta")?.value;
    this.metalVentaData.descripcion = this.metalVentaForm.get("descripcion")?.value;

    let response!: IResponse;
    if (this.metalVentaForm.get('idMetalVenta')?.value != null) {
      response = await this.update(this.idMetalVentaData, this.metalVentaData)
    } else {
      let nextId: MetalVentaId = await this.obtenerMetalVentaId(this.idMetalVentaData.idMetalCompra)
      if (nextId) {
        this.metalVentaData.metalVentaId = nextId;
        console.log("nextId " + nextId);

        response = await this.saveMetalVenta(this.metalVentaData);
      }
    }
    if (response) {
      this.showSuccess('Se ha asociado correctamente.', this.metalVentaData!.descripcion)
      this.dialogRef.close();
    }
  }

  async obtenerMetalVentaId(idMetalCompra: string): Promise<MetalVentaId> {
    try {
      const Id: MetalVentaId =
        await firstValueFrom(this._ApiMetalVentaService.getnextMetalVentaIdByIdMetalCompra(idMetalCompra));
      return Id;
    } catch (error) {
      console.error('Error al obtener el getnextMetalVentaIdByIdMetalCompra:', error);
      throw error;
    }
  }


  async saveMetalVenta(metalVenta?: IMetalVenta): Promise<IResponse> {
    console.log("save");
    try {
      const response: IResponse =
        await firstValueFrom(this._ApiMetalVentaService.saveMetalVenta(metalVenta!));
      return response;
    } catch (error) {
      console.error('Error al guardar ticket:', error);
      throw error;
    }
  }

  async update(id: MetalVentaId, metalVenta?: IMetalVenta): Promise<IResponse> {
    console.log("update");

    try {
      const response: IResponse =
        await firstValueFrom(this._ApiMetalVentaService.updateMetalVenta(id.id, id.idMetalCompra, metalVenta!));
      return response;
    } catch (error) {
      console.error('Error al actualizar metalVenta:', error);
      throw error;
    }
  }


  cancel(): void {
    this.metalVentaForm.reset();
    this.suscripcion?.unsubscribe();
    this.dialogRef.close();
  }

  hasError(formControlName: string, typeError: string) {
    return this.metalVentaForm.get(formControlName)?.hasError(typeError) &&
      this.metalVentaForm.get(formControlName)?.touched;
  }
  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }
}
