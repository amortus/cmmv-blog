export * from "./api"
export * from "./admin";

import { FootballPredictionsModule } from "./api/football-predictions.module";
import * as admin from "./admin/index";
import * as contracts from "./contracts/index";

export default {
    name: '@cmmv/football-predictions',
    version: '0.0.1',
    description: 'Football predictions management package for CMMV',
    api: FootballPredictionsModule,
    contracts,
    admin,
    dependencies: [
        "@cmmv/http",
        "@cmmv/repository",
        "@cmmv/auth",
        "@cmmv/blog"
    ]
} 