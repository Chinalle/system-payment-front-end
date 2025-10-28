import axios from 'axios';

// Cria uma instância do Axios
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

// Adiciona o token (se existir) na inicialização
const token = localStorage.getItem('token');
if (token) {
  apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

/**
 * Interceptor de RESPOSTA (Response)
 * Lida com a lógica de expiração de token (401) e refresh.
 */
apiClient.interceptors.response.use(
  (response) => {
    // Se a resposta for sucesso, apenas retorne
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Se o erro NÃO for 401 (Não Autorizado), ou se o 401
    // aconteceu na PRÓPRIA rota de refresh, rejeita imediatamente.
    if (error.response.status !== 401 || originalRequest.url === '/auth/refresh') {
      
      // Se foi um 401 na rota de refresh, desloga
      if (originalRequest.url === '/auth/refresh') {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
      }
      
      return Promise.reject(error);
    }

    // Marca a requisição para não entrar em loop infinito
    if (originalRequest._retry) {
      return Promise.reject(error);
    }
    originalRequest._retry = true;

    try {
      // 1. Importa a store dinamicamente para evitar dependência circular
      const { useAuthStore } = await import('@/stores/auth');
      const authStore = useAuthStore();

      // 2. Chama a action de refresh
      const { token: newToken } = await authStore.handleRefreshToken();

      // 3. Atualiza o header da REQUISIÇÃO ORIGINAL que falhou
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

      // 4. Tenta novamente a requisição original com o novo token
      return apiClient(originalRequest);

    } catch (refreshError) {
      // O 'handleRefreshToken' já terá deslogado o usuário em caso de falha.
      // Apenas rejeitamos a promessa original.
      return Promise.reject(refreshError);
    }
  }
);

export default apiClient;