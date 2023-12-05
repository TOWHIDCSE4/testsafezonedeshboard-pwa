import axios from 'axios';

export const setHeader = (key: string, value: string) => {
  axios.defaults.headers.common[key] = value;
};

export const setToken = (token: string, type: string) => {
  if (!type) {
    axios.defaults.headers.common['authorization'] = token;
  } else {
    switch (type) {
      case 'Bearer':
        axios.defaults.headers.common['authorization'] = `Bearer ${token}`;
        break;
      default:
        break;
    }
  }
};
