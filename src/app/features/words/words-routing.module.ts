import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WordListComponent } from './pages/word-list/word-list.component';
import { WordFormComponent } from './pages/word-form/word-form.component';

const routes: Routes = [
  {
    path: '',
    component: WordListComponent
  },
  {
    path: 'add',
    component: WordFormComponent
  },
  {
    path: 'edit/:id',
    component: WordFormComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WordsRoutingModule { } 