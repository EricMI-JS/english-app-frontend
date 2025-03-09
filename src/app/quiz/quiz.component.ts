import { Component, OnInit } from '@angular/core';

interface QuizQuestion {
  id: number;
  text: string;
  options: QuizOption[];
}

interface QuizOption {
  id: number;
  text: string;
  isCorrect: boolean;
}

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: []
})
export class QuizComponent implements OnInit {
  currentQuestionIndex = 0;
  selectedOptionId: number | null = null;
  quizCompleted = false;
  userAnswers: { questionId: number, selectedOptionId: number }[] = [];
  score = 0;

  questions: QuizQuestion[] = [
    {
      id: 1,
      text: 'If a car travels 200 miles in 4 hours, what is its average speed?',
      options: [
        { id: 1, text: '40 Mph', isCorrect: true },
        { id: 2, text: '50 Mph', isCorrect: false },
        { id: 3, text: '60 Mph', isCorrect: false },
        { id: 4, text: '70 Mph', isCorrect: false }
      ]
    },
    {
      id: 2,
      text: 'Which word is a synonym for "eloquent"?',
      options: [
        { id: 1, text: 'Articulate', isCorrect: true },
        { id: 2, text: 'Confused', isCorrect: false },
        { id: 3, text: 'Silent', isCorrect: false },
        { id: 4, text: 'Boring', isCorrect: false }
      ]
    },
    {
      id: 3,
      text: 'What is the past tense of "begin"?',
      options: [
        { id: 1, text: 'Beginning', isCorrect: false },
        { id: 2, text: 'Begun', isCorrect: false },
        { id: 3, text: 'Began', isCorrect: true },
        { id: 4, text: 'Beginned', isCorrect: false }
      ]
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  get currentQuestion(): QuizQuestion {
    return this.questions[this.currentQuestionIndex];
  }

  get totalQuestions(): number {
    return this.questions.length;
  }

  selectOption(optionId: number): void {
    this.selectedOptionId = optionId;
  }

  isOptionSelected(optionId: number): boolean {
    return this.selectedOptionId === optionId;
  }

  isCorrectOption(optionId: number): boolean {
    const option = this.currentQuestion.options.find(opt => opt.id === optionId);
    return option?.isCorrect || false;
  }

  nextQuestion(): void {
    // Save the user's answer
    if (this.selectedOptionId !== null) {
      this.userAnswers.push({
        questionId: this.currentQuestion.id,
        selectedOptionId: this.selectedOptionId
      });
      
      // Check if the selected answer is correct
      if (this.isCorrectOption(this.selectedOptionId)) {
        this.score++;
      }
    }

    if (this.currentQuestionIndex < this.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedOptionId = null;
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
