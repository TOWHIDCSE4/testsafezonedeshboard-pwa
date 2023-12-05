import { axios } from 'boot/axios';
import { user, subscription } from '@/utils/endpoints';

const userApi = () => ({
  getProfile() {
    return axios.get(user.getMyProfile);
  },
  getChildren(userId: any) {
    return axios.get(`/v1/users/${userId}/children`);
  },
  addChildren(userId: any, body: any) {
    return axios.post(`/v1/users/${userId}/children`, body);
  },
  getDevices(userId: any) {
    return axios.get(`/v1/users/${userId}/devices`);
  },
  addDevices(userId: any, body: any) {
    return axios.post(`/v1/users/${userId}/devices`, body);
  },
  getUserSubscription() {
    return axios.get(subscription.getUserSubscription);
  },
});

export default userApi;
