import { useState } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import DropDown from '../components/DropDown';
import { CommonStyles } from '../style/CommonStyles';

const itemTypes = ['Getränk', 'Suppe', 'Nudelgericht', 'Brot'];

export default function AddItemModal({route, navigation}) {
    const { code } = route.params;
    const [itemType, setItemType] = useState(null);

    return (
        <View style={styles.container}>
            <View>
                <View style={{ marginBottom: 24, ...CommonStyles.center}}>
                    <View style={{...styles.hbox, ...CommonStyles.center}}>
                        <Image style={{ width: 60, height: 60, }} source={require('../img/barcode-scan.png')} />
                        <Text style={styles.barCode}>{code}</Text>
                    </View>
                    <View style={{...styles.hbox, ...CommonStyles.center}}>
                        <Image style={{ width: 24, height: 24 }} source={require('../img/close.png')} />

                        <Text style={{ ...CommonStyles.negative }}>Unbekannt</Text>
                    </View>
                </View>

                <TextInput style={CommonStyles.textInput} placeholder='Produktname' />
                <DropDown options={itemTypes} prompt={'Art des Produkts...'} onSelected={(val) => setItemType(val)} />
            </View>
            
            <View style={styles.hbox}>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.goBack() }>
                    <Text style={styles.actionButtonText}>Abbruch</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{...styles.actionButton, backgroundColor: 'springgreen'}} onPress={() => {
                    // TODO Add

                }}>
                    <Text style={styles.actionButtonText}>Hinzufügen</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 8,

        justifyContent: 'space-between',
    },

    barCode: {
        marginHorizontal: 8,

        fontSize: 24,
        fontFamily: 'monospace',
    },

    hbox: {
        width: '100%',
        flexDirection: 'row',
    },

    actionButton: {
        backgroundColor: 'slategrey',
        borderRadius: 4,
        padding: 8,
        margin: 32,
        flexBasis: 124,
    },

    actionButtonText: {
        color: 'white',
        textAlign: 'center',
        fontSize: 18,
    },
});