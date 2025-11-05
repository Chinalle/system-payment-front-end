// src/data/mockData.js
// Este ficheiro simula a sua base de dados.
// No futuro, você pode trocar as funções que usam isto por chamadas de API.

export const mockUsers = [
  { 
    id: 'provider1', 
    role: 'provider', 
    name: 'Barbearia do Zé', 
    location: 'Centro, São Paulo', 
    bio: 'Especialistas em corte clássico e moderno. Atendemos há 10 anos no mesmo local.',
    avatar: 'https://placehold.co/100x100/1e293b/ffffff?text=BZ' 
  },
  { 
    id: 'provider2', 
    role: 'provider', 
    name: 'Estética da Maria', 
    location: 'Copacabana, Rio de Janeiro',
    bio: 'Tratamentos faciais e corporais com os melhores produtos do mercado.',
    avatar: 'https://placehold.co/100x100/1e293b/ffffff?text=EM'
  },
  { 
    id: 'user1', 
    role: 'client', 
    name: 'Cliente Fictício',
    avatar: 'https://placehold.co/100x100/1e293b/ffffff?text=CF'
  },
];

export const mockServices = [
  { id: 'svc1', providerId: 'provider1', name: 'Corte de Cabelo', category: 'Cabelo', price: 50, duration: '30min' },
  { id: 'svc2', providerId: 'provider1', name: 'Barba Tradicional', category: 'Barba', price: 30, duration: '30min' },
  { id: 'svc3', providerId: 'provider2', name: 'Limpeza de Pele', category: 'Estética', price: 90, duration: '45min' },
  { id: 'svc4', providerId: 'provider2', name: 'Manicure', category: 'Unhas', price: 40, duration: '40min' },
  { id: 'svc5', providerId: 'provider2', name: 'Massagem Relaxante', category: 'Massagem', price: 120, duration: '60min' },
];

export const mockBookings = [
  // Agendamentos do Cliente Fictício
  { id: 'book1', clientId: 'user1', providerId: 'provider1', serviceId: 'svc1', date: '2025-11-10', time: '14:00', status: 'confirmed' },
  // Agendamentos da Barbearia do Zé
  { id: 'book2', clientId: 'user-random', providerId: 'provider1', serviceId: 'svc2', date: '2025-11-10', time: '15:00', status: 'confirmed' },
];
