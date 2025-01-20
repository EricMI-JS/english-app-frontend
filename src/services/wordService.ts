import { Word } from "../types/quiz";

const BASE_URL = import.meta.env.VITE_API_URL;

export async function createWord(formData: Word) {
  const response = await fetch(`${BASE_URL}/words`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) throw new Error('Error al crear la palabra');

  return response.json();
}
export async function updateWord(id: string, formData: Word) {
  const response = await fetch(`${BASE_URL}/words/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) throw new Error('Error al actualizar la palabra');

  return response.json();
}

export async function deleteWord(id: string) {
  const response = await fetch(`${BASE_URL}/words/${id}`, {
    method: 'DELETE',
  });

  if (!response.ok) throw new Error('Error al eliminar la palabra');

  return response;
}

export async function getAllWords() {
  const response = await fetch(`${BASE_URL}/words`);

  if (!response.ok) throw new Error('Error al obtener las palabras');

  return response.json();
}

export async function getWordById(id: string) {
  const response = await fetch(`${BASE_URL}/words/${id}`);

  if (!response.ok) throw new Error('Error al obtener la palabra');

  return response.json();
}
