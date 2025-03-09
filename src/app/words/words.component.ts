import { Component, OnInit } from '@angular/core';

interface Example {
  text: string;
  expanded: boolean;
}

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.scss']
})
export class WordsComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
  
  onAddWord(): void {
    // Handle adding a new word
    console.log('Add word button clicked');
    // You can implement your logic here, such as:
    // - Opening a dialog
    // - Navigating to a form
    // - Showing a popup
    alert('Add new word functionality will be implemented here');
  }
}
