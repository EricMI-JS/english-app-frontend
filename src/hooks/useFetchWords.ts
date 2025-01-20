import * as wordService from '../services/wordService';
import { useState, useEffect } from 'react';
import { Word } from '../types/quiz';

export const useFetchWords = (shouldFetchWords: boolean) => {
    const [words, setWords] = useState<Word[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchWords = async () => {
            setLoading(true);
            try {
                const response = await wordService.getAllWords();
                setWords(response);
            } catch (error) {
                console.log('error', error);
                setError('Failed to fetch words');
            } finally {
                setLoading(false);
            }
        };

        if (shouldFetchWords) {
            fetchWords();
        }
    }, [shouldFetchWords]);

    return { words, setWords, loading, error };
};
