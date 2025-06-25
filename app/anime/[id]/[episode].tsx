import { useLocalSearchParams } from 'expo-router';
import { View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { useAnimeApi } from '../../hooks/useAnimeApi';
import { useDatabase } from '../../hooks/useDatabase';

export default function EpisodeDetailsScreen() {
    const { id, episode } = useLocalSearchParams();
    const { episode: episodeData, loading, error } = useAnimeApi(id, episode);
    const { isWatched, toggleWatched } = useDatabase();

    if (loading) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={tw`flex-1 justify-center items-center`}>
                <Text style={tw`text-red-500`}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={tw`flex-1 p-4 bg-gray-100`}>
            <Image
                source={{ uri: episodeData.attributes.thumbnail?.original }}
                style={tw`w-full h-48 rounded-lg mb-4`}
                resizeMode="cover"
            />

            <Text style={tw`text-2xl font-bold mb-2`}>
                Épisode {episodeData.attributes.number}: {episodeData.attributes.canonicalTitle}
            </Text>

            <Text style={tw`text-gray-600 mb-4`}>
                Sorti le: {new Date(episodeData.attributes.airdate).toLocaleDateString()}
            </Text>

            <Text style={tw`text-lg font-bold mb-2`}>Synopsis</Text>
            <Text style={tw`text-gray-700 mb-6`}>{episodeData.attributes.synopsis || 'Aucun synopsis disponible'}</Text>

            <TouchableOpacity
                style={tw`bg-blue-500 py-3 px-6 rounded-lg`}
                onPress={() => toggleWatched(id, episode)}
            >
                <Text style={tw`text-white text-center`}>
                    {isWatched(id, episode) ? 'Marquer comme non vu' : 'Marquer comme vu'}
                </Text>
            </TouchableOpacity>
        </View>
    );
}