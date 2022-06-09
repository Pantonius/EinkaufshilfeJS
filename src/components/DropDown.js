import { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { CommonStyles } from '../style/CommonStyles';
import * as CommonColors from '../style/CommonColors';

export default function DropDown({prompt, editable, options = [], startValue, onSelected = () => {}}) {
    const [showOptions, setShowOptions] = useState(false);

    const data = options.map((val, i) => ({
        id: i,
        name: val.name,
    }));

    let buildOptions = data.map((val, i) => {
        return (
            <TouchableOpacity key={String(i)} style={{
                backgroundColor: startValue && data.findIndex((val) => val.name === startValue) === val.id ? 'pink' : hide
            }} onPress={() => onSelectedValue(val)}>
                
                <Text key={String(i)} style={styles.itemText}>{val.name}</Text>
            </TouchableOpacity>
        );
    });

    const onSelectedValue = (val) => {
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
            }} onPress={() => { 
                if(editable)
                    setShowOptions(!showOptions);
            }}>
                <Text style={{
                    color: startValue ? CommonColors.text : CommonColors.prompt
                }}>{startValue ? startValue : (prompt ? prompt : "Wähle eine Option...")}</Text>
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
                {showOptions && buildOptions}
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