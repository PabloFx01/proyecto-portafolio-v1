import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { DashboardNavComponent } from "../dashboard-nav/dashboard-nav.component";
import { LoginService } from '../services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { OnUserFormComponent } from './onUser-form/onUser-form.component';
import { DataService } from '../shared/data.service';
import { OnResponsiveComponent } from './onResponsive-form/onResponsive-form.component';
import { ComponentType } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    MatCardModule,
    CommonModule,
    MatIconModule,
    DashboardNavComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private _router = inject(Router)
  userLoginOn: boolean = false;
  username: string | null = '';
  role: String | null = '';
  private loginServices = inject(LoginService);
  public dialog = inject(MatDialog)

  //responsive
  responsive: boolean = false;
  private _DataService = inject(DataService);

  ngOnInit(): void {
    this.isUserLogin();
    this.getScreenSize();
    if(!this.userLoginOn){
      this.username = null;
      this.role = null;
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

  irAlink(link: string, title: string) {
    if (this.userLoginOn) {
      console.log(link);
      this._router.navigateByUrl(`/${link}`);
    } else {
      this.openForm(link, title,OnUserFormComponent);
    }

  }

  openForm(link: string, title: string, componente: ComponentType<any>) {
    const dialogRef = this.dialog.open(componente,
      {
        disableClose: true,
        autoFocus: true,
        closeOnNavigation: false,
        position: { top: '30vh' },
        width: '300px',
        height: '300px',
        data: {
          link: link,
          title: title
        }
      });

    dialogRef.afterClosed().subscribe(result => {
      console.log(`Dialog result: ${result}`);
      if (result) {
        console.log("respuesta " + result.responsive)
        this.responsive = result.responsive;
      }
    });
  }

  getScreenSize(event?: any) {
    this._DataService.selectedUserContinue$.subscribe((valor: boolean) => {
      if (valor) {
        this.responsive = valor
      }
    })

    if (!this.responsive) {
      if (this.isMobile()) {
        this.responsive = true;
        this.openForm("", "", OnResponsiveComponent);
      }
    }

  }

  isMobile(): boolean {
    const userAgent = window.navigator.userAgent;
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);
  }

}

