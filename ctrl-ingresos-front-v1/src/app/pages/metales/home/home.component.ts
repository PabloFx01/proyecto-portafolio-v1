import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { LoginService } from '../../../services/login.service';
import { DataService } from '../../../shared/data.service';
import { MetalesNavComponent } from "../metales-nav/metales-nav.component";
import { RouterOutlet } from '@angular/router';




@Component({
    selector: 'app-home',
    standalone: true,
    templateUrl: './home.component.html',
    styleUrl: './home.component.css',
    imports: [CommonModule, MetalesNavComponent,RouterOutlet]
})
export class HomeComponent implements OnInit{

    _dataServices = inject(DataService);
    _loginServices = inject(LoginService);
    username: String | null = null;
    userLoginOn: boolean = false;

    ngOnInit(): void {
       this.isUserLogin();
    }

    isUserLogin() {
        this._loginServices.currentUserLoginOn.subscribe(
          {
            next: (userLoginOn) => {
              this.userLoginOn = userLoginOn;
            }
          }
        )    
       
        this._loginServices.currentUsername.subscribe(
          {
            next: (username) => {
              this.username = username;
            }
          }
        )   

      }
}
