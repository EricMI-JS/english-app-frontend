import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavigationHistoryService } from './navigation-history.service';

@Injectable({
  providedIn: 'root'
})
export class PageTitleService {
  private pageTitleSubject = new BehaviorSubject<string>('English App');
  
  constructor(private navigationHistoryService: NavigationHistoryService) { }
  
  /**
   * Obtiene el título de la página actual como Observable
   */
  getPageTitle(): Observable<string> {
    return this.pageTitleSubject.asObservable();
  }
  
  /**
   * Establece un nuevo título para la página
   * @param title El nuevo título de la página
   */
  setPageTitle(title: string): void {
    this.pageTitleSubject.next(title);
    // Actualizar el título en el historial de navegación
    this.navigationHistoryService.setCurrentPageTitle(title);
  }
  
  /**
   * Obtiene el valor actual del título de la página
   */
  getCurrentPageTitle(): string {
    return this.pageTitleSubject.getValue();
  }
} 