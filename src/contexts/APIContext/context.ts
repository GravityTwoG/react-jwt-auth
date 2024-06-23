import { createContext, useContext } from 'react';

import axios from 'axios';
import { AuthAPI } from '../../AuthAPI';
import { APIError } from '../../APIError';

const instance = axios.create({
  baseURL: 'http://localhost:8080',
  withCredentials: true,
});

// instantiate authAPI before adding interceptors for custom error handling
const authAPI = new AuthAPI(instance);

instance.interceptors.response.use(
  null,
  (error) => {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.error || 'Unknown error';

      throw new APIError(errorMessage);
    }

    throw error;
  },
  { synchronous: true }
);

interface IAPIContext {
  authAPI: AuthAPI;
}

export const api = {
  authAPI,
};

export const APIContext = createContext<IAPIContext>(api);

export const useAPIContext = () => {
  return useContext(APIContext);
};
