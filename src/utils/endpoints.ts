export const auth = {
  login: '/v1/auth/login',
  logout: '/v1/auth/logout',
  register: '/v1/auth/register',
  changePassword: '/v1/auth/change-password',
  forgotPassword: '/v1/auth/forgot-password',
  resendVerificationCode: '/v1/auth/resend-verification-code',
  confirmForgotPassword: '/v1/auth/confirm-forgot-password',
  changePhoneNumber: '/v1/auth/change-phone-number',
};

export const user = {
  getMyProfile: '/v1/user/me',
};

export const subscription = {
  getPlans: '/v1/subscriptions/plans',
  getUserSubscription: '/v1/subscriptions',
  payment: '/v1/payment',
};
