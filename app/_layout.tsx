import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { runMigrations } from './db/migrations';
import { AuthProvider } from './hooks/useAuth';

export default function RootLayout() {
    useEffect(() => {
        // Initialiser la base de données au démarrage
        runMigrations().catch(console.error);
    }, []);

    return (
        <AuthProvider>
            <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
            </Stack>
        </AuthProvider>
    );
}