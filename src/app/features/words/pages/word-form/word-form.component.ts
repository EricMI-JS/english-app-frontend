import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageTitleService } from '../../../../services/page-title.service';
import { DatamuseService } from '../../../../services/datamuse.service';
import { WordService, Word } from '../../services/word.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-word-form',
  templateUrl: './word-form.component.html',
  styleUrls: ['./word-form.component.scss']
})
export class WordFormComponent implements OnInit, OnDestroy {
  wordSuggestions: string[] = [];
  wordForm!: FormGroup;
  private subscriptions: Subscription = new Subscription();
  isEditMode = false;
  wordId: string | null = null;
  
  constructor(
    private pageTitleService: PageTitleService,
    private datamuseService: DatamuseService,
    private wordService: WordService,
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    // Inicializar el formulario
    this.wordForm = this.fb.group({
      word: ['', Validators.required],
      definition: ['', Validators.required],
      exampleSentence: ['']
    });
    
    // Verificar si estamos en modo edición
    this.route.paramMap.subscribe(params => {
      this.wordId = params.get('id');
      
      if (this.wordId) {
        this.isEditMode = true;
        this.pageTitleService.setPageTitle('Edit Word');
        this.loadWordData(this.wordId);
      } else {
        this.isEditMode = false;
        this.pageTitleService.setPageTitle('Add New Word');
      }
    });
  }

  ngOnDestroy(): void {
    // Cancelar todas las suscripciones para evitar memory leaks
    this.subscriptions.unsubscribe();
  }

  /**
   * Carga los datos de una palabra existente para edición
   */
  loadWordData(id: string): void {
    const subscription = this.wordService.getWordById(id).subscribe({
      next: (word: Word) => {
        this.wordForm.patchValue({
          word: word.word,
          definition: word.definition,
          exampleSentence: word.exampleSentence
        });
      },
      error: (error) => {
        console.error('Error al cargar la palabra:', error);
        this.router.navigate(['/words']);
      }
    });
    
    this.subscriptions.add(subscription);
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
      const wordData: Word = {
        word: this.wordForm.value.word,
        definition: this.wordForm.value.definition,
        exampleSentence: this.wordForm.value.exampleSentence
      };

      let subscription;
      
      if (this.isEditMode && this.wordId) {
        // Actualizar palabra existente
        subscription = this.wordService.updateWord(this.wordId, wordData).subscribe({
          next: () => {
            this.router.navigate(['/words']);
          },
          error: (error) => {
            console.error('Error al actualizar la palabra:', error);
          }
        });
      } else {
        // Crear nueva palabra
        subscription = this.wordService.addWord(wordData).subscribe({
          next: () => {
            this.router.navigate(['/words']);
          },
          error: (error) => {
            console.error('Error al guardar la palabra:', error);
          }
        });
      }
      
      if (subscription) {
        this.subscriptions.add(subscription);
      }
    } else {
      // Marcar todos los campos como touched para mostrar errores
      Object.keys(this.wordForm.controls).forEach(key => {
        this.wordForm.get(key)?.markAsTouched();
      });
    }
  }
} 