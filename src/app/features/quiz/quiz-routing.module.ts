import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { QuizComponent } from './pages/quiz/quiz.component';
import { QuizResultsComponent } from './pages/quiz-results/quiz-results.component';

const routes: Routes = [
  {
    path: '',
    component: QuizComponent
  },
  {
    path: 'results',
    component: QuizResultsComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QuizRoutingModule { } 