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

  /**
   * Obtiene un ejemplo de uso de una palabra usando la API Free Dictionary
   * @param word La palabra para buscar un ejemplo
   * @returns Observable con un ejemplo de uso de la palabra
   */
  getWordExample(word: string): Observable<string> {
    if (!word || word.trim() === '') {
      return of('');
    }

    return this.http.get<DictionaryResponse[]>(`${this.dictionaryApiUrl}/${encodeURIComponent(word)}`)
      .pipe(
        map(response => {
          if (response && response.length > 0 && response[0].meanings) {
            // Buscar en todas las definiciones de todos los significados para encontrar un ejemplo
            for (const meaning of response[0].meanings) {
              if (meaning.definitions) {
                for (const definition of meaning.definitions) {
                  if (definition.example) {
                    return definition.example;
                  }
                }
              }
            }
          }
          return '';
        }),
        catchError(error => {
          console.error('Error fetching example:', error);
          return of('');
        })
      );
  }

  /**
   * Obtiene tanto la definición como un ejemplo de uso de una palabra
   * @param word La palabra para buscar
   * @returns Observable con un objeto que contiene la definición y el ejemplo
   */
  getWordInfo(word: string): Observable<{definition: string, example: string}> {
    if (!word || word.trim() === '') {
      return of({definition: '', example: ''});
    }

    return this.http.get<DictionaryResponse[]>(`${this.dictionaryApiUrl}/${encodeURIComponent(word)}`)
      .pipe(
        map(response => {
          let definition = '';
          let example = '';
          
          if (response && response.length > 0 && response[0].meanings) {
            // Buscar la primera definición
            if (response[0].meanings.length > 0 && 
                response[0].meanings[0].definitions && 
                response[0].meanings[0].definitions.length > 0) {
              definition = response[0].meanings[0].definitions[0].definition || '';
            }
            
            // Buscar el primer ejemplo disponible
            for (const meaning of response[0].meanings) {
              if (meaning.definitions) {
                for (const def of meaning.definitions) {
                  if (def.example) {
                    example = def.example;
                    break;
                  }
                }
                if (example) break;
              }
            }
          }
          
          return {definition, example};
        }),
        catchError(error => {
          console.error('Error fetching word info:', error);
          return of({definition: '', example: ''});
        })
      );
  }
} 