import { api } from './api';

type UpdateProfileData = {
	name: string;
	surname: string;
	email: string;
};

type ChangePasswordData = {
	currentPassword: string;
	newPassword: string;
};

export const updateProfile = async (data: UpdateProfileData) => {
	try {
		const response = await api.patch('/profile', data);
		return response.data;
	} catch (error: any) {
		console.error(error);
		throw new Error(
			error.response?.data?.error?.message || 'Error al actualizar el perfil'
		);
	}
};

export const changePassword = async (data: ChangePasswordData) => {
	try {
		const response = await api.patch('/profile/password', data);
		return response.data;
	} catch (error: any) {
		console.error(error);
		throw new Error(
			error.response?.data?.error?.message || 'Error al cambiar la contraseña'
		);
	}
};
