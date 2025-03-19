import { Component, OnInit, OnDestroy } from '@angular/core';
import { PageTitleService } from '../../../../services/page-title.service';
import { NavigationHistoryService } from '../../../../services/navigation-history.service';
import { QuizService, QuizQuestion, QuizOption } from '../../services/quiz.service';
import { finalize } from 'rxjs/operators';
import { MessageService, ConfirmationService } from 'primeng/api';
import { WordService, Word } from '../../../words/services/word.service';
import { Subscription } from 'rxjs';

interface WordWithExpanded extends Word {
  expanded?: boolean;
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit, OnDestroy {
  currentQuestionIndex = 0;
  selectedOptionId: string | null = null;
  quizCompleted = false;
  userAnswers: { questionId: string, selectedOptionId: string }[] = [];
  score = 0;
  questions: QuizQuestion[] = [];
  isLoading = true;
  error: string | null = null;
  answerSubmitted = false;
  
  // Variables para la selección de palabras
  showWordSelection = true;
  availableWords: WordWithExpanded[] = [];
  selectedWords: WordWithExpanded[] = [];
  wordSelectionVisible = true;
  isLoadingWords = false;
  
  private subscriptions: Subscription = new Subscription();

  constructor(
    private pageTitleService: PageTitleService,
    private navigationHistoryService: NavigationHistoryService,
    private quizService: QuizService,
    private wordService: WordService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) { }

  ngOnInit(): void {
    this.pageTitleService.setPageTitle('Aptitude Test');
    this.loadAvailableWords();
  }
  
  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
  
  /**
   * Carga las palabras disponibles para el quiz
   */
  loadAvailableWords(): void {
    this.isLoadingWords = true;
    
    const subscription = this.wordService.getAllWords().subscribe({
      next: (words) => {
        this.availableWords = words.map(word => ({
          ...word,
          expanded: false
        }));
        this.isLoadingWords = false;
      },
      error: (err) => {
        console.error('Error loading words:', err);
        this.isLoadingWords = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load words. Please try again later.'
        });
      }
    });
    
    this.subscriptions.add(subscription);
  }
  
  /**
   * Alterna el estado de expansión de una palabra
   * @param word La palabra a expandir/colapsar
   */
  toggleWordExpansion(word: WordWithExpanded, event: Event): void {
    event.stopPropagation(); // Evitar que se seleccione/deseleccione la fila
    word.expanded = !word.expanded;
  }
  
  /**
   * Inicia el quiz con las palabras seleccionadas
   */
  startQuiz(): void {
    if (this.selectedWords.length < 4) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please select at least 4 words for the quiz.'
      });
      return;
    }
    
    this.isLoading = true;
    this.error = null;
    this.wordSelectionVisible = false;
    
    const wordIds = this.selectedWords.map(word => word.id!);
    
    const subscription = this.quizService.getQuizQuestionsForWords(wordIds)
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          this.questions = response.questions;
          if (this.questions.length === 0) {
            this.messageService.add({
              severity: 'info',
              summary: 'Information',
              detail: 'No questions available for the selected words.'
            });
            this.wordSelectionVisible = true;
          }
        },
        error: (err) => {
          console.error('Error loading quiz questions:', err);
          this.error = 'Failed to load quiz questions. Please try again later.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load quiz questions. Please try again later.'
          });
          this.wordSelectionVisible = true;
        }
      });
      
    this.subscriptions.add(subscription);
  }
  
  /**
   * Carga todas las preguntas del quiz sin selección de palabras
   */
  loadQuizQuestions(): void {
    this.isLoading = true;
    this.error = null;
    
    const subscription = this.quizService.getQuizQuestions()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          this.questions = response.questions;
          if (this.questions.length === 0) {
            this.messageService.add({
              severity: 'info',
              summary: 'Information',
              detail: 'No questions available at the moment.'
            });
          }
        },
        error: (err) => {
          console.error('Error loading quiz questions:', err);
          this.error = 'Failed to load quiz questions. Please try again later.';
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load quiz questions. Please try again later.'
          });
        }
      });
      
    this.subscriptions.add(subscription);
  }

  get currentQuestion(): QuizQuestion {
    return this.questions[this.currentQuestionIndex];
  }

  get totalQuestions(): number {
    return this.questions.length;
  }

  selectOption(optionId: string): void {
    this.selectedOptionId = optionId;
    this.answerSubmitted = true;
    
    // Check if the selected answer is correct and update score
    if (this.isCorrectOption(optionId)) {
      this.score++;
    }
    
    // Save the user's answer
    this.userAnswers.push({
      questionId: this.currentQuestion.id,
      selectedOptionId: optionId
    });
  }

  isOptionSelected(optionId: string): boolean {
    return this.selectedOptionId === optionId;
  }

  isCorrectOption(optionId: string): boolean {
    return this.currentQuestion.correctOptionId === optionId;
  }

  nextQuestion(): void {
    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedOptionId = null;
      this.answerSubmitted = false;
    } else {
      // Quiz completed
      this.quizCompleted = true;
    }
  }

  confirmRestart(): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to restart the quiz? Your progress will be lost.',
      header: 'Confirm Restart',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.restartQuiz();
      }
    });
  }

  restartQuiz(): void {
    this.currentQuestionIndex = 0;
    this.selectedOptionId = null;
    this.quizCompleted = false;
    this.userAnswers = [];
    this.score = 0;
    this.answerSubmitted = false;
    this.wordSelectionVisible = true;
  }

  getScorePercentage(): number {
    return Math.round((this.score / this.questions.length) * 100);
  }

  getScoreMessage(): string {
    const percentage = this.getScorePercentage();
    if (percentage >= 90) {
      return 'Excellent! You have a strong understanding.';
    } else if (percentage >= 70) {
      return 'Good job! You have a solid grasp of the material.';
    } else if (percentage >= 50) {
      return 'Not bad. There\'s room for improvement.';
    } else {
      return 'Keep practicing. You\'ll get better with time.';
    }
  }
} 