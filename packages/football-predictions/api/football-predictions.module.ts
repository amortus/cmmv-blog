import { Module } from '@cmmv/core';

import {
    FootballPredictionsContract
} from '../contracts';

import {
    FootballPredictionsModule as PredictionsSubModule
} from './predictions/predictions.module';

export const FootballPredictionsModule = new Module('football-predictions', {
    contracts: [
        FootballPredictionsContract
    ],
    submodules: [
        PredictionsSubModule
    ]
}); 