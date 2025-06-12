import { ref, computed } from 'vue';

export interface FootballPrediction {
  homeTeam: string;
  awayTeam: string;
  g: number; // Goal average
  gg: number; // Both teams to score probability
  ov15: number; // Over 1.5 goals probability
  ov25: number; // Over 2.5 goals probability
  ov35: number; // Over 3.5 goals probability
  choice: number; // Main prediction probability
  result: string; // Result prediction (1, X, 2, etc.)
  pick: string; // Best pick recommendation
  matchDate?: string;
  competition?: string;
}

export interface FootballMatch {
  homeTeam: string;
  awayTeam: string;
  matchDate: string;
  competition: string;
  venue?: string;
}

export interface UseFootballPredictionsOptions {
  apiUrl?: string;
  apiPassword?: string;
  enablePredictions?: boolean;
  competition?: string;
}

export function useFootballPredictions(options: UseFootballPredictionsOptions = {}) {
  const predictions = ref<FootballPrediction[]>([]);
  const matches = ref<FootballMatch[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const {
    apiUrl = 'https://smartbetsapi.onrender.com',
    apiPassword,
    enablePredictions = false,
    competition = 'Campeonato Brasileiro Série A'
  } = options;

  // Mock data for Brazilian Championship Serie A teams
  const brasileiraoTeams = [
    'Flamengo', 'Palmeiras', 'São Paulo', 'Corinthians', 'Santos', 'Grêmio',
    'Internacional', 'Atlético-MG', 'Cruzeiro', 'Botafogo', 'Vasco da Gama',
    'Fluminense', 'Athletico-PR', 'Coritiba', 'Fortaleza', 'Ceará',
    'Bahia', 'Vitória', 'Goiás', 'América-MG'
  ];

  // Generate mock matches for demonstration
  const generateMockMatches = (): FootballMatch[] => {
    const mockMatches: FootballMatch[] = [];
    const today = new Date();
    
    for (let i = 0; i < 6; i++) {
      const matchDate = new Date(today);
      matchDate.setDate(today.getDate() + i);
      
      const homeTeam = brasileiraoTeams[Math.floor(Math.random() * brasileiraoTeams.length)];
      let awayTeam = brasileiraoTeams[Math.floor(Math.random() * brasileiraoTeams.length)];
      
      // Ensure home and away teams are different
      while (awayTeam === homeTeam) {
        awayTeam = brasileiraoTeams[Math.floor(Math.random() * brasileiraoTeams.length)];
      }
      
      mockMatches.push({
        homeTeam,
        awayTeam,
        matchDate: matchDate.toISOString(),
        competition,
        venue: `Estádio ${homeTeam}`
      });
    }
    
    return mockMatches;
  };

  // Generate mock predictions based on team names
  const generateMockPrediction = (match: FootballMatch): FootballPrediction => {
    // Simple algorithm to generate realistic predictions
    const homeStrength = Math.random() * 100;
    const awayStrength = Math.random() * 100;
    
    const totalStrength = homeStrength + awayStrength;
    const homeWinProb = (homeStrength / totalStrength) * 100;
    const awayWinProb = (awayStrength / totalStrength) * 100;
    const drawProb = 100 - homeWinProb - awayWinProb;
    
    let result = '1'; // Home win
    if (awayWinProb > homeWinProb && awayWinProb > drawProb) {
      result = '2'; // Away win
    } else if (drawProb > homeWinProb && drawProb > awayWinProb) {
      result = 'X'; // Draw
    }
    
    const gg = Math.random() * 40 + 40; // 40-80%
    const ov15 = Math.random() * 30 + 60; // 60-90%
    const ov25 = Math.random() * 40 + 30; // 30-70%
    const ov35 = Math.random() * 30 + 15; // 15-45%
    
    // Determine best pick
    const picks = [
      { name: 'gg', value: gg },
      { name: 'ov15', value: ov15 },
      { name: 'ov25', value: ov25 },
      { name: result, value: Math.max(homeWinProb, awayWinProb, drawProb) }
    ];
    
    const bestPick = picks.reduce((prev, current) => 
      prev.value > current.value ? prev : current
    );
    
    return {
      homeTeam: match.homeTeam,
      awayTeam: match.awayTeam,
      g: Math.random() * 8 + 2, // 2-10 goals average
      gg: Math.round(gg),
      ov15: Math.round(ov15),
      ov25: Math.round(ov25),
      ov35: Math.round(ov35),
      choice: Math.round(Math.max(homeWinProb, awayWinProb, drawProb)),
      result,
      pick: bestPick.name,
      matchDate: match.matchDate,
      competition: match.competition
    };
  };

  const fetchPredictionsFromAPI = async (homeTeam: string, awayTeam: string): Promise<FootballPrediction | null> => {
    if (!apiPassword || !enablePredictions) {
      return null;
    }

    try {
      const response = await fetch(`${apiUrl}/v1/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiPassword}`
        },
        body: JSON.stringify({
          home_team: homeTeam,
          away_team: awayTeam
        })
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      
      return {
        homeTeam,
        awayTeam,
        g: data.g || 0,
        gg: data.gg || 0,
        ov15: data.ov15 || 0,
        ov25: data.ov25 || 0,
        ov35: data.ov35 || 0,
        choice: data.choice || 0,
        result: data.result || '1',
        pick: data.pick || 'ov15',
        competition
      };
    } catch (err) {
      console.error('Error fetching prediction from API:', err);
      return null;
    }
  };

  const loadPredictions = async (): Promise<void> => {
    if (loading.value) return;

    try {
      loading.value = true;
      error.value = null;

      // Generate or fetch matches
      const currentMatches = generateMockMatches();
      matches.value = currentMatches;

      // Generate predictions for each match
      const predictionPromises = currentMatches.map(async (match) => {
        // Try to fetch from API first, fallback to mock data
        let prediction = await fetchPredictionsFromAPI(match.homeTeam, match.awayTeam);
        
        if (!prediction) {
          prediction = generateMockPrediction(match);
        }
        
        return prediction;
      });

      const results = await Promise.all(predictionPromises);
      predictions.value = results.filter(Boolean) as FootballPrediction[];

    } catch (err: any) {
      console.error('Error loading predictions:', err);
      error.value = err.message || 'Erro ao carregar predições';
    } finally {
      loading.value = false;
    }
  };

  const getResultLabel = (result: string): string => {
    switch (result) {
      case '1': return 'Casa';
      case 'X': return 'Empate';
      case '2': return 'Fora';
      case '1X': return 'Casa/Empate';
      case '2X': return 'Fora/Empate';
      default: return result;
    }
  };

  const getPickLabel = (pick: string): string => {
    switch (pick) {
      case 'gg': return 'Ambas Marcam';
      case 'ov15': return 'Mais de 1.5 Gols';
      case 'ov25': return 'Mais de 2.5 Gols';
      case 'ov35': return 'Mais de 3.5 Gols';
      case '1': return 'Vitória Casa';
      case 'X': return 'Empate';
      case '2': return 'Vitória Fora';
      default: return pick;
    }
  };

  const formatMatchDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Computed properties
  const topPredictions = computed(() => 
    predictions.value
      .filter(p => p.choice >= 60) // Only high confidence predictions
      .sort((a, b) => b.choice - a.choice)
      .slice(0, 2)
  );

  const todayMatches = computed(() => {
    const today = new Date().toDateString();
    return predictions.value.filter(p => 
      p.matchDate && new Date(p.matchDate).toDateString() === today
    );
  });

  return {
    // State
    predictions,
    matches,
    loading,
    error,

    // Methods
    loadPredictions,
    getResultLabel,
    getPickLabel,
    formatMatchDate,

    // Computed
    topPredictions,
    todayMatches,

    // Configuration
    enablePredictions: computed(() => enablePredictions),
    competition: computed(() => competition)
  };
} 