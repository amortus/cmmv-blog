import { Module } from '@cmmv/core';

import {
    FootballPredictionsService
} from './predictions.service';

import {
    FootballPredictionsController
} from './predictions.controller';

export const FootballPredictionsModule = new Module('football-predictions-sub', {
    providers: [
        FootballPredictionsService
    ],
    controllers: [
        FootballPredictionsController
    ]
}); 