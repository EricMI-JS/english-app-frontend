import { useState, useEffect } from 'react';
import { Button, Modal, Typography } from '@mui/material';
import { toast } from 'sonner';
import WordForm from './WordForm'; // Asegúrate de importar tu formulario aquí
import { Word } from '../../types/quiz';
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
    const deleteWord = async (id: string) => {
        try {
            await wordService.deleteWord(id)
            toast.success('Palabra eliminada exitosamente.');
            setWords((prev) => prev.filter((word) => word.id !== id)); // Actualiza la lista localmente
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

    return (
        <div className="p-4">
            <Typography variant="h5">
                <p className='mb-4'>Lista de palabras</p>
            </Typography>
            <ul className="space-y-4">
                {words.map((word) => (
                    <li key={word.id} className="flex justify-between items-center border-b pb-2">
                        <div>
                            <Typography variant="body1">
                                <strong>{word.word}</strong> - {word.definition}
                            </Typography>
                            <Typography variant="body2" className="text-gray-500">
                                {word.exampleSentence}
                            </Typography>
                        </div>
                        <div className="flex space-x-2">
                            <Button
                                variant="outlined"
                                color="primary"
                                onClick={() => handleEdit(word)}
                            >
                                Editar
                            </Button>
                            <Button
                                variant="outlined"
                                color="secondary"
                                onClick={() => deleteWord(word.id!)}
                            >
                                Eliminar
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>

            {/* Modal para editar */}
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
        </div>
    );
};

export default WordList;
