import { useAnimeApi } from '../hooks/useAnimeApi';
import { AnimeCard } from '../components/AnimeCard';
import { View, Text, FlatList, ActivityIndicator, RefreshControl } from 'react-native';
import tw from 'twrnc';
import { useDatabase } from '../hooks/useDatabase';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define your stack param list
type RootStackParamList = {
    'anime-details': { id: string };
    // add other routes here if needed
};

export default function NewReleasesScreen() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const { trendingAnime, loading, error, refresh } = useAnimeApi();
    const { addToCollection, markAsWatched } = useDatabase();

    const handleAddToCollection = async (anime) => {
        await addToCollection(anime);
        // Afficher un feedback à l'utilisateur
    };

    const handleMarkAsWatched = async (animeId, episodeId) => {
        await markAsWatched(animeId, episodeId);
        // Afficher un feedback à l'utilisateur
    };

    if (error) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Text style={tw`text-red-500`}>{error}</Text>
            </View>
        );
    }

    // Define the type for an Anime item (adjust fields as needed)
    type Anime = {
        id: string;
        relationships: {
            episodes: {
                data: { id: string }[];
            };
        };
        // add other fields if needed
    };

    return (
        <View style={tw`flex-1 p-4 bg-gray-100`}>
            <Text style={tw`text-2xl font-bold mb-4`}>Nouveautés</Text>

            {loading && trendingAnime.length === 0 ? (
                <ActivityIndicator size="large" style={tw`mt-8`} />
            ) : (
                <FlatList<Anime>
                    data={trendingAnime}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <AnimeCard
                            anime={item}
                            onPress={() => navigation.navigate('anime-details', { id: item.id })}
                        />
                    )}
                    refreshControl={
                        <RefreshControl
                            refreshing={loading}
                            onRefresh={refresh}
                        />
                    }
                />
            )}
        </View>
    );
}