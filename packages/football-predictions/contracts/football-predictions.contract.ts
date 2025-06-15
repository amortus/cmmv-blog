import {
    Contract, AbstractContract,
    ContractField
} from "@cmmv/core";

@Contract({
    namespace: 'FootballPredictions',
    controllerName: 'FootballPredictions',
    controllerCustomPath: 'football-predictions',
    protoPackage: 'football-predictions',
    subPath: '/football-predictions',
    generateController: true,
    generateBoilerplates: false,
    auth: true,
    options: {
        moduleContract: true,
        databaseSchemaName: "football_predictions",
        databaseTimestamps: true
    },
    index: [
        {
            name: 'competition_date_idx',
            fields: ['competition', 'matchDate'],
            options: {
                unique: false
            }
        },
        {
            name: 'teams_date_idx',
            fields: ['homeTeam', 'awayTeam', 'matchDate'],
            options: {
                unique: true
            }
        }
    ]
})
export class FootballPredictionsContract extends AbstractContract {
    @ContractField({
        protoType: 'string',
        nullable: false,
        index: true,
    })
    competition!: string;

    @ContractField({
        protoType: 'string',
        nullable: false,
        index: true,
    })
    homeTeam!: string;

    @ContractField({
        protoType: 'string',
        nullable: false,
        index: true,
    })
    awayTeam!: string;

    @ContractField({
        protoType: 'date',
        nullable: true,
        index: true,
    })
    matchDate?: Date;

    @ContractField({
        protoType: 'number',
        nullable: true,
    })
    choice?: number;

    @ContractField({
        protoType: 'string',
        nullable: true,
    })
    result?: string;

    @ContractField({
        protoType: 'string',
        nullable: true,
    })
    pick?: string;

    @ContractField({
        protoType: 'number',
        nullable: true,
    })
    gg?: number;

    @ContractField({
        protoType: 'number',
        nullable: true,
    })
    ov15?: number;

    @ContractField({
        protoType: 'number',
        nullable: true,
    })
    ov25?: number;

    @ContractField({
        protoType: 'number',
        nullable: true,
    })
    un15?: number;

    @ContractField({
        protoType: 'number',
        nullable: true,
    })
    un25?: number;

    @ContractField({
        protoType: 'text',
        nullable: true,
    })
    rawApiData?: string;

    @ContractField({
        protoType: 'date',
        nullable: false,
        index: true,
    })
    lastUpdated!: Date;

    @ContractField({
        protoType: 'boolean',
        nullable: false,
        defaultValue: true,
        index: true,
    })
    active!: boolean;
} 