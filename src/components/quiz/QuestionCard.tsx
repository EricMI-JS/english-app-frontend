import { Question } from '../../types/quiz';
import { Tooltip, IconButton } from '@mui/material';
import HelpIcon from '@mui/icons-material/Help';
interface QuestionCardProps {
  question: Question;
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
}

export function QuestionCard({ question, selectedAnswer, onSelectAnswer }: QuestionCardProps) {
  return (
    <div className="space-y-4">
      <div className='flex justify-between items-center'>
        <h2 className="text-xl font-semibold text-gray-800 capitalize">{question.text}</h2>
        <Tooltip title={question.exampleSentence ?? 'Prueba tooltip'}>
          <IconButton>
            <HelpIcon />
          </IconButton>
        </Tooltip>
      </div>
      <div className="space-y-2">
        {question.options.map((option, index) => {
          let buttonClasses = 'w-full p-4 text-left rounded-lg transition ';

          // Si el usuario ha seleccionado una respuesta
          if (selectedAnswer !== undefined) {
            if (index === question.correctAnswer) {
              // Respuesta correcta (marcar en verde)
              buttonClasses += 'bg-green-500 text-white';
            } else if (index === selectedAnswer) {
              // Respuesta incorrecta seleccionada por el usuario (marcar en rojo)
              buttonClasses += 'bg-red-500 text-white';
            } else {
              // Otras opciones no seleccionadas
              buttonClasses += 'bg-white border border-gray-200';
            }
          } else {
            // Cuando no se ha seleccionado ninguna respuesta, mantener el estilo original
            buttonClasses += 'bg-white hover:bg-gray-50 border border-gray-200';
          }

          return (
            <button
              key={index}
              onClick={() => onSelectAnswer(index)}
              className={buttonClasses}
              disabled={selectedAnswer !== undefined} // Deshabilitar los botones una vez que se seleccionó una respuesta
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
}
