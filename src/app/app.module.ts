import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { WordsComponent } from './words/words.component';
import { MobileMenuComponent } from './shared/mobile-menu/mobile-menu.component';
import { HeaderComponent } from './shared/header/header.component';
import { FabComponent } from './shared/fab/fab.component';
import { IconsComponent } from './shared/icons/icons.component';
import { WordFormComponent } from './words/word-form/word-form.component';

@NgModule({
  declarations: [
    AppComponent,
    WordsComponent,
    MobileMenuComponent,
    HeaderComponent,
    FabComponent,
    IconsComponent,
    WordFormComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
