import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { runMigrations } from './db/migrations';

export default function RootLayout() {
    useEffect(() => {
        runMigrations().catch(console.error);
    }, []);

    return (
        <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
        </Stack>
    );
}