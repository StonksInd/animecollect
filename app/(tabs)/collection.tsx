import { View, Text, FlatList, ActivityIndicator, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import tw from 'twrnc';
import { useDatabase } from '../hooks/useDatabase';
import { CollectionItem } from '../components/CollectionItem';
import { useAuth } from '../hooks/useAuth';

export default function CollectionScreen() {
    // Define the type for a collection item
    type CollectionEntry = {
        anime: {
            id: number;
            episodeCount: number;
            // add other anime fields if needed
        };
        watchedEpisodes: any[]; // replace 'any' with the actual type if known
    };

    const { collection, loading, error } = useDatabase() as {
        collection: CollectionEntry[];
        loading: boolean;
        error: string | null;
    };
    const { logout, user } = useAuth();

    if (error) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Text style={tw`text-red-500`}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 p-4 bg-gray-100`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
                <Text style={tw`text-2xl font-bold`}>Ma Collection</Text>
                <TouchableOpacity onPress={logout} style={tw`p-2`}>
                    <Text style={tw`text-red-500`}>Déconnexion</Text>
                </TouchableOpacity>
            </View>

            {loading && collection.length === 0 ? (
                <ActivityIndicator size="large" style={tw`mt-8`} />
            ) : collection.length === 0 ? (
                <Text style={tw`text-center mt-8`}>Votre collection est vide</Text>
            ) : (
                <FlatList
                    data={collection}
                    keyExtractor={(item) => item.anime.id.toString()}
                    renderItem={({ item }) => (
                        <CollectionItem
                            anime={item.anime}
                            watchedCount={item.watchedEpisodes.length}
                            totalEpisodes={item.anime.episodeCount}
                            onPress={() => router.push(`/anime/${item.anime.id}`)}
                        />
                    )}
                />
            )}
        </View>
    );
}