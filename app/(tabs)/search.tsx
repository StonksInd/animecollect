import { useState } from 'react';
import { View, Text, TextInput, FlatList, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { useAnimeApi } from '../hooks/useAnimeApi';
import { AnimeCard } from '../components/AnimeCard';

export default function SearchScreen() {
    const [query, setQuery] = useState('');
    const { search, loading, error } = useAnimeApi();
    const [results, setResults] = useState([]);

    const handleSearch = async () => {
        if (query.trim()) {
            const searchResults = await search(query);
            setResults(searchResults);
        }
    };

    return (
        <View style={tw`flex-1 p-4 bg-gray-100`}>
            <Text style={tw`text-2xl font-bold mb-4`}>Rechercher</Text>

            <TextInput
                style={tw`bg-white p-3 rounded-lg mb-4 shadow-sm`}
                placeholder="Rechercher un anime..."
                value={query}
                onChangeText={setQuery}
                onSubmitEditing={handleSearch}
            />

            {loading ? (
                <ActivityIndicator size="large" style={tw`mt-8`} />
            ) : error ? (
                <Text style={tw`text-red-500 text-center`}>{error}</Text>
            ) : results.length > 0 ? (
                <FlatList
                    data={results}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <AnimeCard
                            anime={item}
                            onPress={() => navigation.navigate('anime-details', { id: item.id })}
                        />
                    )}
                />
            ) : query ? (
                <Text style={tw`text-center mt-8`}>Aucun résultat trouvé</Text>
            ) : (
                <Text style={tw`text-center mt-8`}>Entrez un terme de recherche</Text>
            )}
        </View>
    );
}