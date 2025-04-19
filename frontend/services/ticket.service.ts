import { api } from './api';
import { ImagePickerAsset } from 'expo-image-picker';

export const sendTicketImage = async (image: ImagePickerAsset) => {
    const formData = new FormData();

    formData.append('image', {
        uri: image.uri,
        name: image.fileName ?? 'ticket.jpg',
        type: image.mimeType ?? 'image/jpeg',
    } as any);

    const response = await api.post('/ocr/scan', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};
