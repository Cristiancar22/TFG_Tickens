import { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/constants/colors';
import { useSavingsGoalStore } from '@/store/useSavingsGoal';

export default function EditGoalScreen() {
    const router = useRouter();

    const { currentGoal, loading, fetchCurrentGoal, updateGoal, createGoal } =
        useSavingsGoalStore();

    const [title, setTitle] = useState('');
    const [target, setTarget] = useState('');

    useEffect(() => {
        fetchCurrentGoal();
    }, []);

    useEffect(() => {
        if (currentGoal) {
            setTitle(currentGoal.title);
            setTarget(String(currentGoal.targetAmount));
        }
    }, [currentGoal]);

    const onSave = async () => {
        if (!title.trim() || !target) {
            Alert.alert(
                'Campos obligatorios',
                'Título y cantidad son requeridos',
            );
            return;
        }

        const targetAmount = Number(target);
        if (Number.isNaN(targetAmount) || targetAmount <= 0) {
            Alert.alert('Cantidad inválida', 'Introduce un número mayor que 0');
            return;
        }

        try {
            if (currentGoal) {
                await updateGoal(currentGoal.id, { title, targetAmount });
            } else {
                await createGoal({
                    title,
                    targetAmount,
                    startDate: new Date().toISOString(),
                });
            }
            router.back();
        } catch (err: any) {
            Alert.alert('Error', err.message || 'No se pudo guardar la meta');
        }
    };

    const onCreateNew = async () => {
        if (!title.trim() || !target) return;

        try {
            await updateGoal(currentGoal!.id, {
                endDate: new Date().toISOString(),
                isActive: false,
            });

            await createGoal({
                title,
                targetAmount: Number(target),
                startDate: new Date().toISOString(),
            });

            router.back();
        } catch (err: any) {
            Alert.alert('Error', err.message || 'No se pudo crear la meta');
        }
    };

    if (loading) {
        return (
            <View className="flex-1 items-center justify-center bg-white">
                <ActivityIndicator
                    size="large"
                    color={colors.primary}
                    testID="ActivityIndicator"
                />
            </View>
        );
    }

    return (
        <View className="flex-1 bg-white px-6 py-8">
            <View className="mb-4">
                <Text className="mb-2 font-semibold text-neutral-700">
                    Título
                </Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="Ej. Viaje a Japón"
                    className="border border-neutral-300 rounded-lg p-3"
                />
            </View>

            <View className="mb-8">
                <Text className="mb-2 font-semibold text-neutral-700">
                    Cantidad objetivo (€)
                </Text>
                <TextInput
                    value={target}
                    onChangeText={setTarget}
                    keyboardType="numeric"
                    placeholder="1500"
                    className="border border-neutral-300 rounded-lg p-3"
                />
            </View>

            <TouchableOpacity
                className="bg-[#225560] rounded-lg py-3"
                onPress={onSave}
            >
                <Text className="text-white font-semibold text-center">
                    Guardar
                </Text>
            </TouchableOpacity>

            {currentGoal && (
                <TouchableOpacity
                    className="bg-[#4CAF50] rounded-lg py-3 mt-4"
                    onPress={onCreateNew}
                >
                    <Text className="text-white font-semibold text-center">
                        Crear nueva meta (cerrar la actual)
                    </Text>
                </TouchableOpacity>
            )}
        </View>
    );
}
