import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { useDatabase } from '../../hooks/useDatabase';
import { CollectionItem } from '../../components/CollectionItem';

export default function CollectionScreen() {
    const { collection, loading, error } = useDatabase();

    if (error) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Text style={tw`text-red-500`}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 p-4 bg-gray-100`}>
            <Text style={tw`text-2xl font-bold mb-4`}>Ma Collection</Text>

            {loading && collection.length === 0 ? (
                <ActivityIndicator size="large" style={tw`mt-8`} />
            ) : collection.length === 0 ? (
                <Text style={tw`text-center mt-8`}>Votre collection est vide</Text>
            ) : (
                <FlatList
                    data={collection}
                    keyExtractor={(item) => item.anime.id}
                    renderItem={({ item }) => (
                        <CollectionItem
                            anime={item.anime}
                            watchedCount={item.watchedEpisodes.length}
                            totalEpisodes={item.anime.attributes.episodeCount}
                            onPress={() => navigation.navigate('collection-details', { id: item.anime.id })}
                        />
                    )}
                />
            )}
        </View>
    );
}