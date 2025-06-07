import { View, Image, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const ImagePreview = ({
    uri,
    loading,
    onSend,
    onClear,
}: {
    uri: string;
    loading: boolean;
    onSend: () => void;
    onClear: () => void;
}) => (
    <View style={styles.centered}>
        <Image source={{ uri }} style={styles.preview} />
        {loading ? (
            <Text style={{ marginTop: 16, color: '#999' }}>
                Procesando ticket...
            </Text>
        ) : (
            <>
                <TouchableOpacity onPress={onSend} style={styles.button}>
                    <Text style={styles.buttonText}>Enviar al backend</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={onClear}
                    style={[styles.button, { backgroundColor: '#666' }]}
                >
                    <Text style={styles.buttonText}>Volver a elegir</Text>
                </TouchableOpacity>
            </>
        )}
    </View>
);

const styles = StyleSheet.create({
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
