const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export async function getQuiz() {
    try {
        const response = await fetch(`${BASE_URL}/quiz`);
        return response.json();
    } catch (error) {
        throw error;
    }
}