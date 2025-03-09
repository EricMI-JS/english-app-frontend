import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { QuizResultsComponent } from './pages/quiz-results/quiz-results.component';
import { QuizComponent } from './pages/quiz/quiz.component';
import { QuizRoutingModule } from './quiz-routing.module';

@NgModule({
  declarations: [
    QuizComponent,
    QuizResultsComponent
  ],
  imports: [
    CommonModule,
    QuizRoutingModule,
    SharedModule
  ],
  providers: [
  ]
})
export class QuizModule { } 