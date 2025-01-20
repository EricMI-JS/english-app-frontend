import { useState, useEffect } from 'react';
import { Modal, Typography } from '@mui/material';
import { toast } from 'sonner';
import WordForm from './WordForm'; // Asegúrate de importar tu formulario aquí
import { Word } from '../../types/quiz';
import {
    LeadingActions,
    SwipeableList,
    SwipeableListItem,
    SwipeAction,
    TrailingActions
} from 'react-swipeable-list'
import 'react-swipeable-list/dist/styles.css'
import * as wordService from '../../services/wordService';

const WordList = () => {
    const [words, setWords] = useState<Word[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedWord, setSelectedWord] = useState<Word | null>(null); // Palabra seleccionada para editar

    // Función para obtener la lista de palabras
    const fetchWords = async () => {
        try {
            const response = await wordService.getAllWords();
            setWords(response);
        } catch (error) {
            console.error('Error fetching words:', error);
            toast.error('Error al cargar la lista de palabras.');
        }
    };

    // Cargar palabras al montar el componente
    useEffect(() => {
        fetchWords();
    }, []);

    // Función para eliminar una palabra
    const handleDelete = async (id: string) => {
        try {
            await wordService.deleteWord(id)
            toast.success('Palabra eliminada exitosamente.');
            setWords((prev) => prev.filter((word) => word.id !== id));
        } catch (error) {
            console.error('Error deleting word:', error);
            toast.error('Error al eliminar la palabra.');
        }
    };

    // Función para abrir el modal para editar
    const handleEdit = (word: Word) => {
        setSelectedWord(word);
        setIsModalOpen(true);
    };

    // Función para cerrar el modal
    const handleClose = () => {
        setSelectedWord(null);
        setIsModalOpen(false);
    };

    const leadingActions = (word: Word) => (
        <LeadingActions>
          <SwipeAction onClick={() => handleEdit(word)}>
            Actualizar
          </SwipeAction>
        </LeadingActions>
      )
      
      const trailingActions = (wordId: string) => (
        <TrailingActions>
          <SwipeAction onClick={() => handleDelete(wordId)}>
            Eliminar
          </SwipeAction>
        </TrailingActions>
      )

    return (
        <>
            <ul className="space-y-4">
                {words.map((word) => (
                    <SwipeableList>
                        <SwipeableListItem leadingActions={leadingActions(word)} trailingActions={trailingActions(word.id!)}>
                            <li key={word.id} className="flex flex-col bg-white rounded-md p-4 w-full">
                                <p className='font-semibold text-xl mb-1 capitalize'>{word.word}</p>
                                <p className='text-gray-400 text-sm'>{word.definition}</p>
                            </li>
                        </SwipeableListItem>
                    </SwipeableList>
                ))}
            </ul>

            <Modal
                open={isModalOpen}
                onClose={handleClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
            >
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4/5 lg:w-auto min-w-80 bg-white shadow-lg p-4 rounded-lg overflow-auto">
                    <div className="mb-3 p-2">
                        <Typography id="modal-title" variant="h6" component="h2">
                            Editar palabra
                        </Typography>
                    </div>
                    <WordForm handleClose={handleClose} initialData={selectedWord!} />
                </div>
            </Modal>
        </>

    );
};

export default WordList;
