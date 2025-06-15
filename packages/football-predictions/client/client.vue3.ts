//@ts-nocheck
import { useApi } from "@cmmv/blog/client/client.vue3";

let ref = (val) => ({ value: val });
let inject = () => ({});
let App = function () { };

try {
    const Vue = require('vue');
    ref = Vue.ref;
    inject = Vue.inject;
    App = Vue.App;
} catch (e) {}

/**
 * @description Use the Football Predictions API to get predictions data
 * @returns {Object} The Football Predictions API object
 */
export const useFootballPredictions = () => {
    const api = useApi();

    const predictions = {
        fetch: async (data: { 
            apiUrl: string; 
            apiPassword: string; 
            competition?: string; 
            intervalHours?: number; 
            limit?: number; 
        }) => {
            try {
                return await api.post("football-predictions/fetch", data);
            } catch (error) {
                console.error("Football predictions fetch error:", error);
                throw error;
            }
        },
        
        getCached: async (competition: string) => {
            try {
                return await api.get(`football-predictions/cached/${encodeURIComponent(competition)}`, `predictions_${competition}`);
            } catch (error) {
                console.error("Football predictions cached error:", error);
                return { predictions: [] };
            }
        },

        clearCache: async (competition?: string) => {
            try {
                return await api.post("football-predictions/clear-cache", { competition });
            } catch (error) {
                console.error("Football predictions clear cache error:", error);
                throw error;
            }
        }
    };

    return {
        predictions
    };
}; 