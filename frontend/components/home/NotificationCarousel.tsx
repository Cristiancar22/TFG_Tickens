import { useRef, useState } from 'react';
import {
    FlatList,
    View,
    Text,
    TouchableOpacity,
    LayoutChangeEvent,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNotifications } from '@/store/useNotifications';
import { colors } from '@/constants/colors';

export const NotificationCarousel = () => {
    const { notifications, archiveNotification } = useNotifications();
    const [currentIndex, setCurrentIndex] = useState(0);
    const [containerWidth, setContainerWidth] = useState(0);
    const flatListRef = useRef<FlatList>(null);

    if (notifications.length === 0) return null;

    const handleLayout = (event: LayoutChangeEvent) => {
        const { width } = event.nativeEvent.layout;
        setContainerWidth(width);
    };

    return (
        <View
            className="mb-6"
            onLayout={handleLayout}
            accessibilityLabel="notification-carousel-container"
        >
            <Text
                className="text-lg text-foreground mb-4"
                accessibilityLabel="notification-carousel-title"
            >
                Notificaciones importantes
            </Text>

            {containerWidth > 0 && (
                <>
                    <FlatList
                        ref={flatListRef}
                        data={notifications}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item._id}
                        onScroll={(e) => {
                            const index = Math.round(
                                e.nativeEvent.contentOffset.x / containerWidth,
                            );
                            setCurrentIndex(index);
                        }}
                        renderItem={({ item }) => (
                            <View
                                style={{ width: containerWidth }}
                                className="bg-white p-6 rounded-xl shadow mx-1"
                                accessibilityLabel={`notification-item-${item._id}`}
                            >
                                <Text
                                    className="text-lg text-foreground mb-3"
                                    accessibilityLabel={`notification-message-${item._id}`}
                                >
                                    {item.message}
                                </Text>
                                <View className="flex-row justify-end space-x-3">
                                    <TouchableOpacity
                                        onPress={() =>
                                            archiveNotification(item._id)
                                        }
                                        accessibilityLabel={`archive-button-${item._id}`}
                                    >
                                        <Ionicons
                                            name="archive-outline"
                                            size={24}
                                            color={colors.danger}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />

                    <View className="flex-row justify-center mt-3">
                        {notifications.map((_, i) => (
                            <View
                                key={i}
                                className={`h-2 w-2 mx-1 rounded-full ${
                                    currentIndex === i
                                        ? 'bg-primary'
                                        : 'bg-gray-300'
                                }`}
                            />
                        ))}
                    </View>
                </>
            )}
        </View>
    );
};
