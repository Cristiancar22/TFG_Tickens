import { View, StyleSheet } from 'react-native';
import { sendTicketImage } from '@/services/ticket.service';
import {
    PermissionDenied,
    CameraViewComponent,
    ImagePreview,
    PdfPreview,
} from '@/components/camera';
import { useCameraHandler, useFilePicker } from '@/hooks/camera';

export const CameraScreen = () => {
    const {
        permission,
        requestPermission,
        facing,
        flash,
        photoUri,
        loading,
        setLoading,
        setPhotoUri,
        setCameraRef,
        setCameraReady,
        flipCamera,
        toggleFlash,
        takePhoto,
    } = useCameraHandler();

    const { selectedFile, fileType, pdfBase64, handleSelectFile, clear } =
        useFilePicker();

    if (!permission) return <View />;

    if (!permission.granted) {
        return <PermissionDenied onRequest={requestPermission} />;
    }

    const handleSendCapturedPhoto = async () => {
        if (!photoUri) return;
        setLoading(true);
        try {
            const image = {
                uri: photoUri,
                type: 'image/jpeg',
                name: 'photo.jpg',
            };
            await sendTicketImage(image);
        } catch (err) {
            console.error('Error al enviar imagen OCR', err);
        } finally {
            setLoading(false);
            setPhotoUri(null);
        }
    };

    const handleSendSelectedFile = async () => {
        if (!selectedFile) return;
        setLoading(true);
        try {
            const image = {
                uri: selectedFile.uri,
                type: selectedFile.mimeType,
                name: selectedFile.name,
            };
            await sendTicketImage(image);
        } catch (err) {
            console.error('Error al enviar imagen OCR', err);
        } finally {
            setLoading(false);
            clear();
        }
    };

    return (
        <View style={styles.container}>
            {!photoUri && !selectedFile ? (
                <CameraViewComponent
                    facing={facing}
                    flash={flash}
                    onToggleFlash={toggleFlash}
                    onFlipCamera={flipCamera}
                    onCapture={takePhoto}
                    onSelectFile={handleSelectFile}
                    setCameraRef={setCameraRef}
                    onCameraReady={() => setCameraReady(true)}
                />
            ) : fileType === 'image' && selectedFile ? (
                <ImagePreview
                    uri={selectedFile.uri}
                    loading={loading}
                    onSend={handleSendSelectedFile}
                    onClear={clear}
                />
            ) : fileType === 'pdf' && selectedFile && pdfBase64 ? (
                <PdfPreview base64={pdfBase64} onClear={clear} />
            ) : photoUri ? (
                <ImagePreview
                    uri={photoUri}
                    loading={loading}
                    onSend={handleSendCapturedPhoto}
                    onClear={() => setPhotoUri(null)}
                />
            ) : null}
        </View>
    );
};

export default CameraScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
