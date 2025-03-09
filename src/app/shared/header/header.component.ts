import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: []
})
export class HeaderComponent implements OnInit {
  activeTab: string = 'learn'; // Default active tab

  constructor(private router: Router) { }

  ngOnInit(): void {
    // Update active tab based on current route
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      const url = event.url;
      if (url.includes('words')) {
        this.activeTab = 'learn';
      } else if (url.includes('dictionary')) {
        this.activeTab = 'dictionary';
      } else if (url.includes('statistic')) {
        this.activeTab = 'statistic';
      } else if (url.includes('settings')) {
        this.activeTab = 'settings';
      }
    });
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
    
    // Navigate to the corresponding route
    switch (tab) {
      case 'learn':
        this.router.navigate(['/words']);
        break;
      case 'dictionary':
        this.router.navigate(['/dictionary']);
        break;
      case 'statistic':
        this.router.navigate(['/statistic']);
        break;
      case 'settings':
        this.router.navigate(['/settings']);
        break;
    }
  }
}
