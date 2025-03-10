import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageTitleService } from '../../../../services/page-title.service';
import { DatamuseService } from '../../../../services/datamuse.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-word-form',
  templateUrl: './word-form.component.html',
  styleUrls: ['./word-form.component.scss']
})
export class WordFormComponent implements OnInit, OnDestroy {
  wordSuggestions: string[] = [];
  wordForm!: FormGroup;
  private subscriptions: Subscription = new Subscription();
  
  constructor(
    private pageTitleService: PageTitleService,
    private datamuseService: DatamuseService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    // Establecer el título de la página
    this.pageTitleService.setPageTitle('Add New Word');
    
    // Inicializar el formulario
    this.wordForm = this.fb.group({
      word: ['', Validators.required],
      definition: ['', Validators.required],
      example: ['']
    });
  }

  ngOnDestroy(): void {
    // Cancelar todas las suscripciones para evitar memory leaks
    this.subscriptions.unsubscribe();
  }

  /**
   * Método para buscar sugerencias de palabras
   * @param event Evento del autocompletado que contiene el término de búsqueda
   */
  searchWords(event: any): void {
    const query = event.query;
    const subscription = this.datamuseService.searchWordsByPrefix(query).subscribe({
      next: (words: string[]) => {
        this.wordSuggestions = words;
      },
      error: (error) => {
        console.error('Error fetching word suggestions:', error);
        this.wordSuggestions = [];
      }
    });
    
    this.subscriptions.add(subscription);
  }

  /**
   * Método que se ejecuta cuando se selecciona una palabra del autocompletado
   * @param word La palabra seleccionada
   */
  onWordSelect(word: string): void {
    // Buscar la definición de la palabra seleccionada
    const subscription = this.datamuseService.getWordDefinition(word).subscribe({
      next: (definition: string) => {
        if (definition) {
          // Establecer la definición en el formulario
          this.wordForm.get('definition')?.setValue(definition);
        }
      },
      error: (error) => {
        console.error('Error fetching definition:', error);
      }
    });
    this.subscriptions.add(subscription);
  }
  
  /**
   * Método para obtener sugerencias de definiciones para la palabra actual
   */
  getDefinitionSuggestions(): void {
    const wordValue = this.wordForm.get('word')?.value;
    
    if (wordValue && wordValue.trim()) {
      const subscription = this.datamuseService.getWordDefinition(wordValue).subscribe({
        next: (definition: string) => {
          if (definition) {
            this.wordForm.get('definition')?.setValue(definition);
          }
        },
        error: (error) => {
          console.error('Error fetching definition:', error);
        }
      });
      this.subscriptions.add(subscription);
    }
  }

  onSubmit(): void {
    if (this.wordForm.valid) {
      console.log('Form submitted:', this.wordForm.value);
      // Aquí iría la lógica para guardar el formulario
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.wordForm.controls).forEach(key => {
        this.wordForm.get(key)?.markAsTouched();
      });
    }
  }
} 