import { apiFetch } from "./fetch-api-wrapper";
const BACKEND_URL= "http://localhost:8080"
export const alertApi={
    getAlerts:async()=>{
        const res = await apiFetch(`${BACKEND_URL}/api/alerts`);
        return res
    }
}