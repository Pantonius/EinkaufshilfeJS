import { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { CommonStyles } from '../style/CommonStyles';

export default function DropDown({prompt, options = [], startValue = {}, onSelected = () => {}}) {
    const [showOptions, setShowOptions] = useState(false);
    const [value, setValue] = useState(startValue);

    let data = options.map((val, i) => ({
        id: i,
        name: val,
    }));

    const onSelectedValue = (val) => {
        setValue(val);
        setShowOptions(false);

        onSelected(val);
    };

    const hide = 'rgba(0, 0, 0, 0)';

    return (
        <View>
            <TouchableOpacity activeOpacity={0.8} style={{
                ...styles.dropdown,
                borderBottomWidth: showOptions ? 0 : styles.dropdown.borderWidth,
                borderBottomLeftRadius: showOptions ? 0 : styles.dropdown.borderRadius,
                borderBottomRightRadius: showOptions ? 0 : styles.dropdown.borderRadius,
                marginBottom: showOptions ? 0 : styles.dropdown.marginBottom,
            }} onPress={() => setShowOptions(!showOptions)}>
                <Text style={{
                    color: value.name === undefined ? CommonStyles.prompt.color : CommonStyles.text.color
                }}>{value.name !== undefined ? value.name : (prompt ? prompt : "Wähle eine Option...")}</Text>
            </TouchableOpacity>

            <View style={{
                backgroundColor: showOptions ? '#f8f8f8' : hide,
                borderWidth: styles.dropdown.borderWidth,
                borderTopWidth: 0,
                borderColor: showOptions ? styles.dropdown.borderColor : hide,
                margin: styles.dropdown.margin,
                marginTop: 0,
                marginBottom: showOptions ? styles.dropdown.marginBottom : 0,
            }}>
                {showOptions && data.map((val, i) => {
                    return (
                        <TouchableOpacity style={{
                            backgroundColor: value.id === val.id ? 'pink' : hide
                        }} onPress={() => onSelectedValue(val)}>
                            
                            <Text style={styles.itemText} key={String(i)}>{val.name}</Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
            
        </View>
    );
}

const styles = StyleSheet.create({
    dropdown: {
        ...CommonStyles.textInput,
        borderColor: '#aaa',
        borderWidth: 1.6,
        borderRadius: 8,
        minHeight: 42,
        justifyContent: "center",
    },

    itemText: {
        ...CommonStyles.text,
        marginVertical: 2,
        marginHorizontal: 8,
    },
});