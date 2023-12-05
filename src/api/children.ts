import { axios } from 'boot/axios';

const childrenApi = () => ({
  getRulesRestrictedTimes(userId: string, childrenId: string) {
    return axios.get(
      `/v1/users/${userId}/children/${childrenId}/rules/restricted-times`
    );
  },
  updateRulesRestrictedTimes(userId: string, childrenId: string, body: any) {
    return axios.patch(
      `/v1/users/${userId}/children/${childrenId}/rules/restricted-times`,
      body
    );
  },
  getRulesDailyTimes(userId: string, childrenId: string) {
    return axios.get(
      `/v1/users/${userId}/children/${childrenId}/rules/daily-time-limit`
    );
  },
  updateRulesDailyTimes(userId: string, childrenId: any, body: any) {
    return axios.patch(
      `/v1/users/${userId}/children/${childrenId}/rules/daily-time-limit`,
      body
    );
  },
  getActivities(userId: string, childrenId: string, filterParams?: any) {
    return axios.get(`/v1/users/${userId}/children/${childrenId}/activities`, {
      params: { ...filterParams },
    });
  },
  addRulesActivityControl(userId: string, childrenId: string, body: any) {
    return axios.post(
      `/v1/users/${userId}/children/${childrenId}/rules/activity-control`,
      body
    );
  },
  getWebCategoriesZvelo() {
    return axios.get(`/v1/zvelo/get-web-categories`);
  },
  getRulesWebFiltering(userId: string, childrenId: string) {
    return axios.get(
      `/v1/users/${userId}/children/${childrenId}/rules/web-filtering`
    );
  },
  updateRulesWebFiltering(userId: string, childrenId: any, body: any) {
    return axios.patch(
      `/v1/users/${userId}/children/${childrenId}/rules/web-filtering`,
      body
    );
  },
  getChildrenDevices(userId: string, childrenId: string) {
    return axios.get(`/v1/users/${userId}/children/${childrenId}/devices`);
  },
  updateEducationInfoChildren(userId: string, childrenId: any, body: any) {
    return axios.put(
      `/v1/users/${userId}/children/${childrenId}/information/update-education-info`,
      body
    );
  },
  getQuizAI(userId: string, childrenId: string, subject: number) {
    return axios.get(
      `/v1/users/${userId}/children/${childrenId}/ai/quiz-ai?subject=${subject}`
    );
  },
  getAllSubject(userId: string, childrenId: any, page_number: number, page_size: number, search: string) {
    return axios.get(
      `/v1/users/${userId}/children/${childrenId}/information/get-all-subject?page_number=${page_number}&page_size=${page_size}&search=${search}`
    );
  },
});

export default childrenApi;
