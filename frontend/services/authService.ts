import { api } from './api'

type LoginData = { email: string; password: string }

type RegisterData = {
    name: string
    surname?: string
    email: string
    password: string
}

export const loginUser = async (data: LoginData) => {
    try {
        const response = await api.post('/auth/login', data)
        console.log(response.data);
        
        return response.data
    } catch (error: any) {
        console.log(error);
        
        throw new Error(error.response?.data?.message || 'Error al iniciar sesión')
    }
}

export const registerUser = async (data: RegisterData) => {
    try {
        const response = await api.post('/auth/register', data)
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.message || 'Error al registrar usuario')
    }
}
