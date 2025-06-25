import { View, Text, TouchableOpacity, Image } from 'react-native';
import { router } from 'expo-router';
import tw from 'twrnc';

export default function WelcomeScreen() {
    return (
        <View style={tw`flex-1 bg-gradient-to-b from-blue-500 to-purple-600 justify-center items-center px-6`}>
            {/* Logo ou illustration */}
            <View style={tw`mb-12`}>
                <Text style={tw`text-6xl text-center mb-4`}>🎌</Text>
                <Text style={tw`text-3xl font-bold text-white text-center mb-2`}>
                    AnimeCollect
                </Text>
                <Text style={tw`text-lg text-blue-100 text-center`}>
                    Suivez vos animes préférés
                </Text>
            </View>

            {/* Boutons d'action */}
            <View style={tw`w-full max-w-sm`}>
                <TouchableOpacity
                    style={tw`bg-white py-4 px-8 rounded-full mb-4 shadow-lg`}
                    onPress={() => router.push('/(auth)/register')}
                >
                    <Text style={tw`text-blue-600 text-center font-semibold text-lg`}>
                        Créer un compte
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={tw`border-2 border-white py-4 px-8 rounded-full mb-8`}
                    onPress={() => router.push('/(auth)/login')}
                >
                    <Text style={tw`text-white text-center font-semibold text-lg`}>
                        Se connecter
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={() => router.push('/(tabs)')}
                >
                    <Text style={tw`text-blue-100 text-center underline`}>
                        Continuer sans compte
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}