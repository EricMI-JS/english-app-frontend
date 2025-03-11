import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  word: string;
  options: QuizOption[];
  correctOptionId: string;
}

export interface QuizResponse {
  questions: QuizQuestion[];
}

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private apiUrl = `${environment.apiUrl}/quiz`;

  constructor(private http: HttpClient) { }

  getQuizQuestions(): Observable<QuizResponse> {
    return this.http.get<QuizResponse>(this.apiUrl);
  }
} 