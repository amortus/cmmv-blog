<template>
  <div v-if="enablePredictions && enableSidebar" class="football-sidebar">
    <div class="sidebar-header">
      <h4>⚽ Predições</h4>
    </div>

    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <p>Carregando...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <p>Erro ao carregar</p>
      <button @click="loadPredictions" class="retry-btn">↻</button>
    </div>

    <div v-else-if="sidebarPredictions.length > 0" class="predictions-list">
      <div 
        v-for="(prediction, index) in sidebarPredictions" 
        :key="`sidebar-${prediction.homeTeam}-${prediction.awayTeam}-${index}`"
        class="prediction-item"
      >
        <div class="match">
          <div class="teams">
            <span class="team">{{ prediction.homeTeam }}</span>
            <span class="vs">vs</span>
            <span class="team">{{ prediction.awayTeam }}</span>
          </div>
        </div>
        
        <div class="prediction">
          <span class="result">{{ getResultLabel(prediction.result) }}</span>
          <span class="confidence">{{ prediction.choice }}%</span>
        </div>
      </div>
    </div>

    <div v-else class="no-predictions">
      <p>Sem predições</p>
      <button @click="loadPredictions" class="retry-btn">↻</button>
    </div>

    <div class="disclaimer">
      <p>⚠️ Apenas entretenimento</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useFootballPredictions } from '../composables/useFootballPredictions'

const props = defineProps<{
  numberOfCards?: number
  enableApi?: boolean
  apiUrl?: string
  apiPassword?: string
  maxPredictions?: number
  settings?: Record<string, any>
}>()

const {
  loading,
  error,
  predictions,
  loadPredictions,
  getResultLabel,
  enablePredictions,
  isUsingRealApi,
  apiStatus
} = useFootballPredictions({
  enablePredictions: props.enableApi,
  apiUrl: props.apiUrl,
  apiPassword: props.apiPassword,
  settings: props.settings
})

const enableSidebar = computed(() => {
  return props.enableApi ?? true
})

const numberOfCards = computed(() => props.maxPredictions || props.numberOfCards || 3)

const sidebarPredictions = computed(() => {
  return predictions.value.slice(0, numberOfCards.value)
})

onMounted(() => {
  // Only load predictions on client-side to avoid SSR issues
  if (enablePredictions.value && enableSidebar.value && typeof window !== 'undefined') {
    // Add a small delay to ensure the component is fully mounted
    setTimeout(() => {
      loadPredictions()
    }, 150)
  }
})
</script>

<style scoped>
.football-sidebar {
  background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 50%, #2d5a27 100%);
  border: 2px solid #ffffff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  position: relative;
  overflow: hidden;
}

/* Mini football field effect */
.football-sidebar::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 40px;
  height: 40px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50%;
  pointer-events: none;
}

.sidebar-header {
  text-align: center;
  margin-bottom: 1rem;
  position: relative;
  z-index: 2;
}

.sidebar-header h4 {
  color: white;
  margin: 0;
  font-size: 1.1rem;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.loading-state, .error-state, .no-predictions {
  text-align: center;
  padding: 1rem;
  color: white;
  position: relative;
  z-index: 2;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.predictions-list {
  position: relative;
  z-index: 2;
}

.prediction-item {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 6px;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  transition: transform 0.2s ease;
}

.prediction-item:hover {
  transform: translateY(-1px);
}

.prediction-item:last-child {
  margin-bottom: 0;
}

.match {
  margin-bottom: 0.5rem;
}

.teams {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.25rem;
  flex-wrap: wrap;
}

.team {
  font-weight: bold;
  color: #2d5a27;
  font-size: 0.8rem;
  text-align: center;
}

.vs {
  color: #666;
  font-size: 0.7rem;
}

.prediction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 0.5rem;
  border-top: 1px solid #eee;
}

.result {
  font-weight: bold;
  color: #2d5a27;
  font-size: 0.8rem;
}

.confidence {
  background: #4CAF50;
  color: white;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-size: 0.7rem;
  font-weight: bold;
}

.retry-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.25rem 0.5rem;
  border-radius: 3px;
  cursor: pointer;
  font-size: 0.8rem;
  margin-top: 0.5rem;
}

.retry-btn:hover {
  background: #45a049;
}

.disclaimer {
  margin-top: 1rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 6px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.disclaimer p {
  margin: 0;
  font-size: 0.7rem;
  color: #d32f2f;
}

/* Mobile adjustments */
@media (max-width: 768px) {
  .football-sidebar {
    padding: 0.75rem;
  }
  
  .teams {
    font-size: 0.75rem;
  }
  
  .team {
    font-size: 0.75rem;
  }
}
</style> 