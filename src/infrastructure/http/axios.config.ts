import axios, { type AxiosError } from 'axios'
import { SUPABASE_URL } from '../config/env'
import { authErrorInterceptor, authRequestInterceptor } from './interceptors/auth.interceptor'

export const axiosInstance = axios.create({
  baseURL: SUPABASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

axiosInstance.interceptors.request.use(authRequestInterceptor, (error: AxiosError) =>
  Promise.reject(error)
)

axiosInstance.interceptors.response.use((response) => response, authErrorInterceptor)
