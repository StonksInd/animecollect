import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import tw from 'twrnc';

type ProgressBarProps = {
    progress: number;
    total: number;
};

const ProgressBar: React.FC<ProgressBarProps> = ({ progress, total }) => {
    const percentage = (progress / total) * 100;

    return (
        <View style={tw`w-full bg-gray-200 h-4 rounded-full`}>
            <View style={[tw`h-4 rounded-full bg-blue-500`, { width: `${percentage}%` }]} />
        </View>
    );
};

export default ProgressBar;