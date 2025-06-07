import { useState } from 'react';
import { CameraType, useCameraPermissions } from 'expo-camera';

export const useCameraHandler = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('back');
    const [flash, setFlash] = useState<'on' | 'off'>('off');
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [cameraRef, setCameraRef] = useState<any>(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [loading, setLoading] = useState(false);

    const flipCamera = () => {
        setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
    };

    const toggleFlash = () => {
        setFlash((prev) => (prev === 'on' ? 'off' : 'on'));
    };

    const takePhoto = async () => {
        if (cameraRef && cameraReady) {
            const photo = await cameraRef.takePictureAsync();
            setPhotoUri(photo.uri);
        }
    };

    return {
        permission,
        requestPermission,
        facing,
        flash,
        photoUri,
        loading,
        setLoading,
        setPhotoUri,
        cameraRef,
        setCameraRef,
        cameraReady,
        setCameraReady,
        flipCamera,
        toggleFlash,
        takePhoto,
    };
};
