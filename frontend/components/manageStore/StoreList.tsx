import { useStores } from '@/store/useStore';
import { StoreItem } from './StoreItem';
import { FlatList } from 'react-native';

export const StoreList = () => {
    const stores = useStores((s) => s.stores);

    return (
        <FlatList
            data={stores}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <StoreItem store={item} />}
        />
    );
};
