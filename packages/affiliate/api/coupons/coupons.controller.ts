import {
    Controller, Get, Param,
    CacheControl, ContentType,
    Raw, Res, Query
} from "@cmmv/http";

import {
    Cache
} from "@cmmv/cache";

import {
    Auth
} from "@cmmv/auth";

import {
    CouponsServiceTools
} from "./coupons.service";

@Controller("affiliate/coupons")
export class CouponsControllerTools {
    constructor(private readonly couponsService: CouponsServiceTools){}

    @Get("ai/:campaignId")
    @Auth("affiliatecoupons:get")
    async getCouponsWithAI(@Param("campaignId") campaignId: string) {
        return this.couponsService.getCouponsWithAI(campaignId);
    }

    @Get("campaign/:campaignId")
    @Cache("coupons:")
    @CacheControl({ maxAge: 3600, public: true })
    @ContentType('application/json')
    @Raw()
    async getCoupons(@Param("campaignId") campaignId: string) {
        return await this.couponsService.getCoupons(campaignId);
    }

    @Get("count/:campaignId")
    @Cache("coupons_count:")
    @CacheControl({ maxAge: 1800, public: true })
    @ContentType('application/json')
    @Raw()
    async getCouponsCountByCampaignId(@Param("campaignId") campaignId: string) {
        return await this.couponsService.getCouponsCountByCampaignId(campaignId);
    }

    @Get("campaign/views")
    @Cache("coupons:")
    @CacheControl({ maxAge: 3600, public: true })
    @ContentType('application/json')
    @Raw()
    async getCouponsWithViews() {
        return await this.couponsService.getCouponsWithViews();
    }

    @Get("top25weekly")
    @Cache("coupons_top25weekly:")
    @CacheControl({ maxAge: 60 * 60 * 4, public: true })
    @ContentType('application/json')
    @Raw()
    async getTop25WeeklyCoupons() {
        return await this.couponsService.getTop25WeeklyCoupons();
    }

    @Get("export")
    async export(@Res() response: any, @Query("token") token: string){
        if(token !== process.env.API_SIGNATURE)
            throw new Error("Invalid token");

        const data: string = await this.couponsService.export();

        response.res.writeHead(200, {
            'Content-Type': 'application/json',
            'Content-Disposition': `attachment; filename="coupons.json"`,
            'Content-Length': Buffer.byteLength(data, 'utf-8')
        });

        response.res.end(data);
    }
}
