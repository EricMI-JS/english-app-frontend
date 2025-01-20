const BASE_URL = 'https://localhost:3000'; // Reemplaza con tu URL base

/**
 * Función genérica para manejar peticiones HTTP.
 * @param endpoint - Endpoint de la API (por ejemplo, '/users').
 * @param method - Método HTTP (GET, POST, PUT, DELETE).
 * @param data - Datos a enviar en el cuerpo de la petición (para POST/PUT).
 * @returns Respuesta de la API tipada como `R`.
 */
export async function apiRequest<T = unknown, R = unknown>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET',
  data?: T
): Promise<R> {
  const url = `${BASE_URL}/${endpoint}`;
  const options: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return (await response.json()) as R;
  } catch (error) {
    console.error('Error in API request:', error);
    throw error;
  }
}
