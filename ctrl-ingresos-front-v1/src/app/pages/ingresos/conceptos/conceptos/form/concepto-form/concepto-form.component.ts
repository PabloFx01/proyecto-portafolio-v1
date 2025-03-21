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
import { ConceptoService } from '../../../../../../services/ingresos/concepto.service';
import { Router } from '@angular/router';
import { DataService } from '../../../../../../shared/data.service';
import { LoginService } from '../../../../../../services/login.service';
import { IConcepto } from '../../../../../../models/ingresos/concepto.models';
import { IUser } from '../../../../../../models/user.models';
import { IResponse } from '../../../../../../models/response.models';
import { SpinnerComponent } from "../../../../../../shared/spinner/spinner.component";


@Component({
  selector: 'app-concepto-form',
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
    MatIconModule, SpinnerComponent],
  templateUrl: './concepto-form.component.html',
  styleUrl: './concepto-form.component.css'
})
export class ConceptoFormComponent implements OnInit{
  conceptoForm!: FormGroup;
  _conceptoServices = inject(ConceptoService);
  private _toastr = inject(ToastrService)
  private _router = inject(Router);
  private _dataService = inject(DataService);
  private loginServices = inject(LoginService);
  title?: string;
  idConcepto: number | null = null;
  dateCalendar: Date | null = null;
  conceptoData: IConcepto = {
    conceptoId : null,
    nombre: null,
    porcentaje: null,
    activo : null,
    usuario: null
  };

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
    public dialogRef: MatDialogRef<ConceptoFormComponent>) {
    this.title = data.titulo + ' concepto';
    this.idConcepto = data.id;
    this.initForm();

  }

  ngOnInit(): void {
    this.isUserLogin();
    if (this.idConcepto != null) {
      this.loadItemData(this.idConcepto);
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
    this.conceptoForm = this.formBuilder.group(
      {
        nombre: [{ value: null, disabled: false }, Validators.required],
        porcentaje: [{ value: null, disabled: false }, Validators.required],
        activo: [{ value: null, disabled: false }]
      }
    )
  }

  async loadItemData(itemId: number) {

    const concepto: IConcepto = await this.getConcepto(itemId);

    if (concepto) {
      this.conceptoForm.patchValue({
        nombre: concepto.nombre,
        porcentaje: concepto.porcentaje,
        activo: concepto.activo
      })
    }

  }

  async getConcepto(itemId: number): Promise<IConcepto> {
    try {
      const concepto: IConcepto =
        await firstValueFrom(this._conceptoServices.getConcepto(itemId, this.username!));
      return concepto;
    } catch (error) {
      console.error('Error al obtener el concepto:', error);
      throw error;
    }
  }

  async onSave() {
    this.spinnerShow();
    let msj = 'Se ha creado correctamente.';
    let idConcepto = this.idConcepto;
    if (idConcepto != null) {
      this.conceptoData = await this.getConcepto(idConcepto);
      msj = 'Se ha actualizado correctamente.';
    }

    this.conceptoData.nombre = this.conceptoForm!.get("nombre")?.value;
    this.conceptoData.porcentaje = this.conceptoForm.get("porcentaje")?.value;
    this.conceptoData.activo = this.conceptoForm.get("activo")?.value;
 
    const user: IUser = {
      id: null,
      username: this.username!
    }
    this.conceptoData.usuario = user;
    let response!: IResponse;
    if (idConcepto != null) {
      response = await this.update(idConcepto, this.conceptoData)
    } else {
      response = await this.save(this.conceptoData)
    }

    if (response) {
      this.showSuccess(msj, "Concepto")
      this.dialogRef.close();
      this.spinnerHide();
    }

  }

  async update(id: number, concepto?: IConcepto): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._conceptoServices.updateConcepto(id, concepto!));
      return response;
    } catch (error) {
      console.error('Error al actualizar concepto:', error);
      throw error;
    }
  }

  async save(concepto?: IConcepto): Promise<IResponse> {
    try {
      const response: any =
        await firstValueFrom(this._conceptoServices.saveConcepto(concepto!));
      return response;
    } catch (error) {
      console.error('Error al guardar el concepto:', error);
      throw error;
    }
  }



  cancel(): void {
    this.conceptoForm.reset();
    this.dialogRef.close();
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }
}
