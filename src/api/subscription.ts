import { axios } from 'boot/axios';
import { subscription } from '@/utils/endpoints';

const subscriptionApi = () => ({
  getSubscriptionPlans() {
    return axios.get(subscription.getPlans);
  },
  getOrderById(orderId: string, signature: string) {
    return axios.get(`/v1/orders/${orderId}`, {
      params: {
        signature,
      },
    });
  },
  initiatePayment(body: any) {
    return axios.post(subscription.payment, body);
  },
});

export default subscriptionApi;
