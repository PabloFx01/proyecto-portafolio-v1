import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { LoginService } from '../../services/login.service';

@Component({
  selector: 'app-nav-login',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './nav-login.component.html',
  styleUrl: './nav-login.component.css'
})
export class NavPrestamoComponent implements OnInit{

  ngOnInit(): void {
    this.isUserLogin();
  }
  private _router = inject(Router)
  private loginServices = inject(LoginService)

  title = 'LogIn';
  menuOption: String = '';
  userLoginOn: boolean = false;

  username: String | null = '';
  role: String | null = '';

  public isNavbarCollapsed = false;


  toggleNavbarCollapse() {
    console.log("se colapsa");
  }

  onOption(menuOption: string) {
    this.menuOption = menuOption;
  }

  irAlink(link: string) {
    this._router.navigateByUrl(`/${link}`);
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
    // this.menuOption = 'login';
    this.onOption("login");
    this._router.navigate(['/login']);
  }

}
