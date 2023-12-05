import { axios } from 'boot/axios';
import { auth } from '@/utils/endpoints';

const authApi = () => ({
  login(body: any) {
    return axios.post(auth.login, body);
  },

  logout(body: any) {
    return axios.post(auth.logout, body);
  },

  register(body: any) {
    return axios.post(auth.register, body);
  },

  verifyAccount(code: string, username: string) {
    return axios.get(`/v1/auth/verify?code=${code}&username=${username}`);
  },

  changePassword(body: any) {
    return axios.post(auth.changePassword, body);
  },

  forgotPassword(body: any) {
    return axios.post(auth.forgotPassword, body);
  },

  confirmForgotPassword(body: any) {
    return axios.post(auth.confirmForgotPassword, body);
  },

  resendVerifyCode(body: any) {
    return axios.post(auth.resendVerificationCode, body);
  },

  changePhoneNumber(body: any) {
    return axios.post(auth.changePhoneNumber, body);
  },
});

export default authApi;
