import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
  private apiUrl = 'http://localhost:3000/api/quiz';

  constructor(private http: HttpClient) { }

  getQuizQuestions(): Observable<QuizResponse> {
    return this.http.get<QuizResponse>(this.apiUrl);
  }
} 