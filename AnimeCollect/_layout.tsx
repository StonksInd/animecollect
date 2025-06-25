import { Stack } from 'expo-router';

const Layout = () => {
    return (
        <Stack>
            <Stack.Screen name="(tabs)/index" options={{ headerShown: false }} />
            <Stack.Screen name="anime/[id]" options={{ presentation: 'modal' }} />
            <Stack.Screen name="anime/[id]/[episode]" options={{ presentation: 'modal' }} />
        </Stack>
    );
};

export default Layout;