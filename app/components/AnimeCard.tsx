import { View, Text, Image, TouchableOpacity } from 'react-native';
import tw from 'twrnc';

export const AnimeCard = ({ anime, onPress }) => {
    return (
        <View style={tw`bg-white rounded-lg shadow-md overflow-hidden mb-4`}>
            <TouchableOpacity onPress={onPress}>
                <Image
                    source={{ uri: anime.attributes.posterImage?.medium }}
                    style={tw`w-full h-48`}
                    resizeMode="cover"
                />
                <View style={tw`p-4`}>
                    <Text style={tw`text-lg font-bold`} numberOfLines={1}>
                        {anime.attributes.canonicalTitle}
                    </Text>
                    <Text style={tw`text-gray-600`}>
                        {anime.attributes.episodeCount} épisodes
                    </Text>
                    <Text style={tw`text-sm text-gray-500`}>
                        {anime.attributes.startDate}
                    </Text>
                </View>
            </TouchableOpacity>


        </View>
    );
};