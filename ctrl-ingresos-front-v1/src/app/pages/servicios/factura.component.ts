import { Component, signal, ChangeDetectorRef, inject, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/core';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import esLocale from '@fullcalendar/core/locales/es';
import { IIngreso } from '../../models/ingresos/ingreso.models';
import { firstValueFrom } from 'rxjs';
import { IngresoService } from '../../services/ingresos/ingreso.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginService } from '../../services/login.service';
import { DataService } from '../../shared/data.service';
import { NavServiciosComponent } from "./nav/nav-servicios.component";
import { ServicioService } from '../../services/servicios/servicio.service';
import { INITIAL_EVENTS } from '../ingresos/event-utils';
import { IServicio } from '../../models/servicios/servicio.models';
import { IResponse } from '../../models/response.models';
import { DialogServicioComponent } from './dialog-servicio/dialog-servicio.component';
@Component({
  selector: 'app-facturacion',
  standalone: true,
  imports: [
    NavServiciosComponent,
    RouterOutlet,
    CommonModule,
    FullCalendarModule],
  templateUrl: './factura.component.html',
  styleUrl: './factura.component.css'
})
export class FacturaComponent {
  calendarOptions: any;
  eventsInitial: EventInput[] = [];
  private servicios: IServicio[] = [];
  private _servicioService = inject(ServicioService);
  private _router = inject(Router)
  calendarVisible = signal(true);
  private loginServices = inject(LoginService)
  userLoginOn: boolean = false;
  _dataServices = inject(DataService);
  title: string = 'Calendario de servicios';
  username: string | null = '';
  role: String | null = '';
  constructor(private changeDetector: ChangeDetectorRef,
    @Inject(DOCUMENT) private document: Document,
    public dialog: MatDialog) {
  }

  ngOnInit(): void {
    this.isUserLogin();
    this.calendarOptions = signal<CalendarOptions>({
      plugins: [
        interactionPlugin,
        dayGridPlugin,
        timeGridPlugin,
        listPlugin,
      ],
      //dateClick: (arg) => this.handleDateClick(arg),
      locale: esLocale,
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        // right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
        right: 'dayGridMonth,listWeek'
      },
      initialView: 'dayGridMonth',
      initialEvents: INITIAL_EVENTS, // alternatively, use the `events` setting to fetch from a feed
      weekends: true,
      editable: false,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      select: this.handleDateSelect.bind(this),
      eventClick: this.handleEventClick.bind(this),
      eventsSet: this.handleEvents.bind(this)
      /* you can update a remote database when these fire:
      eventAdd:
      eventChange:
      eventRemove:
      */
    });

    this.iniciar();



  }

  // handleDateClick(arg: DateClickArg) {
  //   alert('date click! ' + arg.dateStr)
  // }

  currentEvents = signal<EventApi[]>([]);

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


  handleCalendarToggle() {
    this.calendarVisible.update((bool) => !bool);
  }

  handleWeekendsToggle() {
    this.calendarOptions.update((options: { weekends: any; }) => ({
      ...options,
      weekends: !options.weekends,

    }));
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    // this.vistaPrevia(null, 'Servicio', selectInfo.start);

  }

  handleEventClick(clickInfo: EventClickArg) {
    this.vistaPrevia(parseInt(clickInfo.event.id));
    // if (confirm(`Are you sure you want to delete the event '${clickInfo.event.title}'`)) {
    //   clickInfo.event.remove();
    // }
  }

  handleEvents(events: EventApi[]) {
    
    this.currentEvents.set(events);
    this.currentEvents().forEach(
      event =>{
          console.log("de eventos :" +event.end);
           
      }
    )
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  async getAllServicios(): Promise<IServicio[]> {
    try {
      const servicio: IServicio[] =
        await firstValueFrom(this._servicioService.getAllServiciosAct(this.username!))
      return servicio;
    } catch (error) {
      console.error('Error al buscar servicios:', error);
      throw error;
    }
  }

  async updateAllServicios(): Promise<IResponse> {
    try {
      const response: IResponse =
        await firstValueFrom(this._servicioService.updateAllServicios(this.username!))
      return response;
    } catch (error) {
      console.error('Error al actualizar todos los servicios:', error);
      throw error;
    }
  }


  async iniciar(): Promise<void> {
    let response = await this.updateAllServicios();
    if (response) {
      this.servicios = await this.getAllServicios();
      if (this.servicios.length > 0) {
        this.eventsInitial = this.servicios.map((servicio) => {
          return {
            id: String(servicio.id),
            title: servicio.nombre!,
            // start: new Date(this.getShortDate(servicio.fechaIniVto!))
            start: servicio.fechaIniVto!,
            //end: new Date(ingreso.fechaDeposito) // Por ejemplo, +1 hora
          };
        });


        this.calendarOptions.update((options: any) => ({
          ...options,
          events: this.eventsInitial,

        }));
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

  // nuevoIngreso(idItem: number | null, title: string, dateCalendar: Date | null) {
  //   this.openForm(title, idItem, dateCalendar);

  // }

  vistaPrevia(idItem: number | string |  null) {
    this.openForm(Number(idItem));

  }
  openForm(idItem: number | null) {
    const dialogRef = this.dialog.open(DialogServicioComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '600px',
        height: '575px',
        data: {
          idItem: idItem
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      this.reloadData();
    });
  }
  reloadData() {
    this.iniciar();
  }

  irAlink(link: string) {
    this._router.navigateByUrl(`/${link}`);
  }
}
