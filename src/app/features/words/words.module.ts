import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../shared/shared.module';
import { WordListComponent } from './pages/word-list/word-list.component';
import { WordFormComponent } from './pages/word-form/word-form.component';
import { WordsRoutingModule } from './words-routing.module';

@NgModule({
  declarations: [
    WordListComponent,
    WordFormComponent
  ],
  imports: [
    CommonModule,
    WordsRoutingModule,
    SharedModule
  ],
  providers: [
  ]
})
export class WordsModule { } 