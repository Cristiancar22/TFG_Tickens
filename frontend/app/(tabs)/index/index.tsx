import { useCallback, useEffect } from 'react';
import { ScrollView, RefreshControl, View } from 'react-native';
import { colors } from '@/constants/colors';
import { useUserStats } from '@/store/useUserStats';
import { useBudgets } from '@/store/useBudgets';
import { useNotifications } from '@/store/useNotifications';
import { BudgetList, Greeting, ManageButtons, NotificationCarousel, UserStats } from '@/components/home';

export const HomeScreen = () => {
    const { loading, fetchStats } = useUserStats();
    const fetchBudgets = useBudgets((s) => s.fetchBudgets);
    const fetchNotifications = useNotifications((s) => s.fetchNotifications);

    const now = new Date();
    const month = now.getMonth() + 1;
    const year = now.getFullYear();

    useEffect(() => {
        fetchStats();
        fetchBudgets(month, year);
        fetchNotifications();
    }, [month, year]);

    const onRefresh = useCallback(() => {
        fetchStats();
        fetchBudgets(month, year);
        fetchNotifications();
    }, [month, year]);

    return (
        <ScrollView
            className="flex-1"
            style={{ backgroundColor: colors.background }}
            refreshControl={
                <RefreshControl refreshing={loading} onRefresh={onRefresh} />
            }
        >
            <View className="p-6">
                <Greeting />
                <NotificationCarousel />
                <UserStats />
                <BudgetList />
                <ManageButtons />
            </View>
        </ScrollView>
    );
};

export default HomeScreen;
