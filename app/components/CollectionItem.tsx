import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc';
import { ProgressBar } from './ProgressBar';

export const CollectionItem = ({ anime, watchedCount, totalEpisodes, onPress }) => {
    const progress = totalEpisodes > 0 ? (watchedCount / totalEpisodes) * 100 : 0;

    return (
        <TouchableOpacity
            onPress={onPress}
            style={tw`bg-white rounded-lg shadow-sm p-4 mb-3`}
        >
            <Text style={tw`text-lg font-bold mb-1`}>{anime.attributes.canonicalTitle}</Text>
            <Text style={tw`text-gray-600 mb-2`}>
                {watchedCount} / {totalEpisodes} épisodes
            </Text>
            <ProgressBar progress={progress} />
        </TouchableOpacity>
    );
};