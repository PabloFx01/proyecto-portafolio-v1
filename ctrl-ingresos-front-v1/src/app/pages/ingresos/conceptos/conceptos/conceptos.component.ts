import { Component, HostListener, OnInit, inject } from '@angular/core';
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
import { ToastrService } from 'ngx-toastr';
import { firstValueFrom } from 'rxjs';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { ConceptoService } from '../../../../services/ingresos/concepto.service';
import { DataService } from '../../../../shared/data.service';
import { ILoginResponse } from '../../../../models/login.models';
import { LoginService } from '../../../../services/login.service';
import { IConcepto, IConceptoId, IConceptos } from '../../../../models/ingresos/concepto.models';
import { IResponse } from '../../../../models/response.models';
import { ConceptoFormComponent } from './form/concepto-form/concepto-form.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NavComponent } from "../../nav/nav.component";
import { MatMenuModule } from '@angular/material/menu';
import { IUser } from '../../../../models/user.models';
import { SpinnerComponent } from "../../../../shared/spinner/spinner.component";

@Component({
  selector: 'app-conceptos',
  standalone: true,
  imports: [CommonModule,
    RouterOutlet,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatSlideToggleModule, NavComponent, MatMenuModule, SpinnerComponent],
  templateUrl: './conceptos.component.html',
  styleUrl: './conceptos.component.css'
})
export class ConceptosComponent {


  private _conceptoService = inject(ConceptoService);
  private _DataService = inject(DataService);
  private _router = inject(Router)
  public loginServices = inject(LoginService);
  private _toastr = inject(ToastrService)
  username: string | null = '';
  role: String | null = '';
  userLoginOn: boolean = false;
  filtroSeleccionado: string = '';
  title: string = 'Conceptos';
  totPcjeActivo: number | null = 0;
  conceptos: IConcepto[] = [];
  //filtro
  filter: string = '';
  state: string = 'ACT';
  //Paginador
  cantidadTotal: number = 0;
  cantidadPorPagina: number = 5;
  numeroDePagina: number = 0;
  opcionesDePaginado: number[] = [1, 5, 10, 25, 100];

  userLoginResponse: ILoginResponse = {
    token: '',
    username: '',
    role: ''
  }

  conceptoData: IConcepto = {
    conceptoId : null,
    nombre: null,
    porcentaje: null,
    activo : null,
    usuario: null
  };

  //responsive
  screenWidth: number | null = null;
  screenHeight: number | null = null;
  responsive: boolean = false;

  dataSource: MatTableDataSource<IConcepto> = new MatTableDataSource<IConcepto>([]);
  displayedColumns: string[] = ['nombre', 'porcentaje', 'activo', 'acciones'];
  isLoading: boolean = false;
  
  spinnerShow(): void {
    this.isLoading = true
  }
  
    spinnerHide(): void {
    this.isLoading = false
  }
  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.getScreenSize();
    this.isUserLogin();
    this.allConceptoInDataSourcePaginador(null);
    this._DataService.dataUpdated$.subscribe(() => {
      this.reloadData();
    })
  }

  seleccionarFiltro(filtro: string) {
    this.state = filtro
    this.reloadData();
  }

  private reloadData() {
    this.allConceptoInDataSourcePaginador(this.filter);
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filter = filterValue;
    this.allConceptoInDataSourcePaginador(filterValue);
  }

  cambiarPagina(event: PageEvent) {
    this.cantidadPorPagina = event.pageSize;
    this.numeroDePagina = event.pageIndex;
    this.allConceptoInDataSourcePaginador(this.filter);
  }

  addRegister() {
    this.newOrUpdate("Nuevo", null);
  }

  getTotPcjeAct(): number | null {
    return this.conceptos.map(c => c.porcentaje).reduce((acc, value) => acc! + value!, 0);
  }

  async eliminar(itemId: number) {

    if (window.confirm('¿Seguro que deseas desactivar este elemento?')) {
      this.spinnerShow(); 
      let response: IResponse = await this.softDelete(itemId, this.username!)

      if (response) {
        this.showSuccess(response.message, "Concepto")
        this.spinnerHide();
        this.reloadData();
      }
    }
  }

  async softDelete(id: number, username: string): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._conceptoService.softDeleteConcepto(id, username));
      return response;
    } catch (error) {
      console.error('Error softDelete concepto:', error);
      throw error;
    }
  }


  async restaurar(itemId: number) {

    if (window.confirm('¿Seguro que deseas restaurar este elemento?')) {
      
      const user: IUser = {
        id: null,
        username: this.username!
      }
      this.conceptoData.usuario = user;
      let response: IResponse = await this.activar(itemId, this.conceptoData)

      if (response) {
        this.showSuccess(response.message, "Concepto")
        this.reloadData();
      }
    }
  }

  async activar(id: number, concepto: IConcepto): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._conceptoService.updateActivo(id,concepto));
      return response;
    } catch (error) {
      console.error('Error softDelete concepto:', error);
      throw error;
    }
  }

  showSuccess(message: string, title: string) {
    this._toastr.success(message, title);
  }


  async getAllConceptosAct(username: string): Promise<IConcepto[]> {
    try {
      const conceptos: IConcepto[] =
        await firstValueFrom(this._conceptoService.getAllConceptosAct(username));
      return conceptos;
    } catch (error) {
      console.error('Error al obtener los conceptos:', error);
      throw error;
    }
  }

  editar(itemId: number) {
    this.newOrUpdate('Actualizar', itemId)
  }

  newOrUpdate(titulo: String, itemId: number | null): void {
    this.openForm(titulo, itemId);
  }

  openForm(titulo: String, itemId: number | null) {
    const dialogRef = this.dialog.open(ConceptoFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '400px',
        height: '350px',
        data: {
          titulo: titulo,
          id: itemId
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    });
  }

  async allConceptoInDataSourcePaginador(filter: string | null): Promise<void> {

    this._conceptoService.getConceptoPaginador
      (
        this.cantidadPorPagina,
        this.numeroDePagina,
        this.state, this.username!, filter
      )
      .subscribe((conceptos: IConceptos) => {
        this.dataSource.data = conceptos.elementos;
        this.cantidadTotal = conceptos.cantidadTotal;
      });
    this.conceptos = await this.getAllConceptosAct(this.username!)
    if (this.conceptos.length > 0) {
      this.totPcjeActivo = this.getTotPcjeAct();
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

  //responsive
  @HostListener('window:resize', ['$event'])
  getScreenSize(event?: any) {
    this.screenWidth = window.innerWidth;
    this.screenHeight = window.innerHeight;
    if (this.screenWidth <= 750) {
      this.responsive = true;

    }
  }
}
