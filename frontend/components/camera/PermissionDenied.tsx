import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const PermissionDenied = ({ onRequest }: { onRequest: () => void }) => (
    <View style={styles.centered}>
        <Text>Necesitamos permiso para usar la cámara</Text>
        <TouchableOpacity onPress={onRequest} style={styles.button}>
            <Text style={styles.buttonText}>Dar permiso</Text>
        </TouchableOpacity>
    </View>
);

const styles = StyleSheet.create({
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
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
