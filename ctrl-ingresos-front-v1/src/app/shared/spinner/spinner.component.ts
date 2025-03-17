import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SpinnerService } from '../../services/metales/spinner.service';


@Component({
  selector: 'app-spinner',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './spinner.component.html',
  styleUrl: './spinner.component.css'
})
export class SpinnerComponent  {

  private _spinnerService = Inject(SpinnerService);
  isLoading$ = this._spinnerService.isLoading$;

}
