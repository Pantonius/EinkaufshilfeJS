import { StyleSheet, View, TouchableOpacity, Image, TextInput } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useState } from "react";
import { CommonStyles } from "../style/CommonStyles";

export default function Counter({ style, onValueChange }) {
    const [count, setCount] = useState(1);

    return (
        <View style={{ ...style, flexDirection: 'row', }}>
            <TouchableOpacity style={{ ...styles.button, ...styles.left }} onPress={() => {
                    onValueChange(count - 1);
                    setCount(count - 1);
                }}>
                <Icon name="remove" style={styles.buttonIcon} />
            </TouchableOpacity>
            <TextInput style={styles.counterText}>{count}</TextInput>
            <TouchableOpacity style={{ ...styles.button, ...styles.right }} onPress={() => {
                    onValueChange(count + 1);
                    setCount(count + 1);
                }}>
                <Icon name="add" style={styles.buttonIcon} />
            </TouchableOpacity>

        </View>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: CommonStyles.neutral.color,
        padding: 2,
    },

    counterText: {
        backgroundColor: 'white',
        fontSize: 18,
        width: 32,
        textAlign: 'center',
    },

    buttonIcon: {
        marginVertical: 4,
        marginHorizontal: 2,
        fontSize: 16,
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