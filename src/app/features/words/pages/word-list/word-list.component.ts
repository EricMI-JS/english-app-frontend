import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { WordService, Word } from '../../../../services/word.service';
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

  constructor(
    private router: Router,
    private wordService: WordService,
    private pageTitleService: PageTitleService,
    private navigationHistoryService: NavigationHistoryService
  ) { }

  ngOnInit(): void {
    // Establecer el título de la página
    this.pageTitleService.setPageTitle('My Words');
    
    // Subscribe to the words observable to get updates
    this.subscription = this.wordService.words$.subscribe(words => {
      this.words = words;
    });
  }

  ngOnDestroy(): void {
    // Clean up subscription when component is destroyed
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
  
  onAddWord(): void {
    // Navigate to the word-form route
    this.router.navigate(['/words/add']);
  }
} 