import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WordService, Word } from '../../services/word.service';
import { PageTitleService } from '../../../../services/page-title.service';
import { NavigationHistoryService } from '../../../../services/navigation-history.service';

interface Example {
  text: string;
  expanded: boolean;
}

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss']
})
export class WordListComponent implements OnInit, OnDestroy {
  words: Word[] = [];
  private subscription: Subscription | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(
    private router: Router,
    private wordService: WordService,
    private pageTitleService: PageTitleService,
    private navigationHistoryService: NavigationHistoryService
  ) { }

  ngOnInit(): void {
    // Establecer el título de la página
    this.pageTitleService.setPageTitle('My Words');
    
    // Cargar palabras desde la API
    this.loadWords();
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  loadWords(): void {
    this.isLoading = true;
    this.errorMessage = '';
    
    this.subscription = this.wordService.getAllWords().subscribe({
      next: (words) => {
        this.words = words;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar palabras:', error);
        this.errorMessage = 'Error al cargar palabras. Por favor, intenta de nuevo.';
        this.isLoading = false;
      }
    });
  }
  
  onAddWord(): void {
    // Navigate to the word-form route
    this.router.navigate(['/words/add']);
  }
  
  onEditWord(id: string): void {
    // Navigate to the edit form with the word id
    this.router.navigate(['/words/edit', id]);
  }
  
  onDeleteWord(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta palabra?')) {
      this.isLoading = true;
      
      this.wordService.deleteWord(id).subscribe({
        next: () => {
          // La palabra se eliminó correctamente
          // No es necesario recargar las palabras ya que el servicio actualiza el BehaviorSubject
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error al eliminar la palabra:', error);
          this.errorMessage = 'Error al eliminar la palabra. Por favor, intenta de nuevo.';
          this.isLoading = false;
          // Recargar las palabras para asegurarse de que la lista esté actualizada
          this.loadWords();
        }
      });
    }
  }
} 