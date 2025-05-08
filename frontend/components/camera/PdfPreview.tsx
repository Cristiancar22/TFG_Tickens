import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import PdfViewer from '../ui/PdfViewer';

export const PdfPreview = ({
    base64,
    onClear,
}: {
    base64: string;
    onClear: () => void;
}) => (
    <View style={styles.centered}>
        <PdfViewer
            source={{ base64: `data:application/pdf;base64,${base64}` }}
            noLoader={false}
        />
        <TouchableOpacity
            onPress={onClear}
            style={[styles.button, { backgroundColor: '#666', marginTop: 16 }]}
        >
            <Text style={styles.buttonText}>Volver a elegir</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
    },
    button: {
        padding: 12,
        backgroundColor: '#333',
        borderRadius: 8,
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
});
