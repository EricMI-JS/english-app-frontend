import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WordService, Word } from '../../../../services/word.service';
import { PageTitleService } from '../../../../services/page-title.service';
import { NavigationHistoryService } from '../../../../services/navigation-history.service';

interface WordForm {
  word: string;
  definition: string;
  example: string;
}

@Component({
  selector: 'app-word-form',
  templateUrl: './word-form.component.html',
  styleUrls: ['./word-form.component.scss']
})
export class WordFormComponent implements OnInit {
  wordForm: Word = {
    word: '',
    definition: '',
    example: ''
  };

  constructor(
    private router: Router,
    private wordService: WordService,
    private pageTitleService: PageTitleService,
    private navigationHistoryService: NavigationHistoryService
  ) { }

  ngOnInit(): void {
    // Establecer el título de la página
    this.pageTitleService.setPageTitle('Add New Word');
  }

  onSubmit(): void {
    if (this.isFormValid()) {
      // Add the word using the service
      this.wordService.addWord({...this.wordForm});
      
      // Navigate back to words list
      this.router.navigate(['/words']);
      
      this.resetForm();
    }
  }

  onCancel(): void {
    // Usar el servicio de historial de navegación para volver atrás
    if (!this.navigationHistoryService.goBack()) {
      // Si no hay historial, volver a la página de palabras
      this.router.navigate(['/words']);
    }
  }

  private isFormValid(): boolean {
    return !!this.wordForm.word.trim() && 
           !!this.wordForm.definition.trim();
  }

  private resetForm(): void {
    this.wordForm = {
      word: '',
      definition: '',
      example: ''
    };
  }
} 