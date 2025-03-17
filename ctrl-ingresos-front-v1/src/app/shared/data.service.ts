import { Injectable } from "@angular/core";
import { BehaviorSubject, Subject } from "rxjs";
import { ILoginResponse } from "../models/login.models";
import { MetalId } from "../models/metales/metal-compra.models";
import { DetalleCompraId } from "../models/metales/compra.models";
import { DetalleVentaId } from "../models/metales/venta.models";
import { DetalleTicketId } from "../models/metales/ticket.models";
import { MetalVentaId } from "../models/metales/metal-venta.models";

@Injectable({
  providedIn: 'root'
})
export class DataService {
  dataUpdated$: Subject<void> = new Subject<void>();
  private selectedDIngresoIdSubject = new BehaviorSubject<any | null>(null);
  private userLoginDataSubject = new BehaviorSubject<any | null>((null));

  private selectedUserContinueSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  //----------------------------metalesApp--------------------------------------*/
  private selectedItemIdSubject = new BehaviorSubject<string | null>(null);
  private selectedMetalCompraItemIdSubject = new BehaviorSubject<any | null>(null);
  private selectedCompraItemIdSubject = new BehaviorSubject<any | null>(null);
  private selectedDetalleCompraItemIdSubject = new BehaviorSubject<any | null>(null);
  private selectedDetalleCompraPrecioSubject = new BehaviorSubject<any | null>(null);
  private selectedDetalleCompraPesoSubject = new BehaviorSubject<any | null>(null);
  private selectedVentaItemIdSubject = new BehaviorSubject<any | null>(null);
  private selectedDetalleVentaItemIdSubject = new BehaviorSubject<any | null>(null);
  private selectedTicketItemIdSubject = new BehaviorSubject<any | null>(null);
  private selectedDetalleTicketItemIdSubject = new BehaviorSubject<any | null>(null);
  private selectedMetalVentaItemIdSubject = new BehaviorSubject<any | null>(null);

  selectedItemId$ = this.selectedItemIdSubject.asObservable();
  selectedMetalCompraItemId$ = this.selectedMetalCompraItemIdSubject;
  selectedCompraItemId$ = this.selectedCompraItemIdSubject.asObservable();
  selectedDetalleCompraItemId$ = this.selectedDetalleCompraItemIdSubject;
  selectedDetalleCompraPrecio$ = this.selectedDetalleCompraPrecioSubject;
  selectedDetalleCompraPeso$ = this.selectedDetalleCompraPesoSubject;
  selectedVentaItemId$ = this.selectedVentaItemIdSubject.asObservable();
  selectedDetalleVentaItemId$ = this.selectedDetalleVentaItemIdSubject.asObservable();
  selectedTicketItemId$ = this.selectedTicketItemIdSubject.asObservable();
  selectedDetalleTicketItemId$ = this.selectedDetalleTicketItemIdSubject;
  selectedMetalVentaItemId$ = this.selectedMetalVentaItemIdSubject;
  selectedUserContinue$ = this.selectedUserContinueSubject;

  setSelectedCompraItemId(id: number) {
    this.selectedCompraItemIdSubject.next(id);
  }

  setSelectedItemId(id: string) {
    this.selectedItemIdSubject.next(id);
  }

  setSelectedMetalCompraItemId(id: MetalId) {
    this.selectedMetalCompraItemIdSubject.next(id);
  }
  setSelectedDetalleCompraItemId(id: DetalleCompraId) {
    this.selectedDetalleCompraItemIdSubject.next(id);
  }

  setSelectedDetalleCompraPrecio(precio: number) {
    this.selectedDetalleCompraItemIdSubject.next(precio);
  }
  setSelectedDetalleCompraPeso(peso: number) {
    this.selectedDetalleCompraItemIdSubject.next(peso);
  }

  setSelectedDetalleVentaItemId(id: DetalleVentaId) {
    this.selectedDetalleVentaItemIdSubject.next(id);
  }


  setSelectedVentaItemId(id: number) {
    this.selectedVentaItemIdSubject.next(id);
  }

  setSelectedDetalleTicketItemId(id: DetalleTicketId) {
    this.selectedDetalleTicketItemIdSubject.next(id);
  }

  setSelectedTicketItemId(id: number) {
    this.selectedTicketItemIdSubject.next(id);
  }

  setSelectedMetalVentaItemId(id: MetalVentaId) {
    this.selectedMetalVentaItemIdSubject.next(id);
  }


  setSelectedUserContinue(continuar: boolean) {
    this.selectedUserContinue$.next(continuar);
  }

  /*---------------------------------------------------------------------------*/
  selectedDIngresoId$ = this.selectedDIngresoIdSubject.asObservable()
  userLoginData$ = this.userLoginDataSubject;
  setselectedDIngresoId(id: number) {
    this.selectedDIngresoIdSubject.next(id);
  }
  setUserLoginData(loginData: ILoginResponse) {
    this.userLoginDataSubject.next(loginData);
  }

  unUserLoginData() {
    this.userLoginDataSubject.next(false);
  }

}