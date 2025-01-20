import { useForm, Controller } from 'react-hook-form';
import { Word } from "../../types/quiz";
import { Autocomplete, Button, TextField } from "@mui/material";
import { toast } from 'sonner';
import { useEffect, useRef, useState } from "react";
import { wordService } from '../../services/words/WordService';

interface WordFormProps {
    handleClose: () => void;
    initialData?: Word;
}

export default function WordForm({ handleClose, initialData }: WordFormProps) {
    const { control, register, handleSubmit, setValue, watch, formState: { errors } } = useForm<Word>({
        defaultValues: initialData || {
            word: '',
            definition: '',
            exampleSentence: ''
        }
    });

    useEffect(() => {
        if (initialData) {
            setValue('word', initialData.word);
            setValue('definition', initialData.definition);
            setValue('exampleSentence', initialData.exampleSentence);
        }
    }, [initialData, setValue]);

    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [definitionSuggestions, setDefinitionSuggestions] = useState<string[]>([]); // Sugerencias de definiciones

    const definitionInputRef = useRef<HTMLInputElement | null>(null); // Referencia al campo de definición

    // Función para buscar sugerencias de palabras
    const fetchSuggestions = async (input: string) => {
        if (input.length < 2) return;
        try {
            const response = await fetch(`https://api.datamuse.com/words?sp=${input}*`);
            if (!response.ok) throw new Error('Error fetching suggestions');
            const data = await response.json();
            const words = data.map((item: { word: string }) => item.word);
            setSuggestions(words);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
        }
    };

    // Función para buscar definiciones
    const fetchDefinitions = async (word: string) => {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            if (!response.ok) throw new Error('Error fetching definitions');
            const data = await response.json();
            const meanings = data[0]?.meanings.flatMap((meaning: any) =>
                meaning.definitions.map((def: any) => def.definition)
            );
            setDefinitionSuggestions(meanings || ['No se encontraron definiciones.']);
            setValue('definition', ''); // Limpia el valor actual para forzar la selección
        } catch (error) {
            console.error('Error fetching definitions:', error);
            setDefinitionSuggestions(['No se encontraron definiciones.']);
        }
    };


    const handleWordSelection = (value: string | null) => {
        if (value) {
            fetchDefinitions(value);
            definitionInputRef.current?.focus();
        }
    };
    
    const handleWordForm = async (formData: Word) => {
      try {
        await wordService.createWord(formData);
        toast.success('Palabra guardada exitosamente.');
        handleClose(); // Cerrar el modal
      } catch (error) {
        console.error('Error saving word:', error);
        toast.error('Error al guardar la palabra.');
      }
    };
    

    return (
        <form onSubmit={handleSubmit(handleWordForm)} className="h-full max-h-full overflow-auto p-2">
            <div className="flex flex-col justify-between">
                <div className="space-y-4">
                    {/* Autocomplete para palabras */}
                    <Controller
                        name="word"
                        control={control}
                        rules={{ required: 'La palabra es requerida' }}
                        render={({ field }) => (
                            <Autocomplete
                                value={watch('word')} // Usa el valor actual de React Hook Form
                                freeSolo
                                options={suggestions}
                                onInputChange={(_, newInputValue) => fetchSuggestions(newInputValue)}
                                onChange={(_, value) => {
                                    field.onChange(value);
                                    handleWordSelection(value);
                                }}
                                renderInput={(params) => (
                                    <TextField
                                        {...params}
                                        label="Palabra"
                                        variant="outlined"
                                        error={!!errors.word}
                                        helperText={errors.word?.message}
                                    />
                                )}
                            />
                        )}
                    />

                    {/* Autocomplete para definiciones */}
                    <Autocomplete
                        freeSolo
                        options={definitionSuggestions}
                        value={watch('definition')} // Usa el valor actual de React Hook Form
                        onInputChange={(_, value) => {
                            setValue('definition', value || ''); // Sincroniza cambios con React Hook Form

                            // Si el input está vacío, intenta cargar sugerencias si hay una palabra en "Word"
                            if (value === '') {
                                const word = watch('word'); // Obtén el valor actual de "Word"
                                if (word) {
                                    fetchDefinitions(word); // Llama a la función para obtener definiciones
                                }
                            }
                        }}
                        onChange={(_, value) => setValue('definition', value || '')} // Maneja selección de opciones
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Definición"
                                variant="outlined"
                                multiline
                                rows={3}
                                inputRef={definitionInputRef}
                                error={!!errors.definition}
                                helperText={errors.definition?.message}
                                {...register('definition', { required: 'La definición es requerida' })}
                            />
                        )}
                    />


                    <TextField
                        className="w-full"
                        label="Enunciado de ejemplo"
                        variant="outlined"
                        multiline
                        rows={3}
                        {...register('exampleSentence', {
                            required: 'El enunciado es requerido',
                        })}
                        error={errors.exampleSentence ? true : false}
                        helperText={errors.exampleSentence ? errors.exampleSentence.message : ''}
                    />
                </div>

                <Button type="submit" className="w-full" variant="contained" sx={{ mt: 3 }}>
                    Confirmar
                </Button>
            </div>
        </form>
    );
}
