//@ts-ignore
import { useApi } from '@cmmv/blog/admin/api';

export const useFootballPredictionsClient = () => {
    const api = useApi();

    const predictions = {
        get: async (filters: Record<string, string>) => {
            const query = new URLSearchParams(filters).toString();
            return api.authRequest(`football-predictions?${query}`, "GET");
        },
        fetch: async (data: any) => {
            return api.authRequest("football-predictions/fetch", "POST", data);
        },
        getCached: async (competition: string) => {
            return api.authRequest(`football-predictions/cached/${encodeURIComponent(competition)}`, "GET");
        },
        clearCache: async (competition?: string) => {
            return api.authRequest("football-predictions/clear-cache", "POST", { competition });
        },
        update: async (id: string, data: any) => {
            return api.authRequest(`football-predictions/${id}`, "PUT", data);
        },
        delete: async (id: string) => {
            return api.authRequest(`football-predictions/${id}`, "DELETE");
        }
    }

    return {
        predictions
    };
}; 