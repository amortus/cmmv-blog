<template>
  <div v-if="enablePredictions" class="football-predictions">


    <div class="predictions-container">
      <div class="predictions-header">
        <h3>⚽ Predições de Futebol</h3>
        <p class="competition-name">{{ competition }}</p>

      </div>



      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Carregando predições...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="loadPredictions" class="retry-button">Tentar Novamente</button>
      </div>

      <div v-else-if="displayPredictions.length > 0" class="predictions-grid">
        <div 
          v-for="(prediction, index) in displayPredictions" 
          :key="`${prediction.homeTeam}-${prediction.awayTeam}-${index}`"
          class="prediction-card"
        >
          <div class="match-info">
            <div class="teams">
              <span class="home-team">{{ prediction.homeTeam }}</span>
              <span class="vs">vs</span>
              <span class="away-team">{{ prediction.awayTeam }}</span>
            </div>
            <div v-if="prediction.matchDate" class="match-date">
              {{ formatMatchDate(prediction.matchDate) }}
            </div>
          </div>

          <div class="prediction-details">
            <div class="main-prediction">
              <span class="prediction-label">{{ getPickLabel(prediction.pick) }}</span>
              <span class="prediction-result">{{ getResultLabel(prediction.result) }}</span>
              <span class="confidence">{{ prediction.choice }}%</span>
            </div>

            <div class="additional-stats">
              <div class="stat">
                <span class="stat-label">Ambas Marcam</span>
                <span class="stat-value">{{ prediction.gg }}%</span>
              </div>
              <div class="stat">
                <span class="stat-label">Mais de 2.5</span>
                <span class="stat-value">{{ prediction.ov25 }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="no-predictions">
        <p>Nenhuma predição disponível no momento.</p>
        <button @click="loadPredictions" class="retry-button">Recarregar</button>
      </div>

      <div class="responsible-gaming">
        <p>⚠️ <strong>Jogo Responsável:</strong> Predições são apenas para entretenimento. Aposte com responsabilidade.</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useFootballPredictions } from '../composables/useFootballPredictions'

const props = defineProps<{
  gamesPerBlock?: number
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
  getPickLabel,
  formatMatchDate,
  enablePredictions,
  isUsingRealApi,
  apiStatus,
  apiUrl,
  competition
} = useFootballPredictions({
  enablePredictions: props.enableApi,
  apiUrl: props.apiUrl,
  apiPassword: props.apiPassword,
  settings: props.settings
})



// Get settings for display
const gamesPerBlock = computed(() => props.maxPredictions || props.gamesPerBlock || 2)

const displayPredictions = computed(() => {
  return predictions.value.slice(0, gamesPerBlock.value)
})



onMounted(() => {
  // Only load predictions on client-side to avoid SSR issues
  if (enablePredictions.value && typeof window !== 'undefined') {
    loadPredictions()
  }
})
</script>

<style scoped>
.football-predictions {
  margin: 2rem 0;
  position: relative;
}



.predictions-container {
  background: linear-gradient(135deg, #2d5a27 0%, #4a7c59 50%, #2d5a27 100%);
  border: 3px solid #ffffff;
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
}

/* Football field styling */
.predictions-container::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80px;
  height: 80px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  pointer-events: none;
}

.predictions-container::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 2px;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
  pointer-events: none;
}

.predictions-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  border-radius: 8px;
  color: white;
}

.predictions-header h3 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: bold;
}

.competition-name {
  margin: 0;
  font-size: 0.875rem;
  opacity: 0.9;
}





.loading-state, .error-state, .no-predictions {
  text-align: center;
  padding: 2rem;
  color: white;
  position: relative;
  z-index: 2;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.3);
  border-top: 4px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.predictions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  position: relative;
  z-index: 2;
}

.prediction-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 8px;
  padding: 1rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.prediction-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.match-info {
  margin-bottom: 1rem;
}

.teams {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.home-team, .away-team {
  font-weight: bold;
  color: #2d5a27;
}

.vs {
  color: #666;
  font-size: 0.9rem;
}

.match-date {
  text-align: center;
  color: #666;
  font-size: 0.8rem;
}

.prediction-details {
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.main-prediction {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.prediction-label {
  font-size: 0.9rem;
  color: #666;
}

.prediction-result {
  font-weight: bold;
  color: #2d5a27;
}

.confidence {
  background: #4CAF50;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: bold;
}

.additional-stats {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.stat {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
}

.stat-label {
  font-size: 0.8rem;
  color: #666;
}

.stat-value {
  font-weight: bold;
  color: #2d5a27;
  font-size: 0.9rem;
}

.retry-button {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  margin-top: 1rem;
}

.retry-button:hover {
  background: #45a049;
}

.responsible-gaming {
  margin-top: 1.5rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  text-align: center;
  position: relative;
  z-index: 2;
}

.responsible-gaming p {
  margin: 0;
  font-size: 0.9rem;
  color: #d32f2f;
}

/* Mobile responsiveness */
@media (max-width: 768px) {
  .predictions-container {
    padding: 1rem;
  }
  
  .predictions-grid {
    grid-template-columns: 1fr;
  }
  
  .debug-panel {
    position: fixed;
    top: 10px;
    left: 10px;
    right: 10px;
    max-width: none;
  }
}
</style> 