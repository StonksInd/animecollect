import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import tw from 'twrnc';
import { useHomeData } from '../hooks/useHomeData';
import AnimeCard from '../components/AnimeCard';

const HomeScreen: React.FC = () => {
    const { currentlyAiring, upcoming, loading, error, refetch } = useHomeData();

    if (loading) {
        return <Text style={tw`text-center text-2xl font-bold`}>Chargement...</Text>;
    }

    if (error) {
        return <Text style={tw`text-center text-2xl font-bold`}>{error}</Text>;
    }

    return (
        <View style={tw`flex-1`}>
            <Text style={tw`text-2xl font-bold ml-4`}>Animes en cours</Text>
            <FlatList
                data={currentlyAiring}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AnimeCard anime={item} onPress={() => { }} />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                style={tw`mb-4`}
            />

            <Text style={tw`text-2xl font-bold ml-4`}>Prochains animes</Text>
            <FlatList
                data={upcoming}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <AnimeCard anime={item} onPress={() => { }} />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
            />
        </View>
    );
};

export default HomeScreen;