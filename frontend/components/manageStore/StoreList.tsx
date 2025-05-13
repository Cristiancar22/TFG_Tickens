import { useStores } from '@/store/useStore';
import { StoreItem } from './StoreItem';
import { FlatList, TextInput, View } from 'react-native';
import { useState } from 'react';
import { Store } from '@/types';

interface Props {
    onEditStore: (store: Store) => void;
}

export const StoreList = ({ onEditStore }: Props) => {
    const stores = useStores((s) => s.stores);
    const [searchTerm, setSearchTerm] = useState('');

    const filteredStores = stores.filter((store) =>
        store.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    return (
        <View style={{ flex: 1 }}>
            <TextInput
                placeholder="Buscar tienda..."
                value={searchTerm}
                onChangeText={setSearchTerm}
                style={{
                    padding: 10,
                    margin: 10,
                    borderColor: 'gray',
                    borderWidth: 1,
                    borderRadius: 8,
                }}
            />
            <FlatList
                data={filteredStores}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => <StoreItem store={item} onEdit={onEditStore} />}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                windowSize={5}
            />
        </View>
    );
};
