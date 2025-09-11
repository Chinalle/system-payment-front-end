import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    user: { name: 'Marcos', avatar: 'https://i.pravatar.cc/100?img=3' },
    clients: [
      { id: 1, name: 'Alexandra Castro', status: 'VIP', next: 'Hoje, 15:00', service: 'Corte + Barba' },
      { id: 2, name: 'Pedro Nunes', status: 'Novo', next: 'Hoje, 16:30', service: 'Massagem' },
      { id: 3, name: 'Giovana Lima', status: 'Atrasado', next: 'Amanhã, 10:00', service: 'Limpeza de pele' },
      { id: 4, name: 'Vitor Souza', status: 'Frequente', next: 'Amanhã, 11:00', service: 'Depilação' }
    ],
    providers: [
      { id: 1, name: 'Renata Castro', role: 'Estética Facial', online: true },
      { id: 2, name: 'Ana Luísa', role: 'Manicure', online: false },
      { id: 3, name: 'Bruno Alves', role: 'Massoterapeuta', online: true },
      { id: 4, name: 'Carlos Lima', role: 'Cabeleireiro', online: true }
    ],
    metrics: {
      revenue: 918,
      expenses: 706,
      conversion: 3.35
    }
  }),
})
