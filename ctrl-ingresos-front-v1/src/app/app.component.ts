import { Component  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavComponent } from "./pages/ingresos/nav/nav.component";
import { DashboardComponent } from "./dashboard/dashboard.component";
import { DashboardNavComponent } from "./dashboard-nav/dashboard-nav.component";


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [RouterOutlet, CommonModule, NavComponent, DashboardComponent, DashboardNavComponent]
})
export class AppComponent {

}
