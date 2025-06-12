<template>
  <div class="football-field-bg rounded-lg shadow-lg border-2 border-white overflow-hidden relative">
    <!-- Campo de futebol - linhas decorativas -->
    <div class="absolute inset-0 pointer-events-none">
      <!-- Linha central horizontal -->
      <div class="absolute top-1/2 left-0 right-0 h-0.5 bg-white/50 transform -translate-y-1/2"></div>
      <!-- Círculo central -->
      <div class="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-white/40 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
      <!-- Linhas verticais sutis -->
      <div class="absolute top-0 bottom-0 left-1/4 w-0.5 bg-white/30"></div>
      <div class="absolute top-0 bottom-0 right-1/4 w-0.5 bg-white/30"></div>
      <!-- Pequenas áreas nos cantos -->
      <div class="absolute top-2 left-2 w-8 h-8 border-l-2 border-t-2 border-white/25"></div>
      <div class="absolute top-2 right-2 w-8 h-8 border-r-2 border-t-2 border-white/25"></div>
    </div>
    
    <!-- Header -->
    <div class="bg-gradient-to-r from-green-600 to-blue-600 text-white p-4 relative z-10">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 00-2-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2z" />
          </svg>
          <h3 class="text-lg font-bold">⚽ Brasileirão Série A</h3>
        </div>
        <span class="bg-white/20 px-2 py-1 rounded-full text-xs font-medium">
          Predições Inteligentes
        </span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="p-6 relative z-10">
      <div class="flex items-center justify-center space-x-2">
        <div class="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-green-600"></div>
        <span class="text-gray-600">Carregando predições...</span>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="p-6 relative z-10">
      <div class="text-center text-red-600">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p class="text-sm">Erro ao carregar predições</p>
      </div>
    </div>

    <!-- Predictions Content -->
    <div v-else-if="topPredictions.length > 0" class="p-4 space-y-4 relative z-10">
      <div v-for="(prediction, index) in topPredictions.slice(0, maxPredictions)" :key="index" class="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
        <!-- Match Header -->
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center space-x-3">
            <div class="text-center">
              <div class="text-sm font-bold text-gray-800">{{ prediction.homeTeam }}</div>
              <div class="text-xs text-gray-500">Casa</div>
            </div>
            <div class="flex flex-col items-center">
              <span class="text-lg font-bold text-gray-600">VS</span>
              <div v-if="prediction.matchDate" class="text-xs text-gray-400 mt-1">
                {{ formatMatchDate(prediction.matchDate) }}
              </div>
            </div>
            <div class="text-center">
              <div class="text-sm font-bold text-gray-800">{{ prediction.awayTeam }}</div>
              <div class="text-xs text-gray-500">Fora</div>
            </div>
          </div>
          <div class="text-right">
            <div class="text-xs text-gray-500">Confiança</div>
            <div class="text-lg font-bold text-green-600">{{ prediction.choice }}%</div>
          </div>
        </div>

        <!-- Prediction Details -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
          <div class="text-center bg-gray-50 rounded p-2">
            <div class="text-xs text-gray-500">Resultado</div>
            <div class="font-semibold text-blue-600">{{ getResultLabel(prediction.result) }}</div>
          </div>
          <div class="text-center bg-gray-50 rounded p-2">
            <div class="text-xs text-gray-500">Melhor Pick</div>
            <div class="font-semibold text-purple-600 text-xs">{{ getPickLabel(prediction.pick) }}</div>
          </div>
          <div class="text-center bg-gray-50 rounded p-2">
            <div class="text-xs text-gray-500">Ambas Marcam</div>
            <div class="font-semibold text-orange-600">{{ prediction.gg }}%</div>
          </div>
          <div class="text-center bg-gray-50 rounded p-2">
            <div class="text-xs text-gray-500">+2.5 Gols</div>
            <div class="font-semibold text-red-600">{{ prediction.ov25 }}%</div>
          </div>
        </div>

        <!-- Progress bars for key metrics -->
        <div class="space-y-2">
          <div class="flex items-center justify-between text-xs">
            <span class="text-gray-600">Mais de 1.5 Gols</span>
            <span class="font-semibold">{{ prediction.ov15 }}%</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div 
              class="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full transition-all duration-300"
              :style="{ width: `${prediction.ov15}%` }"
            ></div>
          </div>
        </div>
      </div>

      <!-- Footer with disclaimer -->
      <div class="text-center py-2 border-t border-white/30">
        <p class="text-xs text-white/90">
          📊 Predições baseadas em análise estatística • Jogue com responsabilidade
        </p>
        <div class="flex items-center justify-center space-x-4 mt-2 text-xs text-white/80">
          <span>🎯 Acurácia média: 72%</span>
          <span>•</span>
          <span>⚡ Atualizado em tempo real</span>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="p-6 text-center relative z-10">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
      </svg>
      <p class="text-gray-600 text-sm">Nenhuma predição disponível no momento</p>
      <p class="text-gray-400 text-xs mt-1">Volte mais tarde para novas análises</p>
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
  getResultLabel,
  getPickLabel,
  formatMatchDate
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
/* Campo de futebol - fundo verde escuro realista */
.football-field-bg {
  background: linear-gradient(135deg, #22c55e 0%, #15803d 100%) !important;
  background-color: #16a34a !important;
}

/* Estilo adicional para animações suaves */
.transition-all {
  transition: all 0.3s ease;
}

/* Estilo para os cards de predição */
.bg-gradient-to-br {
  background-image: linear-gradient(to bottom right, var(--tw-gradient-stops));
}

.bg-gradient-to-r {
  background-image: linear-gradient(to right, var(--tw-gradient-stops));
}

/* Hover effects */
.bg-white:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transform: translateY(-1px);
}

/* Responsive adjustments */
@media (max-width: 640px) {
  .grid-cols-4 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* Garantir que o fundo verde seja mantido */
.football-field-bg::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #22c55e 0%, #15803d 100%);
  z-index: 1;
}

/* Garantir que o conteúdo fique acima do fundo */
.football-field-bg > * {
  position: relative;
  z-index: 2;
}
</style> 