import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { useAuth } from './hooks/useAuth';
import tw from 'twrnc';

export default function IndexScreen() {
    const { user, loading } = useAuth();

    useEffect(() => {
        if (!loading) {
            if (user) {
                router.replace('/(tabs)');
            } else {
                router.replace('/(auth)/welcome');
            }
        }
    }, [user, loading]);

    return (
        <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" />
        </View>
    );
}