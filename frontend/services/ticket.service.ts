import { api } from './api';

type UploadableFile = {
    uri: string;
    name: string;
    type: string;
};

export const sendTicketImage = async (image: UploadableFile) => {
    const formData = new FormData();

    formData.append('image', {
        uri: image.uri,
        name: image.name ?? 'ticket.jpg',
        type: image.type ?? 'image/jpeg',
    } as any);

    const response = await api.post('/ticket/scan', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};

export const sendTicketPdf = async (file: UploadableFile) => {
    const formData = new FormData();

    formData.append('file', {
        uri: file.uri,
        name: file.name ?? 'ticket.pdf',
        type: file.type ?? 'application/pdf',
    } as any);

    const response = await api.post('/ticket/scan-pdf', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data;
};
