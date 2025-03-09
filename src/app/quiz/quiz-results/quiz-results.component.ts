import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-quiz-results',
  templateUrl: './quiz-results.component.html',
  styleUrls: []
})
export class QuizResultsComponent {
  @Input() score = 0;
  @Input() totalQuestions = 0;
  @Output() restart = new EventEmitter<void>();

  getScorePercentage(): number {
    return Math.round((this.score / this.totalQuestions) * 100);
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

  onRestart(): void {
    this.restart.emit();
  }
}
