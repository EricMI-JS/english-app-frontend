import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importaciones de PrimeNG
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TableModule } from 'primeng/table';
import { DialogModule } from 'primeng/dialog';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { CardModule } from 'primeng/card';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { RadioButtonModule } from 'primeng/radiobutton';
import { MenuModule } from 'primeng/menu';
import { PanelModule } from 'primeng/panel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    CardModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    RadioButtonModule,
    MenuModule,
    PanelModule,
    ProgressSpinnerModule,
    MessagesModule,
    MessageModule,
    AutoCompleteModule
  ],
  exports: [
    ButtonModule,
    InputTextModule,
    InputTextareaModule,
    TableModule,
    DialogModule,
    ConfirmDialogModule,
    ToastModule,
    CardModule,
    DropdownModule,
    CalendarModule,
    CheckboxModule,
    RadioButtonModule,
    MenuModule,
    PanelModule,
    ProgressSpinnerModule,
    MessagesModule,
    MessageModule,
    AutoCompleteModule
  ],
  providers: [
    MessageService,
    ConfirmationService
  ]
})
export class PrimeNgModule { } 