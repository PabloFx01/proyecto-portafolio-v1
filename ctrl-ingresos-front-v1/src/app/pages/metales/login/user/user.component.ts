import { Component, OnInit, inject } from '@angular/core';
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
import { FormUserComponent } from './form-user/form-user.component';
import { IResponse } from '../../../../models/response.models';
import { IUser, IUsers } from '../../../../models/user.models';
import { UserService } from '../../../../services/user.service';
import { DataService } from '../../../../shared/data.service';
import { SpinnerComponent } from "../../../../shared/spinner/spinner.component";


@Component({
  selector: 'app-user',
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
    SpinnerComponent
],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css'
})
export class UserComponent implements OnInit{
  private _userService = inject(UserService);
  private _DataService = inject(DataService);
  private _router = inject(Router)
  private _toastr = inject(ToastrService)
  private users: IUser[] = [];
  //filtro
  filter: string = '';
  //Paginador
  cantidadTotal: number = 0;
  cantidadPorPagina: number = 5;
  numeroDePagina: number = 0;
  opcionesDePaginado: number[] = [1, 5, 10, 25, 100];

  dataSource: MatTableDataSource<IUser> = new MatTableDataSource<IUser>([]);
  displayedColumns: string[] = ['id', 'username', 'role', 'acciones'];

  constructor(public dialog: MatDialog) {

  }

  ngOnInit(): void {
    this.allVentaInDataSourcePaginador(null);
    this._DataService.dataUpdated$.subscribe(() => {
      this.reloadData();
    })
  }

  allVentaInDataSourcePaginador(filter: string | null): void {
    this._userService.getUserPaginador(this.cantidadPorPagina, this.numeroDePagina, filter)
      .subscribe((users: IUsers) => {
        this.dataSource.data = users.elementos;
        this.cantidadTotal = users.cantidadTotal;       
      });
  }

  private reloadData() {
    this.allVentaInDataSourcePaginador(this.filter);
  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allVentaInDataSourcePaginador(this.filter);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter = filterValue;
    this.allVentaInDataSourcePaginador(filterValue);

  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }
  isLoading: boolean = false;
  
  spinnerShow(): void {
    this.isLoading = true
  }
  
    spinnerHide(): void {
    this.isLoading = false
  }
  async eliminar(id: number) {
    if (window.confirm('¿Seguro que deseas eliminar este elemento?')) {
      this.spinnerShow();
      const response = await this.eliminarUser(id);
      if (response) {
        this.spinnerHide();
        this.showSuccess("Elemento eliminado con éxito.", "Eliminar")
        this._DataService.dataUpdated$.next();
      }      
    }
  }

  async eliminarUser(id: number): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._userService.deleteUser(id));
      return response;
    } catch (error) {
      console.error('Error al eliminar el registro:', error);
      throw error;
    }
  }

  editar(id: number) {
    this.openForm('Update', 'Actualizar', id);
  }

  addRegister() {
    this.openForm('Add', 'Crear', null);
  }

  openForm(accion: string, titulo: String, idUser: number | null) {
    const dialogRef = this.dialog.open(FormUserComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '500px',
        height: '450px',
        data: {
          tipoAccion: accion,
          titulo: titulo,
          idUser: idUser
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    });
  }

}
