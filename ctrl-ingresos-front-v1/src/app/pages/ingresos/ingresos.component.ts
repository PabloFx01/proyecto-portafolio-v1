import { Component, signal, ChangeDetectorRef, inject, Inject, OnInit, AfterViewInit, ViewChild } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { FullCalendarModule, FullCalendarComponent } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg, EventClickArg, EventApi, EventInput } from '@fullcalendar/core';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { INITIAL_EVENTS } from './event-utils';
import esLocale from '@fullcalendar/core/locales/es';
import { IIngreso } from '../../models/ingresos/ingreso.models';
import { firstValueFrom } from 'rxjs';
import { IngresoService } from '../../services/ingresos/ingreso.service';
import { MatDialog } from '@angular/material/dialog';
import { IngresoFormComponent } from './form/ingreso-form/ingreso-form.component';
import { NavComponent } from "./nav/nav.component";
import { LoginService } from '../../services/login.service';
import { DataService } from '../../shared/data.service';

@Component({
  selector: 'app-ingresos',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FullCalendarModule, NavComponent],
  templateUrl: './ingresos.component.html',
  styleUrl: './ingresos.component.css'
})
export class IngresosComponent implements OnInit {

  calendarOptions: any;
  eventsInitial: EventInput[] = [];
  private ingresos: IIngreso[] = [];
  private _apiIngresoService = inject(IngresoService);
  private _router = inject(Router)
  calendarVisible = signal(true);
  private loginServices = inject(LoginService)
  userLoginOn: boolean = false;
  _dataServices = inject(DataService);

  username: String | null = '';
  role: String | null = '';
  constructor(private changeDetector: ChangeDetectorRef, @Inject(DOCUMENT) private document: Document, public dialog: MatDialog) {
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
    this.nuevoIngreso(null, 'Nuevo', selectInfo.start);
  }

  handleEventClick(clickInfo: EventClickArg) {
    this.nuevoIngreso(parseInt(clickInfo.event.id), 'Actualizar', clickInfo.event.start)
  }

  handleEvents(events: EventApi[]) {
    this.currentEvents.set(events);
    this.changeDetector.detectChanges(); // workaround for pressionChangedAfterItHasBeenCheckedError
  }

  async getAllIngresos(): Promise<IIngreso[]> {
    try {
      const ingresos: IIngreso[] =
        await firstValueFrom(this._apiIngresoService.getAllIngresosByUser(this.username!))
      return ingresos;
    } catch (error) {
      console.error('Error al buscar ingresos:', error);
      throw error;
    }
  }



  async iniciar(): Promise<void> {
    this.ingresos = await this.getAllIngresos();
    this.eventsInitial = [];

    this.calendarOptions.update((options: any) => ({
      ...options,
      events: this.eventsInitial,

    }));

    if (this.ingresos.length > 0) {

      this.eventsInitial = this.ingresos.map((ingreso) => {
        return {
          id: String(ingreso.id),
          title: ingreso.comentario,
          start: ingreso.fechaDeposito
          //end: new Date(ingreso.fechaDeposito) // Por ejemplo, +1 hora
        };
      });


      this.calendarOptions.update((options: any) => ({
        ...options,
        events: this.eventsInitial,

      }));
    }
  }

  nuevoIngreso(idItem: number | null, title: string, dateCalendar: Date | null) {
    this.openForm(title, idItem, dateCalendar);

  }

  openForm(titulo: String, idItem: number | null, dateCalendar: Date | null) {
    const dialogRef = this.dialog.open(IngresoFormComponent,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30px' },
        width: '600px',
        height: '575px',
        data: {
          titulo: titulo,
          idItem: idItem,
          dateCalendar: dateCalendar
        }

      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
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
