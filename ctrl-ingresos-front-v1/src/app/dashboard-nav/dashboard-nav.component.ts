import { CommonModule, DOCUMENT } from '@angular/common';
import { Component, ElementRef, Inject, inject, OnInit, PLATFORM_ID, ViewChild } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { DataService } from '../shared/data.service';
import { LoginService } from '../services/login.service';

@Component({
  selector: 'app-dashboard-nav',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink, MatToolbarModule, MatButtonModule, MatIconModule],
  templateUrl: './dashboard-nav.component.html',
  styleUrl: './dashboard-nav.component.css'
})
export class DashboardNavComponent implements OnInit {

  title = 'Mi gestión financiera personal';
  menuOption: String = '';
  _dataServices = inject(DataService);
  userLoginOn: boolean = false;
  username: string | null = '';
  role: String | null = '';

  @ViewChild('miBoton') boton: ElementRef | undefined;
  public isNavbarCollapsed = false;

  constructor(@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID)
  private platformId: Object, @Inject(LoginService) private loginServices: LoginService,
    private router: Router) {

  }

  ngOnInit(): void {
    this.isUserLogin();
  }
  toggleNavbarCollapse() {
    this.isNavbarCollapsed = true;
    console.log("se colapsa");
  }

  onOption(menuOption: string) {
    this.menuOption = menuOption;
    if (this.isNavbarCollapsed) {
      this.boton!.nativeElement.click();
      this.isNavbarCollapsed = false;
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

  logout() {
    this.loginServices.logout();
    this.role = null;
    this.onOption("login");
    this.router.navigate(['/login']);

  }
  home() {
    // this.refrescarPagina();
  }

  refrescarPagina() { window.location.reload(); }

}
