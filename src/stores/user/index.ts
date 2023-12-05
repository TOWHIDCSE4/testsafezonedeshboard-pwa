import { defineStore } from 'pinia';
import userApi from '@api/user';

const defaultState = {
  userProfile: {},
  userChildren: [],
  userDevices: [],
  userSubscriptions: {},
  profileLoading: false,
  childrenLoading: false,
  devicesLoading: false,
};

const userStore = defineStore({
  id: 'user',
  state: () => {
    return { ...defaultState };
  },
  actions: {
    async getUserPlan() {
      const { getUserSubscription } = userApi();

      try {
        const data: any = await getUserSubscription();

        if (data) {
          this.userSubscriptions = data.result;
          return Promise.resolve(data);
        }
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async getUserProfile() {
      const { getProfile } = userApi();

      try {
        this.profileLoading = true;
        const data: any = await getProfile();

        if (data) {
          this.userProfile = data.user;
          this.profileLoading = false;
          return Promise.resolve(data);
        }
      } catch (error) {
        this.profileLoading = false;
        return Promise.reject(error);
      }
    },
    async getUserChildren(userId: string) {
      const { getChildren } = userApi();

      try {
        this.childrenLoading = true;
        const data: any = await getChildren(userId);

        if (data) {
          this.userChildren = data.result;
          this.childrenLoading = false;
          return Promise.resolve(data);
        }
      } catch (error) {
        this.childrenLoading = false;
        return Promise.reject(error);
      }
    },
    async getUserDevices(userId: string) {
      const { getDevices } = userApi();

      try {
        this.devicesLoading = true;
        const data: any = await getDevices(userId);

        if (data) {
          this.userDevices = data.result;
          this.devicesLoading = false;
          return Promise.resolve(data);
        }
      } catch (error) {
        this.devicesLoading = false;
        return Promise.reject(error);
      }
    },
    async addUserChildren(userId: string, body: any) {
      const { addChildren } = userApi();

      try {
        await addChildren(userId, body);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    reset() {
      Object.assign(this, defaultState);
    },
  },
});

export default userStore;
