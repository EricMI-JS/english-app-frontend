import { Component, OnInit, Input } from '@angular/core';
import { NavigationHistoryService } from '../../../services/navigation-history.service';

@Component({
  selector: 'app-back-button',
  templateUrl: './back-button.component.html',
  styleUrls: []
})
export class BackButtonComponent implements OnInit {
  @Input() fallbackUrl: string = '/';
  canGoBack: boolean = false;
  showButton: boolean = false;

  constructor(private navigationHistoryService: NavigationHistoryService) { }

  ngOnInit(): void {
    // Suscribirse al observable canGoBack
    this.navigationHistoryService.canGoBack$().subscribe(canGoBack => {
      this.canGoBack = canGoBack;
    });
    
    // Suscribirse al observable showBackButton
    this.navigationHistoryService.showBackButton$().subscribe(showBackButton => {
      this.showButton = showBackButton;
    });
  }

  /**
   * Navega hacia atrás en el historial o a la URL de respaldo si no hay historial
   */
  goBack(): void {
    if (!this.navigationHistoryService.goBack() && this.fallbackUrl) {
      // Si no se pudo navegar hacia atrás, usar la URL de respaldo
      window.location.href = this.fallbackUrl;
    }
  }
} 