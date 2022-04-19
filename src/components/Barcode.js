import { StyleSheet } from 'react-native';
import { View, Image, Text } from 'react-native';
import { CommonStyles } from '../style/CommonStyles';

export default function Barcode({ barcode }) {
    return (
        <View style={{...CommonStyles.hbox, ...CommonStyles.center}}>
            <Image style={{ width: 60, height: 60, }} source={require('../img/barcode-scan.png')} />
            <Text style={styles.barCode}>{barcode}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    barCode: {
        marginHorizontal: 8,

        fontSize: 24,
        fontFamily: 'monospace',
    },
});