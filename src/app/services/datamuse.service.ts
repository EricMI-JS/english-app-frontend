import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface DatamuseWord {
  word: string;
  score: number;
  tags?: string[];
}

export interface DictionaryResponse {
  word: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example?: string;
    }[];
  }[];
}

@Injectable({
  providedIn: 'root'
})
export class DatamuseService {
  private baseUrl = 'https://api.datamuse.com/words';
  private dictionaryApiUrl = 'https://api.dictionaryapi.dev/api/v2/entries/en';

  constructor(private http: HttpClient) { }

  /**
   * Busca palabras que comienzan con el prefijo dado
   * @param prefix El prefijo para buscar palabras
   * @returns Observable con un array de palabras sugeridas
   */
  searchWordsByPrefix(prefix: string): Observable<string[]> {
    if (!prefix || prefix.trim() === '') {
      return of([]);
    }

    const params = {
      sp: `${prefix}*`,
      max: 10
    };

    return this.http.get<DatamuseWord[]>(this.baseUrl, { params })
      .pipe(
        map(response => response.map(item => item.word))
      );
  }

  /**
   * Obtiene la definición de una palabra usando la API Free Dictionary
   * @param word La palabra para buscar su definición
   * @returns Observable con la definición de la palabra
   */
  getWordDefinition(word: string): Observable<string> {
    if (!word || word.trim() === '') {
      return of('');
    }

    return this.http.get<DictionaryResponse[]>(`${this.dictionaryApiUrl}/${encodeURIComponent(word)}`)
      .pipe(
        map(response => {
          if (response && response.length > 0 && 
              response[0].meanings && response[0].meanings.length > 0 && 
              response[0].meanings[0].definitions && response[0].meanings[0].definitions.length > 0) {
            return response[0].meanings[0].definitions[0].definition;
          }
          return '';
        }),
        catchError(error => {
          console.error('Error fetching definition:', error);
          return of('');
        })
      );
  }
} 