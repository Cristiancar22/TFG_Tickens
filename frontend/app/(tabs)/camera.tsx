import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { sendTicketImage } from '@/services/ticket.service';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import { WebView } from 'react-native-webview';

export const CameraScreen = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState<CameraType>('back');
    const [photoUri, setPhotoUri] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<any>(null);
    const [fileType, setFileType] = useState<'image' | 'pdf' | null>(null);
    const [cameraReady, setCameraReady] = useState(false);
    const [cameraRef, setCameraRef] = useState<any>(null);
    const [flash, setFlash] = useState<'on' | 'off'>('off');
    const [loading, setLoading] = useState(false);
    const [pdfBase64, setPdfBase64] = useState<string | null>(null);

    if (!permission) return <View />;

    if (!permission.granted) {
        return (
            <View style={styles.centered}>
                <Text>Necesitamos permiso para usar la cámara</Text>
                <TouchableOpacity
                    onPress={requestPermission}
                    style={styles.button}
                >
                    <Text style={styles.buttonText}>Dar permiso</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const flipCamera = () => {
        setFacing((prev) => (prev === 'back' ? 'front' : 'back'));
    };

    const takePhoto = async () => {
        if (cameraRef && cameraReady) {
            const photo = await cameraRef.takePictureAsync();
            setPhotoUri(photo.uri);
        }
    };

    const toggleFlash = () => {
        setFlash((prev) => (prev === 'on' ? 'off' : 'on'));
    };

    const handleSend = async () => {
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

    const handleSelectFile = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['image/*', 'application/pdf'],
                copyToCacheDirectory: true,
                multiple: false,
            });

            if (result.canceled) return;

            const file = result.assets[0];

            setSelectedFile(file);
            if (file.mimeType?.startsWith('image/')) {
                setPhotoUri(file.uri);
                setFileType('image');
            } else if (file.mimeType === 'application/pdf') {
                setPhotoUri(null);
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

    const sendSelectedImage = async () => {
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
            setSelectedFile(null);
            setFileType(null);
        }
    };

    return (
        <View style={styles.container}>
            {!photoUri && !selectedFile ? (
                <>
                    <CameraView
                        style={StyleSheet.absoluteFill}
                        facing={facing}
                        ref={(ref) => setCameraRef(ref)}
                        onCameraReady={() => setCameraReady(true)}
                        mirror={facing === 'front'}
                        enableTorch={flash === 'on'}
                    >
                        <TouchableOpacity
                            onPress={toggleFlash}
                            style={styles.flashButton}
                        >
                            <Ionicons
                                name={flash === 'on' ? 'flash' : 'flash-off'}
                                size={28}
                                color={flash === 'on' ? '#FFD700' : 'white'}
                            />
                        </TouchableOpacity>

                        <View style={styles.bottomControls}>
                            <TouchableOpacity
                                onPress={handleSelectFile}
                                style={styles.fileButton}
                            >
                                <Ionicons
                                    name="attach"
                                    size={32}
                                    color="#fff"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={takePhoto}
                                style={styles.capture}
                            >
                                <Ionicons
                                    name="camera-outline"
                                    size={32}
                                    color="black"
                                />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={flipCamera}
                                style={styles.flipButton}
                            >
                                <Ionicons
                                    name="camera-reverse-outline"
                                    size={32}
                                    color="white"
                                />
                            </TouchableOpacity>
                        </View>
                    </CameraView>
                </>
            ) : fileType === 'image' && selectedFile ? (
                <View style={styles.centered}>
                    <Image
                        source={{ uri: selectedFile.uri }}
                        style={styles.preview}
                    />

                    {loading ? (
                        <Text style={{ marginTop: 16, color: '#999' }}>
                            Procesando ticket...
                        </Text>
                    ) : (
                        <>
                            <TouchableOpacity
                                onPress={sendSelectedImage}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>
                                    Enviar al backend
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedFile(null);
                                    setFileType(null);
                                }}
                                style={[
                                    styles.button,
                                    { backgroundColor: '#666' },
                                ]}
                            >
                                <Text style={styles.buttonText}>
                                    Volver a elegir
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            ) : fileType === 'pdf' && selectedFile ? (
                <View style={styles.centered}>
                    <WebView
                        originWhitelist={['*']}
                        source={{
                            uri: `data:application/pdf;base64,${pdfBase64}`,
                        }}
                        style={{ width: '90%', height: '80%', borderRadius: 8 }}
                    />
                    <TouchableOpacity
                        onPress={() => {
                            setSelectedFile(null);
                            setFileType(null);
                            setPdfBase64(null);
                        }}
                        style={[
                            styles.button,
                            { backgroundColor: '#666', marginTop: 16 },
                        ]}
                    >
                        <Text style={styles.buttonText}>Volver a elegir</Text>
                    </TouchableOpacity>
                </View>
            ) : (
                <View style={styles.centered}>
                    <Image source={{ uri: photoUri! }} style={styles.preview} />

                    {loading ? (
                        <Text style={{ marginTop: 16, color: '#999' }}>
                            Procesando ticket...
                        </Text>
                    ) : (
                        <>
                            <TouchableOpacity
                                onPress={handleSend}
                                style={styles.button}
                            >
                                <Text style={styles.buttonText}>
                                    Enviar al backend
                                </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setPhotoUri(null)}
                                style={[
                                    styles.button,
                                    { backgroundColor: '#666' },
                                ]}
                            >
                                <Text style={styles.buttonText}>
                                    Volver a tomar
                                </Text>
                            </TouchableOpacity>
                        </>
                    )}
                </View>
            )}
        </View>
    );
};

export default CameraScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    flashButton: {
        position: 'absolute',
        top: 30,
        left: 30,
        zIndex: 10,
    },
    bottomControls: {
        position: 'absolute',
        bottom: 40,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    capture: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
    },
    flipButton: {
        position: 'absolute',
        right: 80,
    },
    fileButton: {
        position: 'absolute',
        left: 80,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    preview: {
        width: '80%',
        height: '60%',
        borderRadius: 12,
    },
    button: {
        marginTop: 16,
        padding: 12,
        backgroundColor: '#333',
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
