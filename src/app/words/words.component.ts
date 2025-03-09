import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { WordService, Word } from '../services/word.service';
import { Subscription } from 'rxjs';

interface Example {
  text: string;
  expanded: boolean;
}

@Component({
  selector: 'app-words',
  templateUrl: './words.component.html',
  styleUrls: ['./words.component.scss']
})
export class WordsComponent implements OnInit, OnDestroy {
  words: Word[] = [];
  private subscription: Subscription | null = null;

  constructor(
    private router: Router,
    private wordService: WordService
  ) { }

  ngOnInit(): void {
    // Subscribe to the words observable to get updates
    this.subscription = this.wordService.words$.subscribe(words => {
      this.words = words;
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  onAddWord(): void {
    // Navigate to the word-form route
    this.router.navigate(['/words/add']);
  }
}
