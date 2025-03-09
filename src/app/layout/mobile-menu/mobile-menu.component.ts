import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-mobile-menu',
  templateUrl: './mobile-menu.component.html',
  styles: []
})
export class MobileMenuComponent implements OnInit {
  constructor(public router: Router) { }

  ngOnInit(): void {
    // No need to track active tab anymore as RouterLinkActive handles it
  }
}
