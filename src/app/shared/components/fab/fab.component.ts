import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-fab',
  templateUrl: './fab.component.html',
  styles: []
})
export class FabComponent {
  @Input() color: string = 'bg-blue-600 text-white';
  @Input() size: string = '14';
  @Input() position: string = 'bottom-right';
  @Input() bottom: number = 80; // Default position above mobile menu
  @Input() right: number = 20;
  @Output() onClick = new EventEmitter<void>();
}
