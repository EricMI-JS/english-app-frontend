import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.scss']
})
export class SearchBarComponent implements OnInit {
  @Input() placeholder: string = 'Search...';
  @Input() debounceTime: number = 300;
  @Output() search = new EventEmitter<string>();
  
  searchTerm: string = '';
  private searchTerms = new Subject<string>();
  
  ngOnInit(): void {
    this.searchTerms.pipe(
      // Wait for the specified debounce time after each keystroke
      debounceTime(this.debounceTime),
      // Ignore if the search term is the same as the previous one
      distinctUntilChanged()
    ).subscribe(term => {
      this.search.emit(term);
    });
  }
  
  onSearch(term: string): void {
    this.searchTerms.next(term);
  }
  
  clearSearch(): void {
    this.searchTerm = '';
    this.searchTerms.next('');
  }
} 