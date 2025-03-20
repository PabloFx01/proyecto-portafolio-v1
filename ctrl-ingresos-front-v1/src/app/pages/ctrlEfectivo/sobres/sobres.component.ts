import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { SobreFormComponent } from './form/sobre-form/sobre-form.component';
import { LoginService } from '../../../services/login.service';
import { ILoginResponse } from '../../../models/login.models';
import { SobreService } from '../../../services/ctrlEfectivo/sobre.service';
import { DataService } from '../../../shared/data.service';
import { ISobre, ISobres } from '../../../models/ctrlEfectivo/sobre.models';
import { IResponse } from '../../../models/response.models';
import { NavCtrlEfectivoComponent } from "../nav/nav-ctrl-efectivo.component";
import { IUser } from '../../../models/user.models';

@Component({
  selector: 'app-sobres',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatButtonToggleModule,
    NavCtrlEfectivoComponent,
    RouterOutlet
  ],
  templateUrl: './sobres.component.html',
  styleUrl: './sobres.component.css'
})
export class SobresComponent implements OnInit {

  private _sobreService = inject(SobreService);
  private _DataService = inject(DataService);
  private _router = inject(Router)
  private _toastr = inject(ToastrService)
  private sobres: ISobre[] = [];
  sobreData: ISobre = {
    id: 0,
    descripcion: '',
    usuario: null
  };
  //filtro
  filter: string = '';
  state: string = 'ACT';
  //Paginador
  cantidadTotal: number = 0;
  cantidadPorPagina: number = 5;
  numeroDePagina: number = 0;
  opcionesDePaginado: number[] = [1, 5, 10, 25, 100];


  dataSource: MatTableDataSource<ISobre> = new MatTableDataSource<ISobre>([]);
  displayedColumns: string[] = ['descripcion', 'acciones'];

  loginServices = inject(LoginService);

  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }
  constructor(public dialog: MatDialog) {
    this.isUserLogin();
  }

  ngOnInit(): void {
    this.allSobreInDataSourcePaginador(null);
    this._DataService.dataUpdated$.subscribe(() => {
      this.reloadData();
    })
  }

  allSobreInDataSourcePaginador(filter: string | null): void {
    this._sobreService.getSobrePaginadorByUsername(this.cantidadPorPagina,
      this.numeroDePagina,
      this.state,
      filter,
      this.username!)
      .subscribe((Sobres: ISobres) => {
        this.dataSource.data = Sobres.elementos;
        this.cantidadTotal = Sobres.cantidadTotal;
      });
  }

  private reloadData() {
    this.allSobreInDataSourcePaginador(this.filter);
  }

  seleccionarFiltro(filtro: string) {
    this.state = filtro
    this.reloadData();
  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allSobreInDataSourcePaginador(this.filter);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter = filterValue;
    this.allSobreInDataSourcePaginador(filterValue);

  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }

  async eliminar(id: number) {
    if (window.confirm('¿Seguro que deseas desactivar este elemento?')) {
      const response = await this.eliminarSobre(id);
      if (response) {
        this._DataService.dataUpdated$.next();
        this.showSuccess("Elemento desactivado con éxito.", "Desactivar")
      }
    }
  }

  async eliminarSobre(id: number): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._sobreService.softDeleteSobre(id, this.sobreData));
      return response;
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      throw error;
    }
  }

  async restaurar(id: number) {
    if (window.confirm('¿Seguro que deseas restaurar este elemento?')) {
      const user: IUser = {
        id: null,
        username: this.username!
      }
      
      this.sobreData!.usuario = user;
      const response = await this.restaurarSobre(id);
      if (response) {
        this._DataService.dataUpdated$.next();
        this.showSuccess("Elemento restaurado con éxito.", "Cuenta")
      }
    }
  }

  async restaurarSobre(id: number): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._sobreService.updateSobreActivo(id, this.sobreData));
      return response;
    } catch (error) {
      console.error('Error al restaurar el registro:', error);
      throw error;
    }
  }

  editar(id: number) {
    this.openForm('Update', 'Actualizar', id);
  }

  addRegister() {
    this.openForm('Add', 'Crear', null);
  }

  openForm(accion: string, titulo: String, idSobre: number | null) {
    const dialogRef = this.dialog.open(SobreFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '400px',
        height: '350px',
        data: {
          tipoAccion: accion,
          titulo: titulo,
          idSobre: idSobre
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    });
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
