import { StyleSheet, View, TouchableOpacity, Image, TextInput } from "react-native";
import { useState } from "react";

export default function Counter({ style, onValueChange }) {
    const [count, setCount] = useState(1);

    return (
        <View style={{ ...style, flexDirection: 'row', }}>
            <TouchableOpacity style={{ ...styles.button, ...styles.left }} onPress={() => {
                    onValueChange(count - 1);
                    setCount(count - 1);
                }}>
                <Image style={styles.buttonIcon} source={require('../img/remove_black.png')} />
            </TouchableOpacity>
            <TextInput style={styles.counterText}>{count}</TextInput>
            <TouchableOpacity style={{ ...styles.button, ...styles.right }} onPress={() => {
                    onValueChange(count + 1);
                    setCount(count + 1);
                }}>
                <Image style={styles.buttonIcon} source={require('../img/add_black.png')} />
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: 'pink',
        padding: 2,
    },

    counterText: {
        backgroundColor: 'white',
        fontSize: 18,
        width: 32,
        textAlign: 'center',
    },

    buttonIcon: {
        width: 24,
        height: 24,
    },

    left: {
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
    },

    right: {
        borderTopRightRadius: 8,
        borderBottomRightRadius: 8,
    }
});