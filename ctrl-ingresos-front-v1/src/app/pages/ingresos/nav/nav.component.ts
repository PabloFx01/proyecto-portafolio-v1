import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterLink],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  private _router = inject(Router)

  logout() {
    throw new Error('Method not implemented.');
  }
  title = '';
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

}
