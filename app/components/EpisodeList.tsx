import { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import tw from 'twrnc';
import { fetchEpisodesByAnimeId } from '../services/apiService';
import { EpisodeCard } from './EpisodeCard';
import { useDatabase } from '../hooks/useDatabase';

interface Episode {
    id: string;
    attributes: {
        number: number;
        canonicalTitle: string;
        synopsis?: string;
    };
}

interface EpisodeListProps {
    animeId: string;
}

export const EpisodeList = ({ animeId }: EpisodeListProps) => {
    const [episodes, setEpisodes] = useState<Episode[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { isWatched, toggleWatched } = useDatabase();

    useEffect(() => {
        loadEpisodes();
    }, [animeId]);

    const loadEpisodes = async () => {
        try {
            setLoading(true);
            const episodesData = await fetchEpisodesByAnimeId(animeId);
            setEpisodes(episodesData);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erreur lors du chargement des épisodes');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <ActivityIndicator size="large" style={tw`mt-4`} />;
    }

    if (error) {
        return <Text style={tw`text-red-500 text-center mt-4`}>{error}</Text>;
    }

    if (episodes.length === 0) {
        return <Text style={tw`text-center mt-4`}>Aucun épisode disponible</Text>;
    }

    return (
        <FlatList
            data={episodes}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
                <EpisodeCard
                    episode={{
                        number: item.attributes.number,
                        title: item.attributes.canonicalTitle,
                        synopsis: item.attributes.synopsis,
                    }}
                    isWatched={isWatched(animeId, item.id)}
                    onToggle={() => toggleWatched(animeId, item.id)}
                />
            )}
            scrollEnabled={false} // Désactiver le scroll car c'est dans un ScrollView parent
        />
    );
};