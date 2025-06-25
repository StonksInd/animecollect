import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import tw from 'twrnc';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);
            router.push('/(tabs)');
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
            Alert.alert('Erreur', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={tw`flex-1 bg-white`}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <View style={tw`flex-1 px-6 pt-16`}>
                {/* Header */}
                <TouchableOpacity
                    onPress={() => router.back()}
                    style={tw`mb-8`}
                >
                    <Text style={tw`text-blue-500 text-lg`}>← Retour</Text>
                </TouchableOpacity>

                <Text style={tw`text-3xl font-bold mb-2`}>Se connecter</Text>
                <Text style={tw`text-gray-600 mb-8`}>
                    Bon retour parmi nous !
                </Text>

                {/* Formulaire */}
                <View style={tw`mb-6`}>
                    <Text style={tw`text-gray-700 mb-2`}>Email</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 mb-4`}
                        placeholder="votre@email.com"
                        value={email}
                        onChangeText={setEmail}
                        keyboardType="email-address"
                        autoCapitalize="none"
                    />

                    <Text style={tw`text-gray-700 mb-2`}>Mot de passe</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 mb-6`}
                        placeholder="Votre mot de passe"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />
                </View>

                {/* Bouton de connexion */}
                <TouchableOpacity
                    style={tw`bg-blue-500 py-4 rounded-lg mb-4 ${loading ? 'opacity-50' : ''}`}
                    onPress={handleLogin}
                    disabled={loading}
                >
                    <Text style={tw`text-white text-center font-semibold text-lg`}>
                        {loading ? 'Connexion...' : 'Se connecter'}
                    </Text>
                </TouchableOpacity>

                {/* Lien vers inscription */}
                <View style={tw`flex-row justify-center`}>
                    <Text style={tw`text-gray-600`}>Pas encore de compte ? </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
                        <Text style={tw`text-blue-500 font-semibold`}>S'inscrire</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}