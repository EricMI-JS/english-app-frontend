import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { 
    path: 'words', 
    loadChildren: () => import('./features/words/words.module').then(m => m.WordsModule)
  },
  { 
    path: 'quiz', 
    loadChildren: () => import('./features/quiz/quiz.module').then(m => m.QuizModule)
  },
  { 
    path: '', 
    redirectTo: '/words', 
    pathMatch: 'full' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
