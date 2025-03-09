import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Word {
  word: string;
  definition: string;
  example: string;
}

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private wordsSubject = new BehaviorSubject<Word[]>([]);
  words$: Observable<Word[]> = this.wordsSubject.asObservable();

  constructor() { 
    // Initialize with any saved words (could be from localStorage or a backend)
    this.loadWords();
  }

  getWords(): Word[] {
    return this.wordsSubject.getValue();
  }

  addWord(word: Word): void {
    const currentWords = this.wordsSubject.getValue();
    this.wordsSubject.next([...currentWords, word]);
    
    // Save words (could be to localStorage or a backend)
    this.saveWords();
  }

  private loadWords(): void {
    // For now, we'll use localStorage. In a real app, this might be an API call
    const savedWords = localStorage.getItem('words');
    if (savedWords) {
      try {
        const words = JSON.parse(savedWords);
        this.wordsSubject.next(words);
      } catch (e) {
        console.error('Error loading words from storage', e);
      }
    }
  }

  private saveWords(): void {
    // For now, we'll use localStorage. In a real app, this might be an API call
    const currentWords = this.wordsSubject.getValue();
    localStorage.setItem('words', JSON.stringify(currentWords));
  }
}
