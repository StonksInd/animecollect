import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import tw from 'twrnc';
import { useUserCollection } from '../hooks/useUserCollection';
import AnimeCard from '../components/AnimeCard';

const CollectionScreen: React.FC = () => {
    const { getUserCollection, loading, error } = useUserCollection();
    const [collection, setCollection] = React.useState<(UserCollection & { anime: Anime })[]>([]);

    React.useEffect(() => {
        const fetchCollection = async () => {
            const data = await getUserCollection();
            setCollection(data);
        };

        fetchCollection();
    }, [getUserCollection]);

    if (loading) {
        return <Text style={tw`text-center text-2xl font-bold`}>Chargement...</Text>;
    }

    if (error) {
        return <Text style={tw`text-center text-2xl font-bold`}>{error}</Text>;
    }

    return (
        <View style={tw`flex-1`}>
            <Text style={tw`text-2xl font-bold ml-4`}>Ma Collection</Text>
            <FlatList
                data={collection}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AnimeCard anime={item.anime} onPress={() => { }} />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

export default CollectionScreen;