import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import tw from 'twrnc';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#3b82f6',
        tabBarStyle: tw`bg-white border-t border-gray-200`,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Nouveautés',
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="collection"
        options={{
          title: 'Ma Collection',
          tabBarIcon: ({ color }) => (
            <Ionicons name="bookmark" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="search"
        options={{
          title: 'Recherche',
          tabBarIcon: ({ color }) => (
            <Ionicons name="search" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}