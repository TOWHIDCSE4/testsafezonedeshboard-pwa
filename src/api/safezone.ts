import { axios } from 'boot/axios';

const safeZoneApi = () => ({
  getSafeZoneByChild(childrenId: string) {
    return axios.get(`/v1/safezone/child/${childrenId}/list`);
  },

  createSafeZone(body: any) {
    return axios.post(`/v1/safezone/create-safe-zone`, body);
  },

  updateSafeZone(safeZoneId: any, body: any) {
    return axios.put(`/v1/safezone/${safeZoneId}/update`, body);
  },

  deleteSafeZone(safeZoneId: any) {
    return axios.delete(`/v1/safezone/${safeZoneId}/delete`);
  },
});

export default safeZoneApi;
