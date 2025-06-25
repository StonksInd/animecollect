import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import tw from 'twrnc';

type EpisodeCardProps = {
    episode: KitsuEpisode;
    onPress: () => void;
};

const EpisodeCard: React.FC<EpisodeCardProps> = ({ episode, onPress }) => {
    const imageUrl = episode.attributes.thumbnail?.large || 'https://via.placeholder.com/150';
    const title = episode.attributes.canonicalTitle || 'Titre inconnu';

    return (
        <TouchableOpacity onPress={onPress} style={tw`bg-white rounded-lg shadow-md p-4`}>
            <Image source={{ uri: imageUrl }} style={tw`w-24 h-24 rounded-lg`} />
            <Text style={tw`text-lg font-bold mt-2`}>{title}</Text>
            <Text style={tw`text-gray-600`}>{episode.attributes.synopsis?.substring(0, 100)}...</Text>
        </TouchableOpacity>
    );
};

export default EpisodeCard;