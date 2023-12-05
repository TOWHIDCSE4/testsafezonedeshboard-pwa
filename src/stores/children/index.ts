import { defineStore } from 'pinia';
import childrenApi from '../../api/children';
import safeZoneApi from '../../api/safezone';

const childrenStore = defineStore({
  id: 'children',
  state: () => {
    return {
      dailyTimeLimit: {},
      childrenActivities: [],
      restrictedTimeLimit: {},
      webCategoriesZvelo: {
        categoryRules: [],
        isLoading: false,
      },
      webFilteringRules: {
        data: [],
        isLoading: false,
      },
      dailyLoading: false,
      restrictedLoading: false,
      activitiesLoading: false,
      devicesLoading: false,
      childrenDevices: [],
      safeZoneData: {
        data: [],
        isLoading: false,
      },
      quizAi: {
        data: [],
        isLoading: false,
      },
      subjectEducation: {
        data: [],
        total: 0,
        isLoading: false,
      },
    };
  },
  actions: {
    async getDevicesChildren(userId: string, childrenId: string) {
      const { getChildrenDevices } = childrenApi();

      try {
        this.devicesLoading = true;
        const data: any = await getChildrenDevices(userId, childrenId);

        if (data) {
          this.childrenDevices = data.result;
          this.devicesLoading = false;
          return Promise.resolve(data);
        }
      } catch (error) {
        this.devicesLoading = false;
        return Promise.reject(error);
      }
    },
    async getRuleDailyChildren(userId: string, childrenId: string) {
      const { getRulesDailyTimes } = childrenApi();

      try {
        this.dailyLoading = true;
        const data: any = await getRulesDailyTimes(userId, childrenId);

        if (data) {
          this.dailyTimeLimit = data.rule;
          this.dailyLoading = false;
          return Promise.resolve(data);
        }
      } catch (error) {
        this.dailyLoading = false;
        return Promise.reject(error);
      }
    },
    async getRulesRestrictedChildren(userId: string, childrenId: string) {
      const { getRulesRestrictedTimes } = childrenApi();

      try {
        this.restrictedLoading = true;
        const data: any = await getRulesRestrictedTimes(userId, childrenId);

        if (data) {
          this.restrictedTimeLimit = data.rule;
          this.restrictedLoading = false;
          return Promise.resolve(data);
        }
      } catch (error) {
        this.restrictedLoading = false;
        return Promise.reject(error);
      }
    },
    async getChildrenActivities(
      userId: string,
      childrenId: string,
      dayFilters?: any
    ) {
      const { getActivities } = childrenApi();

      try {
        this.activitiesLoading = true;
        const data: any = await getActivities(userId, childrenId, dayFilters);

        if (data) {
          this.childrenActivities = data.result;
          this.activitiesLoading = false;
          return Promise.resolve(data);
        }
      } catch (error) {
        this.activitiesLoading = false;
        return Promise.reject(error);
      }
    },
    async getCategoriesZvelo() {
      const { getWebCategoriesZvelo } = childrenApi();

      try {
        this.webCategoriesZvelo.isLoading = true;
        const data: any = await getWebCategoriesZvelo();

        if (data) {
          this.webCategoriesZvelo.categoryRules = data.content;
          this.webCategoriesZvelo.isLoading = false;
          return Promise.resolve(data);
        }
      } catch (error) {
        this.webCategoriesZvelo.isLoading = false;
        return Promise.reject(error);
      }
    },
    async getRulesWebFiltering(userId: string, childrenId: string) {
      const { getRulesWebFiltering } = childrenApi();

      try {
        this.webFilteringRules.isLoading = true;
        const data: any = await getRulesWebFiltering(userId, childrenId);

        if (data) {
          this.webFilteringRules.data = data.rule;
          this.webFilteringRules.isLoading = false;
          return Promise.resolve(data);
        }
      } catch (error) {
        this.webFilteringRules.isLoading = false;
        return Promise.reject(error);
      }
    },
    async getSafeZoneData(childrenId: string) {
      const { getSafeZoneByChild } = safeZoneApi();
      try {
        this.safeZoneData.isLoading = true;
        const data: any = await getSafeZoneByChild(childrenId);

        if (data) {
          this.safeZoneData.data = data.result;
          this.safeZoneData.isLoading = false;
          return Promise.resolve(data);
        }
      } catch (error) {
        this.safeZoneData.isLoading = false;
        return Promise.reject(error);
      }
    },
    async getQuizAIChildren(userId: string, childrenId: string, subject: number) {
      const { getQuizAI } = childrenApi();

      try {
        this.quizAi.isLoading = true;
        const data: any = await getQuizAI(userId, childrenId, subject);

        if (data) {
          this.quizAi.data = data.result;
          this.quizAi.isLoading = false;
          return Promise.resolve(data);
        }
      } catch (error) {
        this.quizAi.isLoading = false;
        return Promise.reject(error);
      }
    },
    async getAllSubjectChild(userId: string, childrenId: string, page_number: number, page_size: number, search: string) {
      const { getAllSubject } = childrenApi();

      try {
        this.subjectEducation.isLoading = true;
        const data: any = await getAllSubject(userId, childrenId, page_number, page_size, search);

        if (data) {
          this.subjectEducation.data = data.result.data;
          this.subjectEducation.total = data.result.pagination.total;
          this.subjectEducation.isLoading = false;
          return Promise.resolve(data);
        }
      } catch (error) {
        this.subjectEducation.isLoading = false;
        return Promise.reject(error);
      }
    },
    setRestrictedLoading(isLoading: boolean) {
      this.restrictedLoading = isLoading;
    },
  },
});

export default childrenStore;
