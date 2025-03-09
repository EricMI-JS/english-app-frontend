import { Component, OnInit } from '@angular/core';

interface Example {
  text: string;
  expanded: boolean;
}

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: []
})
export class WordsComponent implements OnInit {
  constructor() { }

  ngOnInit(): void {
  }
}
