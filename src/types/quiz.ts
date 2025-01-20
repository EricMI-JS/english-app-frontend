
export type Word = {
  id?: string;
  word: string;
  definition: string;
  exampleSentence: string;
}

export type WordTemplate = Pick<Word, 'word' | 'definition' | 'exampleSentence'> & {
  word: string
}

export type Question = {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number;
  exampleSentence: string;
}

export type QuizState = {
  currentQuestionIndex: number;
  score: number;
  answers: number[];
  isComplete: boolean;
}