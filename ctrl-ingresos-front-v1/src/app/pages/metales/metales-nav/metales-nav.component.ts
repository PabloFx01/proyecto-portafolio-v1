import { CommonModule, DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, ElementRef, Inject, OnInit, PLATFORM_ID, ViewChild, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginService } from '../../../services/login.service';
import { DataService } from '../../../shared/data.service';


@Component({
  selector: 'metales-nav-app',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './metales-nav.component.html',
  styleUrl: './metales-nav.component.css'
})
export class MetalesNavComponent implements OnInit {
  title = 'MetalesApp';
  menuOption: String = '';
  userLoginOn: boolean = false;
  _dataServices = inject(DataService);
  private _router = inject(Router)

  username: String | null = '';
  role: String | null = '';

  @ViewChild('miBoton') boton: ElementRef | undefined;
  public isNavbarCollapsed = false;

  constructor(@Inject(DOCUMENT) private document: Document, @Inject(PLATFORM_ID) private platformId: Object, @Inject(LoginService) private loginServices: LoginService, private router: Router) {

  }

  irAlink(link: string) {
    this._router.navigateByUrl(`/${link}`);
  }

  toggleNavbarCollapse() {
    this.isNavbarCollapsed = true;
   }

  ngOnInit(): void {
    this.isUserLogin();
  }

  onOption(menuOption: string) {
    this.menuOption = menuOption;
    if (this.isNavbarCollapsed) {
      this.boton!.nativeElement.click();
      this.isNavbarCollapsed = false;
    }
  }

  logout() {
    this.loginServices.logout();
    // this.menuOption = 'login';
    this.onOption("login");
    this.router.navigate(['/login']);
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
