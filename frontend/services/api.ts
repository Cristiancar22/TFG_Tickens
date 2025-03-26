import { useAuth } from '@/store/useAuth';
import axios from 'axios';

export const api = axios.create({
    baseURL: process.env.EXPO_PUBLIC_API_URL || 'http://192.168.1.223:5000/api',
})

api.interceptors.request.use(( config ) => {
    const { token } = useAuth.getState()
    if ( token ) {
        config.headers.Authorization = `Bearer ${ token }`
    }
    return config
})

api.interceptors.response.use(
    ( response ) => response,
    ( error ) => {
        if (error.response?.status === 401) {
            useAuth.getState().logout()
        }
        return Promise.reject(error)
    }
)