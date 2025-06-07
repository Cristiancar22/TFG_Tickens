import { useAuth } from '@/store/useAuth';

export const getAuthToken = () => {
    return useAuth.getState().token || null;
};

export const performLogout = () => {
    useAuth.getState().logout();
};