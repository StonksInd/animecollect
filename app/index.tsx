import { useEffect } from 'react';
import { router } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import tw from 'twrnc';

export default function IndexScreen() {
    useEffect(() => {
        router.replace('/(tabs)');
    }, []);

    return (
        <View style={tw`flex-1 justify-center items-center`}>
            <ActivityIndicator size="large" />
        </View>
    );
}