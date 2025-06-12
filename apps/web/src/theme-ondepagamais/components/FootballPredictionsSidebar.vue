<template>
  <div class="football-field-bg-compact rounded-lg shadow-lg border-2 border-white overflow-hidden relative">
    <!-- Campo de futebol - linhas decorativas compactas -->
    <div class="absolute inset-0 pointer-events-none">
      <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-white/40 transform -translate-y-1/2"></div>
      <div class="absolute top-1/2 left-1/2 w-12 h-12 border border-white/30 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
    </div>
    
    <!-- Header compacto -->
    <div class="bg-gradient-to-r from-green-600 to-blue-600 text-white p-3 relative z-10">
      <div class="text-center">
        <h3 class="text-sm font-bold">⚽ Brasileirão</h3>
        <span class="text-xs opacity-80">Predições</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-4 relative z-10">
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-green-600"></div>
        <span class="ml-2 text-xs text-gray-600">Carregando...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-4 relative z-10">
      <div class="text-center text-red-600">
        <p class="text-xs">Erro ao carregar</p>
      </div>
    </div>

    <!-- Predictions Content compacto -->
    <div v-else-if="topPredictions.length > 0" class="p-3 space-y-3 relative z-10">
      <div v-for="(prediction, index) in topPredictions.slice(0, maxPredictions)" :key="index" class="bg-white rounded-lg p-3 shadow-sm border border-gray-100">
        <!-- Match Header compacto -->
        <div class="text-center mb-2">
          <div class="text-xs font-bold text-gray-800">{{ prediction.homeTeam }}</div>
          <div class="text-xs text-gray-500 my-1">VS</div>
          <div class="text-xs font-bold text-gray-800">{{ prediction.awayTeam }}</div>
          <div class="text-right mt-2">
            <div class="text-xs text-gray-500">Confiança</div>
            <div class="text-sm font-bold text-green-600">{{ prediction.choice }}%</div>
          </div>
        </div>

        <!-- Prediction Details compacto -->
        <div class="grid grid-cols-2 gap-2 mb-2">
          <div class="text-center bg-gray-50 rounded p-1">
            <div class="text-xs text-gray-500">Resultado</div>
            <div class="text-xs font-semibold text-blue-600">{{ getResultLabel(prediction.result) }}</div>
          </div>
          <div class="text-center bg-gray-50 rounded p-1">
            <div class="text-xs text-gray-500">Ambas Marcam</div>
            <div class="text-xs font-semibold text-orange-600">{{ prediction.gg }}%</div>
          </div>
        </div>

        <!-- Progress bar compacto -->
        <div class="space-y-1">
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-600">+1.5 Gols</span>
            <span class="font-semibold">{{ prediction.ov15 }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-1">
            <div 
              class="bg-gradient-to-r from-blue-500 to-green-500 h-1 rounded-full transition-all duration-300"
              :style="{ width: `${prediction.ov15}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Footer compacto -->
      <div class="text-center py-2 border-t border-white/30">
        <p class="text-xs text-white/90">
          📊 Análise estatística
        </p>
        <div class="text-xs text-white/80 mt-1">
          🎯 Acurácia: 72%
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="p-4 text-center relative z-10">
      <p class="text-white/90 text-xs">Sem predições</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useFootballPredictions } from '../composables/useFootballPredictions';

interface Props {
  enableApi?: boolean;
  apiUrl?: string;
  apiPassword?: string;
  maxPredictions?: number;
}

const props = withDefaults(defineProps<Props>(), {
  enableApi: false,
  apiUrl: 'https://smartbetsapi.onrender.com',
  apiPassword: '',
  maxPredictions: 2
});

const {
  loading,
  error,
  topPredictions,
  loadPredictions,
  getResultLabel
} = useFootballPredictions({
  enablePredictions: props.enableApi,
  apiUrl: props.apiUrl,
  apiPassword: props.apiPassword,
  competition: 'Campeonato Brasileiro Série A'
});

onMounted(() => {
  loadPredictions();
});
</script>

<style scoped>
/* Campo de futebol compacto */
.football-field-bg-compact {
  background: linear-gradient(135deg, #22c55e 0%, #15803d 100%) !important;
  background-color: #16a34a !important;
}

.football-field-bg-compact::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);
  z-index: 1;
}

.football-field-bg-compact > * {
  position: relative;
  z-index: 2;
}

.transition-all {
  transition: all 0.3s ease;
}
</style> 