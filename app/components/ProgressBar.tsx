import { View } from 'react-native';
import tw from 'twrnc';

export const ProgressBar = ({ progress }) => {
    return (
        <View style={tw`h-2 bg-gray-200 rounded-full overflow-hidden`}>
            <View
                style={[
                    tw`h-full bg-blue-500`,
                    { width: `${Math.min(100, Math.max(0, progress))}%` }
                ]}
            />
        </View>
    );
};