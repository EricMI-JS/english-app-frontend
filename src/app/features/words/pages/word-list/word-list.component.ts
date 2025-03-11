import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WordService, Word } from '../../services/word.service';
import { PageTitleService } from '../../../../services/page-title.service';
import { NavigationHistoryService } from '../../../../services/navigation-history.service';
import { ConfirmationService, MessageService } from 'primeng/api';

interface WordWithExpanded extends Word {
  expanded?: boolean;
}

@Component({
  selector: 'app-word-list',
  templateUrl: './word-list.component.html',
  styleUrls: ['./word-list.component.scss']
})
export class WordListComponent implements OnInit, OnDestroy {
  words: WordWithExpanded[] = [];
  filteredWords: WordWithExpanded[] = [];
  private subscription: Subscription | null = null;
  isLoading = false;
  errorMessage = '';
  searchTerm = '';

  constructor(
    private router: Router,
    private wordService: WordService,
    private pageTitleService: PageTitleService,
    private navigationHistoryService: NavigationHistoryService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
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
        this.words = words.map(word => ({
          ...word,
          expanded: false
        }));
        this.filteredWords = this.words;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error al cargar palabras:', error);
        this.errorMessage = 'Error al cargar palabras. Por favor, intenta de nuevo.';
        this.isLoading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error loading words. Please try again.'
        });
      }
    });
  }
  
  /**
   * Alterna el estado de expansión de una palabra
   * @param word La palabra a expandir/colapsar
   */
  toggleWordExpansion(word: WordWithExpanded): void {
    word.expanded = !word.expanded;
  }
  
  onSearch(term: string): void {
    this.searchTerm = term;
    this.filterWords();
  }
  
  filterWords(): void {
    if (!this.searchTerm.trim()) {
      this.filteredWords = this.words;
      return;
    }
    
    const searchTermLower = this.searchTerm.toLowerCase();
    this.filteredWords = this.words.filter(word => 
      word.word.toLowerCase().includes(searchTermLower) || 
      (word.definition && word.definition.toLowerCase().includes(searchTermLower)) ||
      (word.exampleSentence && word.exampleSentence.toLowerCase().includes(searchTermLower))
    );
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
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this word?',
      header: 'Confirm Deletion',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.isLoading = true;
        
        this.wordService.deleteWord(id).subscribe({
          next: () => {
            // La palabra se eliminó correctamente
            // No es necesario recargar las palabras ya que el servicio actualiza el BehaviorSubject
            this.isLoading = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Word deleted successfully',
              life: 3000
            });
          },
          error: (error) => {
            console.error('Error al eliminar la palabra:', error);
            this.errorMessage = 'Error al eliminar la palabra. Por favor, intenta de nuevo.';
            this.isLoading = false;
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error deleting word. Please try again.',
              life: 3000
            });
            // Recargar las palabras para asegurarse de que la lista esté actualizada
            this.loadWords();
          }
        });
      }
    });
  }
} 