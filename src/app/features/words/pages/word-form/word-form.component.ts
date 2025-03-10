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

  // Sugerencias para autocompletado
  wordSuggestions: string[] = [];
  definitionSuggestions: string[] = [];

  // Datos de ejemplo para autocompletado
  commonWords: string[] = [
    'abandon', 'ability', 'able', 'about', 'above', 'accept', 'according', 'account', 'across', 'act',
    'action', 'activity', 'actually', 'add', 'address', 'administration', 'admit', 'adult', 'affect', 'after',
    'again', 'against', 'age', 'agency', 'agent', 'ago', 'agree', 'agreement', 'ahead', 'air'
  ];

  commonDefinitions: string[] = [
    'the ability to do something or act in a particular way',
    'a statement that explains the meaning of a word or phrase',
    'a person who is studying at a school, college, or university',
    'a process of finding the value of something',
    'the state of being away from a place or person',
    'a feeling of expectation and desire for a certain thing to happen',
    'a view or judgment formed about something, not necessarily based on fact or knowledge',
    'a person who takes part in an action or process',
    'the power or right to give orders, make decisions, and enforce obedience',
    'the regard that something is held to deserve; the importance, worth, or usefulness of something'
  ];

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

  // Método para filtrar sugerencias de palabras
  filterWords(event: any) {
    const query = event.query.toLowerCase();
    this.wordSuggestions = this.commonWords.filter(word => 
      word.toLowerCase().includes(query)
    );
  }

  // Método para filtrar sugerencias de definiciones
  filterDefinitions(event: any) {
    const query = event.query.toLowerCase();
    this.definitionSuggestions = this.commonDefinitions.filter(definition => 
      definition.toLowerCase().includes(query)
    );
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