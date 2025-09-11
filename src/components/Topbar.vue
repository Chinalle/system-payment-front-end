<template>
  <header class="sticky top-0 z-10 bg-surface/80 backdrop-blur border-b border-white/5">
    <div class="px-4 py-3 flex items-center justify-between">
      <div class="flex items-center gap-2 xl:hidden">
        <button class="p-2 rounded-lg bg-white/5">☰</button>
        <span class="font-semibold">Dashboardit</span>
      </div>
      <div class="hidden xl:block">
        <div class="relative">
          <input
            class="bg-white/5 rounded-xl px-3 py-2 pl-9 outline-none w-80 border border-white/5 focus:border-primary"
            placeholder="Buscar..."
          />
          <span class="absolute left-3 top-2.5 text-gray-400">🔎</span>
        </div>
      </div>
      <div class="flex items-center gap-3">
        <button class="bg-white/5 px-3 py-2 rounded-xl border border-white/5 hover:bg-white/10 text-sm">+ Evento</button>
        <img :src="user.avatar" class="w-8 h-8 rounded-full" :alt="user.name" />
      </div>
    </div>
  </header>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useAppStore } from '../stores/app'

const { user } = storeToRefs(useAppStore())
</script>
