import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

export const EpisodeCard = ({ episode, isWatched, onToggle }) => {
    return (
        <TouchableOpacity
            style={tw`bg-white p-4 mb-2 rounded-lg border ${isWatched ? 'border-green-500' : 'border-gray-200'}`}
            onPress={onToggle}
        >
            <View style={tw`flex-row justify-between items-center`}>
                <Text style={tw`font-medium`}>
                    Épisode {episode.number}: {episode.title}
                </Text>
                <View style={tw`w-4 h-4 rounded-full ${isWatched ? 'bg-green-500' : 'bg-gray-300'}`} />
            </View>
            {episode.synopsis && (
                <Text style={tw`text-gray-600 mt-2 text-sm`} numberOfLines={2}>
                    {episode.synopsis}
                </Text>
            )}
        </TouchableOpacity>
    );
};