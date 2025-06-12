import { ChangePasswordModal } from '@/components/modals/ChangePasswordModal';
import { PrimaryButton } from '@/components/ui/PrimaryButton';
import { useUpdateAvatar } from '@/hooks/profile/useUpdateAvatar';
import { useUpdatePassword } from '@/hooks/profile/useUpdatePassword';
import { useAuth } from '@/store/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';

export const ProfileScreen = () => {
    const [isPasswordModalVisible, setPasswordModalVisible] = useState(false);
    const { update, loading } = useUpdatePassword();
    const { updateAvatar } = useUpdateAvatar();

    const router = useRouter();
    const logout = useAuth((s) => s.logout);
    const name = useAuth((s) => s.user?.name);
    const surname = useAuth((s) => s.user?.surname);
    const email = useAuth((s) => s.user?.email);
    const avatarUrl = useAuth((s) => s.user?.avatarUrl);

    return (
        <View
            className="flex-1 items-center flex-col"
            accessibilityLabel="profile-screen"
        >
            <View className="items-center mt-10">
                <TouchableOpacity
                    onPress={updateAvatar}
                    className="mt-10"
                    accessibilityLabel="profile-avatar-button"
                >
                    {avatarUrl ? (
                        <Image
                            source={{
                                uri: `${process.env.EXPO_PUBLIC_API_URL}${avatarUrl}`,
                            }}
                            className="w-24 h-24 rounded-full"
                            accessibilityLabel="profile-avatar-image"
                        />
                    ) : (
                        <Ionicons
                            name="person-circle-outline"
                            size={100}
                            color="#999"
                            accessibilityLabel="profile-avatar-icon"
                        />
                    )}
                </TouchableOpacity>
                <Text
                    className="text-xl font-semibold mt-1"
                    accessibilityLabel="profile-name"
                >
                    {`${name} ${surname}`}
                </Text>
                <Text
                    className="text-gray-500"
                    accessibilityLabel="profile-email"
                >
                    {email}
                </Text>
            </View>

            <View className="mt-8 mb-6 w-full px-4">
                <Text
                    className="text-lg font-semibold mb-4"
                    accessibilityLabel="profile-section-title"
                >
                    Tu perfil
                </Text>

                <View className="gap-y-3">
                    <PrimaryButton
                        title="Modificar perfil"
                        onPress={() =>
                            router.push('/(tabs)/profile/edit' as any)
                        }
                        accessibilityLabel="edit-profile-button"
                    />
                    <PrimaryButton
                        title="Cambiar contraseña"
                        onPress={() => setPasswordModalVisible(true)}
                        accessibilityLabel="change-password-button"
                    />
                </View>
            </View>

            <View className="mt-8">
                <PrimaryButton
                    title="Cerrar sesión"
                    onPress={logout}
                    accessibilityLabel="logout-button"
                />
            </View>

            <ChangePasswordModal
                isVisible={isPasswordModalVisible}
                onClose={() => setPasswordModalVisible(false)}
                onSubmit={update}
                loading={loading}
            />
        </View>
    );
};

export default ProfileScreen;

export const options = {
    headerShown: false,
};
