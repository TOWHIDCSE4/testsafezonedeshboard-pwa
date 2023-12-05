import {
  AxiosResponse,
  AxiosStatic,
  AxiosError,
  AxiosRequestConfig,
} from 'axios';
interface AxiosOriginalRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

export default function interceptors(axios: AxiosStatic) {
  axios.defaults.baseURL = `${process.env.VITE_APP_BASE_URL}`;
  axios.interceptors.request.use(
    (config) => {
      const access_token = localStorage.getItem('access-token');

      if (access_token && config.headers) {
        config.headers['authorization'] = `Bearer ${access_token}`;
      }

      return config;
    },

    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response: AxiosResponse) => response.data,
    async (error: AxiosError) => {
      const originalConfig: AxiosOriginalRequestConfig | undefined =
        error.config;

      if (error.response) {
        if (error.response.status === 401 && !originalConfig?._retry) {
          // Todo: Refresh token here
          // return axios(originalConfig);
        }

        return Promise.reject(error.response.data);
      }
    }
  );
}
