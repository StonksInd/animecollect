import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import tw from 'twrnc';
import { useAuth } from '../hooks/useAuth';

export default function RegisterScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();

    const handleRegister = async () => {
        if (!email || !password || !username) {
            Alert.alert('Erreur', 'Veuillez remplir tous les champs');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
            return;
        }

        if (password.length < 6) {
            Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
            return;
        }

        setLoading(true);
        try {
            await register(email, password, username);
            Alert.alert('Succès', 'Compte créé avec succès !', [
                { text: 'OK', onPress: () => router.push('/(tabs)') }
            ]);
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

                <Text style={tw`text-3xl font-bold mb-2`}>Créer un compte</Text>
                <Text style={tw`text-gray-600 mb-8`}>
                    Rejoignez la communauté AnimeCollect
                </Text>

                {/* Formulaire */}
                <View style={tw`mb-6`}>
                    <Text style={tw`text-gray-700 mb-2`}>Nom d'utilisateur</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 mb-4`}
                        placeholder="Votre nom d'utilisateur"
                        value={username}
                        onChangeText={setUsername}
                        autoCapitalize="none"
                    />

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
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 mb-4`}
                        placeholder="Au moins 6 caractères"
                        value={password}
                        onChangeText={setPassword}
                        secureTextEntry
                    />

                    <Text style={tw`text-gray-700 mb-2`}>Confirmer le mot de passe</Text>
                    <TextInput
                        style={tw`border border-gray-300 rounded-lg px-4 py-3 mb-6`}
                        placeholder="Répétez votre mot de passe"
                        value={confirmPassword}
                        onChangeText={setConfirmPassword}
                        secureTextEntry
                    />
                </View>

                {/* Bouton d'inscription */}
                <TouchableOpacity
                    style={tw`bg-blue-500 py-4 rounded-lg mb-4 ${loading ? 'opacity-50' : ''}`}
                    onPress={handleRegister}
                    disabled={loading}
                >
                    <Text style={tw`text-white text-center font-semibold text-lg`}>
                        {loading ? 'Création...' : 'Créer mon compte'}
                    </Text>
                </TouchableOpacity>

                {/* Lien vers connexion */}
                <View style={tw`flex-row justify-center`}>
                    <Text style={tw`text-gray-600`}>Déjà un compte ? </Text>
                    <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
                        <Text style={tw`text-blue-500 font-semibold`}>Se connecter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}