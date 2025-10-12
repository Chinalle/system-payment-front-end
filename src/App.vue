<template>
  <div id="app" class="flex">
    <Background />

    <div v-if="!['/login', '/register'].includes($route.path)" class="flex flex-1">
      <aside class="fixed top-0 left-0 h-full w-16 bg-gray-900/95 backdrop-blur border-r border-white/10 flex flex-col items-center py-4 z-20">
        <button class="p-2 rounded-lg hover:bg-gray-800 transition-colors duration-300">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
        <nav class="flex flex-col gap-4 mt-6 w-full items-center">
            <router-link to="/" class="p-2 rounded-lg transition-all duration-300 flex items-center justify-center" :class="$route.path === '/' ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'">
                <HomeIcon class="h-5 w-5" />
            </router-link>
            <router-link to="/login" class="p-2 rounded-lg transition-all duration-300 flex items-center justify-center" :class="$route.path === '/login' ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'">
                <UserIcon class="h-5 w-5" />
            </router-link>
            <router-link to="/providers" class="p-2 rounded-lg transition-all duration-300 flex items-center justify-center" :class="$route.path === '/providers' ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'">
                <BriefcaseIcon class="h-5 w-5" />
            </router-link>
            <router-link to="/finance" class="p-2 rounded-lg transition-all duration-300 flex items-center justify-center" :class="$route.path === '/finance' ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'">
                <BookIcon class="h-5 w-5" />
            </router-link>
            <router-link to="/agenda" class="p-2 rounded-lg transition-all duration-300 flex items-center justify-center" :class="$route.path === '/agenda' ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white'">
                <CalendarIcon class="h-5 w-5" />
            </router-link>
        </nav>
        <div class="flex-1"></div>
        <button @click="toggleSettings" :class="[ 'p-2 rounded-lg transition-all duration-300 mb-4', settingsOpen ? 'bg-blue-600 text-white scale-110 shadow-lg' : 'text-gray-400 hover:bg-gray-800 hover:text-white' ]">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-2.21 0-4 .79-4 2s1.79 2 4 2 4-.79 4-2-1.79-2-4-2zm0 8c2.21 0 4-.79 4-2s-1.79-2-4-2-4 .79-4 2 1.79 2 4 2z" />
            </svg>
        </button>
      </aside>
      <main class="app-content ml-16 flex-1 p-6 transition-colors duration-500 text-gray-200">
        <transition name="fade" mode="out-in">
          <router-view :key="$route.fullPath" />
        </transition>
      </main>
      <Settings :visible="settingsOpen" :theme="theme" :density="density" :showBadges="showBadges" @update:theme="theme = $event" @update:density="density = $event" @update:showBadges="showBadges = $event" @close="settingsOpen = false" />
    </div>

    <div v-else class="w-full min-h-screen flex items-center justify-center">
      <router-view />
    </div>

  </div>
</template>

<script>
import {
  HomeIcon,
  CalendarIcon,
  UserIcon,
  BriefcaseIcon,
  BookIcon,
} from "lucide-vue-next";

import Settings from "@/components/Settings.vue";
import Background from "@/components/background.vue";

export default {
  name: "App",
  components: {
    HomeIcon,
    CalendarIcon,
    UserIcon,
    BriefcaseIcon,
    BookIcon,
    Settings,
    Background,
  },
  data() {
    return {
      settingsOpen: false,
      theme: "dark",
      density: "normal",
      showBadges: true,
    };
  },
  methods: {
    toggleSettings() {
      this.settingsOpen = !this.settingsOpen;
    },
  },
};
</script>