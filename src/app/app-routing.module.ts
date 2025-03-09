import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WordsComponent } from './words/words.component';
import { WordFormComponent } from './words/word-form/word-form.component';
import { QuizComponent } from './quiz/quiz.component';

const routes: Routes = [
  { path: 'words', component: WordsComponent },
  { path: 'words/add', component: WordFormComponent },
  { path: 'quiz', component: QuizComponent },
  { path: '', redirectTo: '/words', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
