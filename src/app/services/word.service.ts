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
  // BehaviorSubject para mantener el estado de las palabras
  private wordsSubject = new BehaviorSubject<Word[]>([]);
  
  // Observable público que los componentes pueden suscribirse
  public words$: Observable<Word[]> = this.wordsSubject.asObservable();

  constructor() { 
    // Inicializar con datos de ejemplo o cargar desde localStorage
    this.loadWords();
  }

  // Método para cargar palabras (desde localStorage o inicialmente vacío)
  private loadWords(): void {
    const savedWords = localStorage.getItem('words');
    if (savedWords) {
      this.wordsSubject.next(JSON.parse(savedWords));
    }
  }

  // Método para agregar una nueva palabra
  addWord(word: Word): void {
    const currentWords = this.wordsSubject.value;
    const updatedWords = [...currentWords, word];
    this.wordsSubject.next(updatedWords);
    this.saveWords(updatedWords);
  }

  // Método para eliminar una palabra
  deleteWord(index: number): void {
    const currentWords = this.wordsSubject.value;
    const updatedWords = currentWords.filter((_, i) => i !== index);
    this.wordsSubject.next(updatedWords);
    this.saveWords(updatedWords);
  }

  // Método para actualizar una palabra existente
  updateWord(index: number, updatedWord: Word): void {
    const currentWords = this.wordsSubject.value;
    const updatedWords = [...currentWords];
    updatedWords[index] = updatedWord;
    this.wordsSubject.next(updatedWords);
    this.saveWords(updatedWords);
  }

  // Método para guardar palabras en localStorage
  private saveWords(words: Word[]): void {
    localStorage.setItem('words', JSON.stringify(words));
  }
}
