import { apiFetch } from "./fetch-api-wrapper"

const BACKEND_URL = "http://localhost:8080"

export const alertApi = {
  async getAlerts() {
    const res = await apiFetch(`${BACKEND_URL}/api/alerts`)
    return res.json()
  },

  async markAsRead(id: string) {
    const res = await apiFetch(
      `${BACKEND_URL}/api/alerts/${id}/read`,
      { method: "PATCH" }
    )
    return res.json()
  },

  async markAllAsRead() {
    const res = await apiFetch(
      `${BACKEND_URL}/api/alerts/read-all`,
      { method: "PATCH" }
    )
    return res.json()
  },
}
