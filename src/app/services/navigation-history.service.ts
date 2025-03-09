import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Location } from '@angular/common';
import { filter } from 'rxjs/operators';
import { BehaviorSubject, Observable } from 'rxjs';

interface NavigationHistoryItem {
  url: string;
  title: string;
}

@Injectable({
  providedIn: 'root'
})
export class NavigationHistoryService {
  private historyStack: NavigationHistoryItem[] = [];
  private currentIndex = -1;
  private maxHistoryLength = 20; // Limitar el tamaño del historial
  
  // Observable para saber si se puede navegar hacia atrás
  private canGoBackSubject = new BehaviorSubject<boolean>(false);
  
  // Observable para saber si se debe mostrar el botón de retroceso
  private showBackButtonSubject = new BehaviorSubject<boolean>(false);
  
  // Rutas principales (las que aparecen en el menú)
  private mainRoutes: string[] = ['/words', '/quiz', '/profile'];
  
  constructor(
    private router: Router,
    private location: Location
  ) {
    // Suscribirse a los eventos de navegación
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.addToHistory(event.urlAfterRedirects);
      this.updateShowBackButton(event.urlAfterRedirects);
    });
  }
  
  /**
   * Añade una nueva entrada al historial
   * @param url URL a añadir al historial
   * @param title Título de la página (opcional)
   */
  addToHistory(url: string, title?: string): void {
    // Si estamos navegando a la misma URL, no hacemos nada
    if (this.currentIndex >= 0 && this.historyStack[this.currentIndex]?.url === url) {
      return;
    }
    
    // Si hemos navegado hacia atrás y luego a una nueva ruta,
    // eliminamos el historial futuro
    if (this.currentIndex < this.historyStack.length - 1) {
      this.historyStack = this.historyStack.slice(0, this.currentIndex + 1);
    }
    
    // Añadir la nueva entrada al historial
    this.historyStack.push({
      url,
      title: title || ''
    });
    
    // Si el historial es demasiado largo, eliminamos las entradas más antiguas
    if (this.historyStack.length > this.maxHistoryLength) {
      this.historyStack.shift();
    } else {
      this.currentIndex++;
    }
    
    // Actualizar el estado de canGoBack
    this.updateCanGoBack();
  }
  
  /**
   * Establece el título de la página actual en el historial
   * @param title Título de la página
   */
  setCurrentPageTitle(title: string): void {
    if (this.currentIndex >= 0 && this.currentIndex < this.historyStack.length) {
      this.historyStack[this.currentIndex].title = title;
    }
  }
  
  /**
   * Navega hacia atrás en el historial
   * @returns true si se pudo navegar hacia atrás, false en caso contrario
   */
  goBack(): boolean {
    if (this.canGoBack()) {
      this.currentIndex--;
      const previousPage = this.historyStack[this.currentIndex];
      this.router.navigateByUrl(previousPage.url);
      this.updateCanGoBack();
      return true;
    }
    return false;
  }
  
  /**
   * Comprueba si se puede navegar hacia atrás
   * @returns true si hay páginas anteriores en el historial
   */
  canGoBack(): boolean {
    return this.currentIndex > 0;
  }
  
  /**
   * Obtiene un Observable que indica si se puede navegar hacia atrás
   */
  canGoBack$(): Observable<boolean> {
    return this.canGoBackSubject.asObservable();
  }
  
  /**
   * Actualiza el estado de canGoBack
   */
  private updateCanGoBack(): void {
    this.canGoBackSubject.next(this.canGoBack());
  }
  
  /**
   * Comprueba si la URL actual es una ruta principal
   * @param url URL a comprobar
   * @returns true si la URL es una ruta principal
   */
  isMainRoute(url: string): boolean {
    // Comprobar si la URL coincide exactamente con alguna de las rutas principales
    return this.mainRoutes.some(route => {
      // Eliminar parámetros de consulta si los hay
      const cleanUrl = url.split('?')[0];
      return cleanUrl === route;
    });
  }
  
  /**
   * Actualiza el estado de showBackButton
   * @param url URL actual
   */
  private updateShowBackButton(url: string): void {
    // Solo mostrar el botón de retroceso si no estamos en una ruta principal
    const shouldShow = !this.isMainRoute(url) && this.canGoBack();
    this.showBackButtonSubject.next(shouldShow);
  }
  
  /**
   * Obtiene un Observable que indica si se debe mostrar el botón de retroceso
   */
  showBackButton$(): Observable<boolean> {
    return this.showBackButtonSubject.asObservable();
  }
  
  /**
   * Obtiene la URL anterior en el historial
   * @returns La URL anterior o null si no hay historial
   */
  getPreviousUrl(): string | null {
    if (this.currentIndex > 0) {
      return this.historyStack[this.currentIndex - 1].url;
    }
    return null;
  }
  
  /**
   * Obtiene el título de la página anterior
   * @returns El título de la página anterior o null si no hay historial
   */
  getPreviousTitle(): string | null {
    if (this.currentIndex > 0) {
      return this.historyStack[this.currentIndex - 1].title;
    }
    return null;
  }
} 