import { useEffect, useState } from 'react'
import { Question, QuizState } from '../../types/quiz';
import { BrainCircuit } from 'lucide-react';
import { ProgressBar } from '../../components/quiz/ProgressBar';
import { QuestionCard } from '../../components/quiz/QuestionCard';
import { QuizResults } from '../../components/quiz/QuizResults';
import { toast } from 'sonner';
import { Button } from '@mui/material';
import { getQuiz } from '../../services/quizService';

export default function QuizPage() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);

    const [quizState, setQuizState] = useState<QuizState>({
        currentQuestionIndex: 0,
        score: 0,
        answers: [],
        isComplete: false
    });

    const [showAnswerResult, setShowAnswerResult] = useState(false); // Nuevo estado para mostrar el resultado de la respuesta
    const [isCorrectAnswer, setIsCorrectAnswer] = useState<boolean | null>(null); // Nuevo estado para saber si la respuesta fue correcta

    // Función para obtener la lista de preguntas
    const fetchQuestions = async () => {
        try {
            const data = await getQuiz()
            console.log('data',data);
            
            setQuestions(data);
            setIsLoadingQuestions(false);
        } catch (error) {
            console.error('Error fetching words:', error);
            toast.error('Error al cargar la lista de palabras.');
        }
    };

    // Cargar preguntas al montar el componente
    useEffect(() => {
        fetchQuestions();
    }, []);

    const currentQuestion = questions[quizState.currentQuestionIndex];

    const handleAnswer = (answerIndex: number) => {
        if (quizState.answers[quizState.currentQuestionIndex] !== undefined) return;

        const isCorrect = answerIndex === currentQuestion.correctAnswer;
        setIsCorrectAnswer(isCorrect); // Establecer si es correcta o incorrecta

        const newAnswers = [...quizState.answers];
        newAnswers[quizState.currentQuestionIndex] = answerIndex;

        const newScore = isCorrect ? quizState.score + 1 : quizState.score;

        setQuizState(prev => ({
            ...prev,
            score: newScore,
            answers: newAnswers
        }));

        setShowAnswerResult(true); // Mostrar si la respuesta fue correcta o incorrecta
    };

    const handleNextQuestion = () => {
        const isLastQuestion = quizState.currentQuestionIndex === questions.length - 1;

        setQuizState(prev => ({
            ...prev,
            currentQuestionIndex: isLastQuestion ? prev.currentQuestionIndex : prev.currentQuestionIndex + 1,
            isComplete: isLastQuestion
        }));

        // Resetear los estados para la siguiente pregunta
        setShowAnswerResult(false);
        setIsCorrectAnswer(null);
    };

    const restartQuiz = () => {
        setQuizState({
            currentQuestionIndex: 0,
            score: 0,
            answers: [],
            isComplete: false
        });
        setShowAnswerResult(false);
        setIsCorrectAnswer(null);
    };

    return (
        isLoadingQuestions ? <h1>Cargando...</h1> : (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
                    <div className="flex items-center gap-3 mb-6">
                        <BrainCircuit className="w-6 h-6 text-indigo-600" />
                        <h1 className="text-2xl font-bold text-gray-800">Quiz Time</h1>
                    </div>

                    <ProgressBar
                        current={quizState.currentQuestionIndex + 1}
                        total={questions.length}
                    />

                    <div className="mt-6">
                        {!quizState.isComplete ? (
                            <>
                                <QuestionCard
                                    question={currentQuestion}
                                    selectedAnswer={quizState.answers[quizState.currentQuestionIndex]}
                                    onSelectAnswer={handleAnswer}
                                />

                                {/* Mostrar si la respuesta fue correcta o incorrecta */}
                                {showAnswerResult && (
                                    <div className={`mt-4 p-3 rounded ${isCorrectAnswer ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {isCorrectAnswer ? '¡Respuesta correcta!' : 'Respuesta incorrecta.'}
                                    </div>
                                )}
                            </>
                        ) : (
                            <QuizResults
                                score={quizState.score}
                                totalQuestions={questions.length}
                                onRestart={restartQuiz}
                            />
                        )}
                    </div>

                    {
                        !quizState.isComplete ? (
                            <div className="mt-6 flex justify-end">
                                <Button
                                    variant='contained'
                                    disabled={!showAnswerResult} // Deshabilitado hasta que se muestre el resultado de la respuesta
                                    onClick={handleNextQuestion} // Avanzar a la siguiente pregunta
                                >
                                    Siguiente
                                </Button>
                            </div>
                        ) : <></>

                    }

                </div>
            </div>
        )
    );
}

