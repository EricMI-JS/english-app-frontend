import { Component, OnInit } from '@angular/core';
import { PageTitleService } from '../../../../services/page-title.service';
import { NavigationHistoryService } from '../../../../services/navigation-history.service';
import { QuizService, QuizQuestion, QuizOption } from '../../services/quiz.service';
import { finalize } from 'rxjs/operators';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {
  currentQuestionIndex = 0;
  selectedOptionId: string | null = null;
  quizCompleted = false;
  userAnswers: { questionId: string, selectedOptionId: string }[] = [];
  score = 0;
  questions: QuizQuestion[] = [];
  isLoading = true;
  error: string | null = null;
  answerSubmitted = false;

  constructor(
    private pageTitleService: PageTitleService,
    private navigationHistoryService: NavigationHistoryService,
    private quizService: QuizService
  ) { }

  ngOnInit(): void {
    this.pageTitleService.setPageTitle('Aptitude Test');
    this.loadQuizQuestions();
  }

  loadQuizQuestions(): void {
    this.isLoading = true;
    this.error = null;
    
    this.quizService.getQuizQuestions()
      .pipe(
        finalize(() => this.isLoading = false)
      )
      .subscribe({
        next: (response) => {
          this.questions = response.questions;
        },
        error: (err) => {
          console.error('Error loading quiz questions:', err);
          this.error = 'Failed to load quiz questions. Please try again later.';
        }
      });
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

  restartQuiz(): void {
    this.currentQuestionIndex = 0;
    this.selectedOptionId = null;
    this.quizCompleted = false;
    this.userAnswers = [];
    this.score = 0;
    this.answerSubmitted = false;
    this.loadQuizQuestions();
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