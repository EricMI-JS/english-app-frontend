import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { WordsComponent } from './words/words.component';

const routes: Routes = [
  { path: 'words', component: WordsComponent },
  { path: 'dictionary', component: WordsComponent }, // Will be replaced with actual component when created
  { path: 'statistic', component: WordsComponent },  // Will be replaced with actual component when created
  { path: 'settings', component: WordsComponent },   // Will be replaced with actual component when created
  { path: '', redirectTo: '/words', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
