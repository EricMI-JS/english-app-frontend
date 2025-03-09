import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { WordService, Word } from '../../services/word.service';

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
    private wordService: WordService
  ) { }

  ngOnInit(): void {
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
    // Navigate back to words list
    this.router.navigate(['/words']);
    this.resetForm();
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
