import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface Word {
  id?: string;
  word: string;
  definition: string;
  exampleSentence: string;
  createdAt?: Date;
  updatedAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class WordService {
  private apiUrl = `${environment.apiUrl}/words`;
  
  // BehaviorSubject para mantener el estado de las palabras
  private wordsSubject = new BehaviorSubject<Word[]>([]);
  
  // Observable público que los componentes pueden suscribirse
  public words$: Observable<Word[]> = this.wordsSubject.asObservable();

  constructor(private http: HttpClient) { 
    // Cargar palabras al inicializar el servicio
    this.loadWords();
  }

  // Método para cargar todas las palabras desde la API
  loadWords(): void {
    this.http.get<Word[]>(this.apiUrl)
      .pipe(
        catchError(this.handleError)
      )
      .subscribe(words => {
        this.wordsSubject.next(words);
      });
  }

  // Método para obtener todas las palabras
  getAllWords(): Observable<Word[]> {
    return this.http.get<Word[]>(this.apiUrl)
      .pipe(
        tap(words => this.wordsSubject.next(words)),
        catchError(this.handleError)
      );
  }

  // Método para buscar palabras
  searchWords(query: string): Observable<Word[]> {
    return this.http.get<Word[]>(`${this.apiUrl}/search?q=${query}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para obtener una palabra por su ID
  getWordById(id: string): Observable<Word> {
    return this.http.get<Word>(`${this.apiUrl}/${id}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  // Método para agregar una nueva palabra
  addWord(word: Word): Observable<Word> {
    return this.http.post<Word>(this.apiUrl, word)
      .pipe(
        tap(newWord => {
          const currentWords = this.wordsSubject.value;
          this.wordsSubject.next([...currentWords, newWord]);
        }),
        catchError(this.handleError)
      );
  }

  // Método para eliminar una palabra
  deleteWord(id: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`)
      .pipe(
        tap(() => {
          const currentWords = this.wordsSubject.value;
          const updatedWords = currentWords.filter(word => word.id !== id);
          this.wordsSubject.next(updatedWords);
        }),
        catchError(this.handleError)
      );
  }

  // Método para actualizar una palabra existente
  updateWord(id: string, updatedWord: Word): Observable<Word> {
    return this.http.put<Word>(`${this.apiUrl}/${id}`, updatedWord)
      .pipe(
        tap(word => {
          const currentWords = this.wordsSubject.value;
          const index = currentWords.findIndex(w => w.id === id);
          if (index !== -1) {
            const updatedWords = [...currentWords];
            updatedWords[index] = word;
            this.wordsSubject.next(updatedWords);
          }
        }),
        catchError(this.handleError)
      );
  }

  // Manejador de errores
  private handleError(error: any) {
    console.error('Error en la operación de API:', error);
    return throwError(() => error);
  }
}
