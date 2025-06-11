import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, CameraType } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    facing: CameraType;
    flash: 'on' | 'off';
    onToggleFlash: () => void;
    onFlipCamera: () => void;
    onCapture: () => void;
    onSelectFile: () => void;
    setCameraRef: (ref: any) => void;
    onCameraReady: () => void;
};

export const CameraViewComponent = ({
    facing,
    flash,
    onToggleFlash,
    onFlipCamera,
    onCapture,
    onSelectFile,
    setCameraRef,
    onCameraReady,
}: Props) => (
    <CameraView
        style={StyleSheet.absoluteFill}
        facing={facing}
        ref={(ref) => setCameraRef(ref)}
        onCameraReady={onCameraReady}
        mirror={facing === 'front'}
        enableTorch={flash === 'on'}
    >
        <TouchableOpacity
            onPress={onToggleFlash}
            style={styles.flashButton}
            accessibilityLabel="toggle-flash-button"
        >
            <Ionicons
                name={flash === 'on' ? 'flash' : 'flash-off'}
                size={28}
                color={flash === 'on' ? '#FFD700' : 'white'}
            />
        </TouchableOpacity>

        <View style={styles.bottomControls}>
            <TouchableOpacity
                onPress={onSelectFile}
                style={styles.fileButton}
                accessibilityLabel="select-file-button"
            >
                <Ionicons name="attach" size={32} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onCapture}
                style={styles.capture}
                accessibilityLabel="capture-button"
            >
                <Ionicons name="camera-outline" size={32} color="black" />
            </TouchableOpacity>

            <TouchableOpacity
                onPress={onFlipCamera}
                style={styles.flipButton}
                accessibilityLabel="flip-camera-button"
            >
                <Ionicons
                    name="camera-reverse-outline"
                    size={32}
                    color="white"
                />
            </TouchableOpacity>
        </View>
    </CameraView>
);

const styles = StyleSheet.create({
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
});
