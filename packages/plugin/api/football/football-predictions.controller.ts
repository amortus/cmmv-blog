import { Controller, Post, Body } from '@cmmv/http';
import { FootballPredictionsService } from './football-predictions.service';

interface PredictionsRequest {
    apiUrl: string;
    apiPassword: string;
    competition?: string;
    intervalHours?: number;
    limit?: number;
}

@Controller('football-predictions')
export class FootballPredictionsController {
    constructor(
        private readonly footballPredictionsService: FootballPredictionsService
    ) {}

    @Post()
    async getPredictions(@Body() body: PredictionsRequest): Promise<any> {
        try {
            const {
                apiUrl,
                apiPassword,
                competition = 'Campeonato Brasileiro Série A',
                intervalHours = 6,
                limit = 10
            } = body;

            if (!apiUrl || !apiPassword) {
                return {
                    success: false,
                    message: 'API URL and password are required',
                    predictions: []
                };
            }

            const predictions = await this.footballPredictionsService.getPredictionsWithCache(
                apiUrl,
                apiPassword,
                competition,
                intervalHours,
                limit
            );

            return {
                success: true,
                predictions,
                count: predictions.length,
                cached: !this.footballPredictionsService.shouldUpdateCache(competition, intervalHours)
            };

        } catch (error) {
            console.error('Error in football predictions controller:', error);
            return {
                success: false,
                message: 'Internal server error',
                predictions: []
            };
        }
    }

    @Post('clear-cache')
    async clearCache(@Body() body: { competition?: string }): Promise<any> {
        try {
            this.footballPredictionsService.clearCache(body.competition);
            return {
                success: true,
                message: 'Cache cleared successfully'
            };
        } catch (error) {
            console.error('Error clearing cache:', error);
            return {
                success: false,
                message: 'Failed to clear cache'
            };
        }
    }
} 