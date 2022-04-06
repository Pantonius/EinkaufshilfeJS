import { StatusBar } from "expo-status-bar";
import { View, Button } from "react-native";

export default function HomeScreen({navigation}) {
    return (
        <View>
            <StatusBar />
            <Button title="Go to Scanner" onPress={() => navigation.navigate('Scanner')} />
            
        </View>);
}