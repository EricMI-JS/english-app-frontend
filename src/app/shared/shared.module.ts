import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FabComponent } from './components/fab/fab.component';
import { IconsComponent } from './components/icons/icons.component';
import { BackButtonComponent } from './components/back-button/back-button.component';
import { SearchBarComponent } from './components/search-bar/search-bar.component';
import { PrimeNgModule } from './primeng.module';

@NgModule({
  declarations: [
    FabComponent,
    IconsComponent,
    BackButtonComponent,
    SearchBarComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule
  ],
  exports: [
    // Exporta los módulos que quieres compartir
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    PrimeNgModule,
    FabComponent,
    IconsComponent,
    BackButtonComponent,
    SearchBarComponent
  ]
})
export class SharedModule { } 