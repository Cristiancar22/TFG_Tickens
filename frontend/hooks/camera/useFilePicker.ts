import { useState } from 'react';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';

export const useFilePicker = () => {
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);
    const [pdfBase64, setPdfBase64] = useState<string | null>(null);

    const handleSelectFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'application/pdf'],
                copyToCacheDirectory: true,
            });

            if (result.canceled) return;

            const file = result.assets[0];
            setSelectedFile(file);

            if (file.mimeType?.startsWith('image/')) {
                setFileType('image');
                setPdfBase64(null);
            } else if (file.mimeType === 'application/pdf') {
                setFileType('pdf');
                const base64 = await FileSystem.readAsStringAsync(file.uri, {
                    encoding: FileSystem.EncodingType.Base64,
                });
                setPdfBase64(base64);
            }
        } catch (error) {
            console.error('Error al seleccionar archivo:', error);
        }
    };

    const clear = () => {
        setSelectedFile(null);
        setFileType(null);
        setPdfBase64(null);
    };

    return { selectedFile, fileType, pdfBase64, handleSelectFile, clear };
};
