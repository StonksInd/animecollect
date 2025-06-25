import { useLocalSearchParams } from 'expo-router';
import { View, Text, ScrollView, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { useAnimeApi } from '../hooks/useAnimeApi';
import { useDatabase } from '../hooks/useDatabase';
import { EpisodeList } from '../components/EpisodeList';

export default function AnimeDetailsScreen() {
    const { id } = useLocalSearchParams();
    const { anime, loading, error } = useAnimeApi(id as string);
    const { isInCollection, addToCollection } = useDatabase();

    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error || !anime) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Text style={tw`text-red-500`}>{error || 'Anime non trouvé'}</Text>
            </View>
        );
    }

    return (
        <ScrollView style={tw`flex-1 p-4 bg-gray-100`}>
            <View style={tw`flex-row mb-4`}>
                <Image
                    source={{ uri: anime.attributes.posterImage?.large }}
                    style={tw`w-32 h-48 rounded-lg`}
                    resizeMode="cover"
                />
                <View style={tw`ml-4 flex-1`}>
                    <Text style={tw`text-2xl font-bold`}>{anime.attributes.canonicalTitle}</Text>
                    <Text style={tw`text-gray-600`}>{anime.attributes.episodeCount} épisodes</Text>
                    <Text style={tw`text-gray-600`}>Note: {anime.attributes.averageRating}/100</Text>
                    <Text style={tw`text-gray-600`}>Statut: {anime.attributes.status}</Text>

                    <TouchableOpacity
                        style={tw`mt-4 bg-blue-500 py-2 px-4 rounded-lg`}
                        onPress={() => addToCollection(anime)}
                    >
                        <Text style={tw`text-white text-center`}>
                            {isInCollection(anime.id) ? 'Dans ma collection' : 'Ajouter à ma collection'}
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>

            <Text style={tw`text-lg font-bold mb-2`}>Synopsis</Text>
            <Text style={tw`text-gray-700 mb-6`}>{anime.attributes.synopsis}</Text>

            <Text style={tw`text-lg font-bold mb-2`}>Épisodes</Text>
            <EpisodeList animeId={anime.id} />
        </ScrollView>
    );
}