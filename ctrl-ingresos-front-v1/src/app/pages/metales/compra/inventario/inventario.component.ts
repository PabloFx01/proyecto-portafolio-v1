import { Component, OnInit, inject } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterOutlet } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { IInventario, IInventarios } from '../../../../models/metales/inventario.models';
import { InventarioService } from '../../../../services/metales/inventario.service';
import { DataService } from '../../../../shared/data.service';
import { MetalesNavComponent } from "../../metales-nav/metales-nav.component";
import { LoginService } from '../../../../services/login.service';
import { ILoginResponse } from '../../../../models/login.models';
import { MatDialog } from '@angular/material/dialog';
import { InventarioFormComponent } from './form/inventario-form/inventario-form.component';



@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatButtonToggleModule,
    CurrencyPipe, MetalesNavComponent, RouterOutlet],
  templateUrl: './inventario.component.html',
  styleUrl: './inventario.component.css'
})
export class InventarioComponent implements OnInit {
  eliminar() {
    throw new Error('Method not implemented.');
  }
  editar(id: number, metalId:string) {
    this.openForm('Update', 'Actualizar', id, metalId);
  }

  private _ApiService = inject(InventarioService);
  private _DataService = inject(DataService);

  //filtro
  filter: string = '';

  //Paginador
  cantidadTotal: number = 0;
  cantidadPorPagina: number = 5;
  numeroDePagina: number = 0;
  opcionesDePaginado: number[] = [1, 5, 10, 25, 100];
  //Usuario
  loginServices = inject(LoginService);
  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }

  dataSource: MatTableDataSource<IInventario> = new MatTableDataSource<IInventario>([]);
  displayedColumns: string[] = ['id', 'metalNombre', 'stock', 'fechaIni', 'importeTotal', 'fechaUltAct', 'acciones'];

  constructor(public dialog: MatDialog) {
    this.isUserLogin();
  }
  
  ngOnInit(): void {
    this.allInventarioInDataSourcePaginador(null);
    this._DataService.dataUpdated$.subscribe(() => {
      this.reloadData();
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter = filterValue;
    this.allInventarioInDataSourcePaginador(filterValue);

  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allInventarioInDataSourcePaginador(this.filter);
  }

  allInventarioInDataSourcePaginador(filter: string | null): void {
    this._ApiService.getInventarioPaginador(
      this.cantidadPorPagina,
      this.numeroDePagina,
      filter,
      this.username!)
      .subscribe((inventarios: IInventarios) => {
        this.dataSource.data = inventarios.elementos;
        this.cantidadTotal = inventarios.cantidadTotal;
      });
  }

  private reloadData() {
    this.allInventarioInDataSourcePaginador(this.filter);
  }

  openForm(accion: string, titulo: String, idInventario: number | null, idMetal: string) {
    const dialogRef = this.dialog.open(InventarioFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '400px',
        height: '400px',
        data: {
          tipoAccion: accion,
          titulo: titulo,
          idInventario: idInventario,
          idMetal : idMetal
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
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
