import { Service, Logger } from '@cmmv/core';

interface FootballPrediction {
    competition: string;
    homeTeam: string;
    awayTeam: string;
    matchDate?: Date;
    choice?: number;
    result?: string;
    pick?: string;
    gg?: number;
    ov15?: number;
    ov25?: number;
    un15?: number;
    un25?: number;
    rawApiData?: string;
    lastUpdated?: Date;
}

@Service('football_predictions')
export class FootballPredictionsService {
    private logger = new Logger('FootballPredictionsService');
    private cache: Map<string, { data: FootballPrediction[], timestamp: number }> = new Map();

    async fetchFromApi(
        apiUrl: string, 
        apiPassword: string, 
        competition: string = 'Campeonato Brasileiro Série A'
    ): Promise<FootballPrediction[]> {
        try {
            this.logger.log(`Fetching predictions from API: ${apiUrl}`);
            
            // Create AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    password: apiPassword,
                    competition: competition
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            this.logger.log(`API Response received, processing data...`);

            // Handle both direct array response and wrapped response
            let predictionsArray = data;
            if (data.predictions && Array.isArray(data.predictions)) {
                predictionsArray = data.predictions;
            } else if (!Array.isArray(data)) {
                this.logger.log('No predictions found in API response');
                return [];
            }

            const predictions: FootballPrediction[] = predictionsArray.map((prediction: any) => ({
                competition: competition,
                homeTeam: prediction.homeTeam || prediction.home_team || '',
                awayTeam: prediction.awayTeam || prediction.away_team || '',
                matchDate: prediction.matchDate ? new Date(prediction.matchDate) : undefined,
                choice: prediction.choice ? parseFloat(prediction.choice) : undefined,
                result: prediction.result || undefined,
                pick: prediction.pick || undefined,
                gg: prediction.gg ? parseFloat(prediction.gg) : undefined,
                ov15: prediction.ov15 ? parseFloat(prediction.ov15) : undefined,
                ov25: prediction.ov25 ? parseFloat(prediction.ov25) : undefined,
                un15: prediction.un15 ? parseFloat(prediction.un15) : undefined,
                un25: prediction.un25 ? parseFloat(prediction.un25) : undefined,
                rawApiData: JSON.stringify(prediction),
                lastUpdated: new Date()
            }));

            // Store in cache
            this.cache.set(competition, {
                data: predictions,
                timestamp: Date.now()
            });

            this.logger.log(`Successfully processed ${predictions.length} predictions`);
            return predictions;

        } catch (error) {
            this.logger.error('Error fetching from API:', error instanceof Error ? error.message : String(error));
            throw error;
        }
    }

    async getCachedPredictions(
        competition: string = 'Campeonato Brasileiro Série A',
        limit: number = 10
    ): Promise<FootballPrediction[]> {
        const cached = this.cache.get(competition);
        if (cached) {
            this.logger.log(`Retrieved ${cached.data.length} cached predictions`);
            return cached.data.slice(0, limit);
        }
        return [];
    }

    async shouldUpdateCache(
        competition: string = 'Campeonato Brasileiro Série A',
        intervalHours: number = 6
    ): Promise<boolean> {
        const cached = this.cache.get(competition);
        if (!cached) {
            this.logger.log('No cached predictions found, update needed');
            return true;
        }

        const now = Date.now();
        const hoursDiff = (now - cached.timestamp) / (1000 * 60 * 60);
        const shouldUpdate = hoursDiff >= intervalHours;
        
        this.logger.log(`Cache age: ${hoursDiff.toFixed(2)} hours, Should update: ${shouldUpdate}`);
        return shouldUpdate;
    }

    async getPredictionsWithCache(
        apiUrl: string,
        apiPassword: string,
        competition: string = 'Campeonato Brasileiro Série A',
        intervalHours: number = 6,
        limit: number = 10
    ): Promise<FootballPrediction[]> {
        try {
            const shouldUpdate = await this.shouldUpdateCache(competition, intervalHours);
            
            if (shouldUpdate && apiUrl && apiPassword) {
                this.logger.log('Cache expired or empty, fetching from API...');
                try {
                    await this.fetchFromApi(apiUrl, apiPassword, competition);
                } catch (apiError) {
                    this.logger.log('API fetch failed, using cached data');
                }
            }

            return await this.getCachedPredictions(competition, limit);

        } catch (error) {
            this.logger.error('Error in getPredictionsWithCache:', error instanceof Error ? error.message : String(error));
            return [];
        }
    }

    clearCache(competition?: string): void {
        if (competition) {
            this.cache.delete(competition);
            this.logger.log(`Cleared cache for competition: ${competition}`);
        } else {
            this.cache.clear();
            this.logger.log('Cleared all cache');
        }
    }
} 