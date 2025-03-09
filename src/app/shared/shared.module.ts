import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FabComponent } from './components/fab/fab.component';
import { IconsComponent } from './components/icons/icons.component';
import { BackButtonComponent } from './components/back-button/back-button.component';

@NgModule({
  declarations: [
    FabComponent,
    IconsComponent,
    BackButtonComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    // Exporta los módulos que quieres compartir
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FabComponent,
    IconsComponent,
    BackButtonComponent
  ]
})
export class SharedModule { } 