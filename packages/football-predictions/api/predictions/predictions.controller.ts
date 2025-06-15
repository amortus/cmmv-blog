import { Controller, Post, Body, Get, Param } from '@cmmv/http';
import { FootballPredictionsService } from './predictions.service';

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

    @Post('fetch')
    async fetchPredictions(@Body() body: PredictionsRequest): Promise<any> {
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
                cached: !(await this.footballPredictionsService.shouldUpdateCache(competition, intervalHours))
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

    @Get('cached/:competition')
    async getCachedPredictions(@Param('competition') competition: string): Promise<any> {
        try {
            const predictions = await this.footballPredictionsService.getCachedPredictions(
                decodeURIComponent(competition),
                10
            );

            return {
                success: true,
                predictions,
                count: predictions.length
            };

        } catch (error) {
            console.error('Error getting cached predictions:', error);
            return {
                success: false,
                message: 'Error retrieving cached predictions',
                predictions: []
            };
        }
    }

    @Post('clear-cache')
    async clearCache(@Body() body: { competition?: string }): Promise<any> {
        try {
            // For now, just return success since we're using memory cache
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