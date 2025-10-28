// src/stores/auth.js

import { defineStore } from 'pinia';
import apiClient from '@/services/api';

// Esta variável é necessária para o interceptor de API
// Ela evita que múltiplas chamadas falhem ao mesmo tempo e tentem
// dar refresh várias vezes (condição de corrida).
let isRefreshingPromise = null;

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: null, 
    isLoggedIn: !!localStorage.getItem('token'),
  }),
  
  getters: {
    isAuthenticated: (state) => state.isLoggedIn,
    userData: (state) => state.user,
  },

  actions: {
    async login(credentials) {
      try {
        const response = await apiClient.post('/auth/login', credentials);

        const { token, refreshToken } = response.data;
        
        this.token = token;
        this.refreshToken = refreshToken;
        this.isLoggedIn = true;
        
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        await this.fetchUser();

      } catch (error) {
        console.error('Falha no login:', error);
        this.logout();
        throw error; 
      }
    },

    async fetchUser() {
      if (!this.token) return;
      try {
        const response = await apiClient.get('/auth/me'); 
        this.user = response.data;
      } catch (error) {
        console.error('Erro ao buscar dados do usuário:', error);
        // O interceptor (em api.js) vai tratar o 401 (token expirado)
        // Se o erro não for 401, ele cairá aqui.
      }
    },

    /**
     * NOVO: Action para atualizar o token usando o refreshToken
     */
    async handleRefreshToken() {
      // Se já existe uma promessa de refresh, retorna ela
      // Isso evita a condição de corrida (race condition)
      if (isRefreshingPromise) {
        return isRefreshingPromise;
      }

      // Trava a fila de refresh
      isRefreshingPromise = (async () => {
        const storedRefreshToken = this.refreshToken || localStorage.getItem('refreshToken');
        if (!storedRefreshToken) {
          this.logout();
          throw new Error("Nenhum refresh token disponível.");
        }

        try {
          // 1. Chama o endpoint /auth/refresh
          // ATENÇÃO: Assumindo que seu backend espera o REFRESH token
          // no header de autorização para esta rota específica.
          const response = await apiClient.get('/auth/refresh', {
            headers: {
              'Authorization': `Bearer ${storedRefreshToken}`
            }
          });

          // 2. Pega os NOVOS tokens da resposta
          const { token: newToken, refreshToken: newRefreshToken } = response.data;

          // 3. Salva os novos tokens no state e localStorage
          this.token = newToken;
          this.refreshToken = newRefreshToken;
          this.isLoggedIn = true;
          
          localStorage.setItem('token', newToken);
          localStorage.setItem('refreshToken', newRefreshToken);

          // 4. Atualiza o header PADRÃO do apiClient para o NOVO token
          apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

          return { token: newToken }; // Retorna o novo token

        } catch (error) {
          console.error("Falha ao atualizar o token:", error);
          // Se o refresh token falhar (ex: também expirou), desloga tudo.
          this.logout();
          throw error; // Propaga o erro
        } finally {
          // Libera a trava, permitindo futuros refreshes
          isRefreshingPromise = null;
        }
      })();
      
      return isRefreshingPromise;
    },

    /**
     * Limpa a sessão do usuário
     */
    logout() {
      this.token = null;
      this.refreshToken = null;
      this.user = null;
      this.isLoggedIn = false;

      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      
      delete apiClient.defaults.headers.common['Authorization'];
      
      // Redireciona para o login para garantir que o estado reativo
      // de toda a aplicação seja reiniciado.
      window.location.href = '/login';
    }
  }
});