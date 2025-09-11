<template>
  <div class="container-grid">
    <!-- Coluna 1: Clientes -->
    <section class="space-y-6">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Clientes</h3>
          <button class="text-xs px-2 py-1 rounded-lg bg-primary/20 border border-primary/30">+ Adicionar</button>
        </div>
        <div class="grid gap-3">
          <div
            v-for="c in clients"
            :key="c.id"
            class="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl px-3 py-2"
          >
            <div class="flex items-center gap-3">
              <img :src="'https://i.pravatar.cc/100?u='+c.name" class="w-8 h-8 rounded-full" />
              <div>
                <div class="text-sm font-medium">{{ c.name }}</div>
                <div class="text-xs text-gray-400">{{ c.service }}</div>
              </div>
            </div>
            <div class="flex items-center gap-2">
              <span class="badge border-primary/30 text-primary">{{ c.status }}</span>
              <span class="text-xs text-gray-400">{{ c.next }}</span>
            </div>
          </div>
        </div>
      </div>

      <CalendarCard />

      <ListCard
        title="Hoje"
        :items="clients.map(c => ({ id: c.id, name: c.name, meta: c.service + ' • ' + c.next, pill: 'Agendado' }))"
      />
    </section>

    <!-- Coluna 2: Prestadores -->
    <section class="space-y-6">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Prestadores</h3>
          <button class="text-xs px-2 py-1 rounded-lg bg-white/5 border border-white/5">Convites</button>
        </div>
        <div class="space-y-3">
          <div v-for="p in providers" :key="p.id" class="flex items-center justify-between bg-white/5 border border-white/5 rounded-xl p-3">
            <div class="flex items-center gap-3">
              <img :src="'https://i.pravatar.cc/100?u='+p.name" class="w-9 h-9 rounded-full" />
              <div>
                <div class="text-sm font-medium">{{ p.name }}</div>
                <div class="text-xs text-gray-400">{{ p.role }}</div>
              </div>
            </div>
            <span class="badge" :class="p.online ? 'border-green-500/20 text-green-400' : 'border-gray-500/20 text-gray-400'">
              {{ p.online ? 'Online' : 'Offline' }}
            </span>
          </div>
        </div>
      </div>

      <ListCard
        title="Solicitações Recentes"
        :items="[
          { id: 1, name: 'Samuel Freitas', meta: 'Corte Masculino', pill: 'Aguardando' },
          { id: 2, name: 'Lívia Santos', meta: 'Sobrancelhas', pill: 'Confirmado' },
          { id: 3, name: 'Monalisa', meta: 'Massagem Relaxante', pill: 'Pendente' }
        ]"
      />
    </section>

    <!-- Coluna 3: Back-Office -->
    <section class="space-y-6">
      <div class="card">
        <div class="card-header">
          <h3 class="card-title">Back-Office</h3>
          <div class="text-sm text-gray-400">Sistemas</div>
        </div>
        <div class="grid grid-cols-3 gap-3">
          <StatCard title="Receita" :value="'R$ ' + metrics.revenue" subtitle="semana" trend="+12%" :positive="true" />
          <StatCard title="Despesas" :value="'R$ ' + metrics.expenses" subtitle="semana" trend="-4%" :positive="false" />
          <StatCard title="Conversão" :value="(metrics.conversion*100).toFixed(1) + '%'" subtitle="30 dias" trend="+2%" :positive="true" />
        </div>
      </div>

      <LineChartCard title="Relatório Diário" />
      <DoughnutChartCard title="Meios de Pagamento" />
      <BarChartCard title="Desempenho por Mês" />
    </section>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'

import CalendarCard from '../components/CalendarCard.vue'
import ListCard from '../components/ListCard.vue'
import StatCard from '../components/StatCard.vue'
import LineChartCard from '../components/LineChartCard.vue'
import DoughnutChartCard from '../components/DoughnutChartCard.vue'
import BarChartCard from '../components/BarChartCard.vue'

const store = useAppStore()
const { clients, providers, metrics } = storeToRefs(store)
</script>
