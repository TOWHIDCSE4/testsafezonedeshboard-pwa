import useUserStore from '@stores/user';
import useStore from '@stores/root';

const auth = async (from: any, to: any, next: any) => {
  const access_token = localStorage.getItem('access-token');
  const userStore = useUserStore();
  const store = useStore();

  if (access_token) {
    try {
      store.start();
      const user: any = await userStore.getUserProfile();

      if (user) {
        await userStore.getUserChildren(user.user.id);
        await userStore.getUserPlan();
        next();
      } else {
        localStorage.removeItem('access-token');
        localStorage.removeItem('accessToken');
        next('/login');
      }
      store.finish();
    } catch (error) {
      localStorage.removeItem('access-token');
      localStorage.removeItem('accessToken');
      next(`/login?redirect=${to.path}`);
      store.finish();
    }
  } else {
    next('/login');
    store.finish();
  }
};

export default auth;
