import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { sendTicketImage } from '@/services/ticket.service';


export const CameraScreen = () => {
	const [permission, requestPermission] = useCameraPermissions();
	const [facing, setFacing] = useState<CameraType>('back');
	const [photoUri, setPhotoUri] = useState<string | null>(null);
	const [cameraReady, setCameraReady] = useState(false);
	const [cameraRef, setCameraRef] = useState<any>(null);
	const [flash, setFlash] = useState<'off' | 'on' | 'auto'>('auto');
	const [loading, setLoading] = useState(false);
	const [ocrData, setOcrData] = useState<any>(null);

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
		setFlash((prev) => (prev === 'off' ? 'on' : prev === 'on' ? 'auto' : 'off'));
	};

	const handleSend = async () => {
		if (!photoUri) return;
		setLoading(true);
		setOcrData(null);
	
		try {
			const image: any = {
				uri: photoUri,
				type: 'image/jpeg',
				name: 'photo.jpg',
			};
	
			const result = await sendTicketImage(image);
			setOcrData(result);
		} catch (err) {
			console.error('Error al enviar imagen OCR', err);
		} finally {
			setLoading(false);
			setPhotoUri(null);
		}
	};

	return (
		<View style={styles.container}>
			{!photoUri ? (
				<>
				<CameraView
					style={StyleSheet.absoluteFill}
					facing={facing}
					ref={(ref) => setCameraRef(ref)}
					onCameraReady={() => setCameraReady(true)}
					mirror={facing === 'front'}
					// flash={ flash } //TODO: Encontrar la forma de que funcione en Android¿?
					enableTorch={flash === 'on'}
				>
					<View style={styles.overlay}>
						<TouchableOpacity onPress={toggleFlash}>
							<Ionicons
								name={
									flash === 'on'
										? 'flash'
										: flash === 'off'
										? 'flash-off'
										: 'flash-outline'
								}
								size={28}
								color={flash === 'on' ? '#FFD700' : 'white'}
							/>
						</TouchableOpacity>
						<TouchableOpacity onPress={flipCamera}>
							<Ionicons
								name="camera-reverse-outline"
								size={32}
								color="white"
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
					</View>
				</CameraView>
				</>
			) : (
				<View style={styles.centered}>
					<Image source={{ uri: photoUri }} style={styles.preview} />

					{loading ? (
						<Text style={{ marginTop: 16, color: '#999' }}>Procesando ticket...</Text>
					) : (
						<>
							<TouchableOpacity onPress={handleSend} style={styles.button}>
								<Text style={styles.buttonText}>Enviar al backend</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() => setPhotoUri(null)}
								style={[styles.button, { backgroundColor: '#666' }]}
							>
								<Text style={styles.buttonText}>Volver a tomar</Text>
							</TouchableOpacity>
						</>
					)}

					{ocrData && (
						<View style={{ marginTop: 20, paddingHorizontal: 20 }}>
							<Text className="text-white text-lg font-semibold mb-2">Texto OCR:</Text>
							<Text className="text-white">{JSON.stringify(ocrData.ocrMetadata ?? ocrData, null, 2)}</Text>
						</View>
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
	overlay: {
		position: 'absolute',
		bottom: 40,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-around',
		paddingHorizontal: 40,
	},
	capture: {
		width: 64,
		height: 64,
		borderRadius: 32,
		backgroundColor: 'white',
		justifyContent: 'center',
		alignItems: 'center',
	},
	centered: {
		flex: 1,
		justifyContent: 'center',
		alignItems: 'center',
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
	flashButton: {
		position: 'absolute',
		top: 50,
		right: 30,
		zIndex: 10,
	},
});
