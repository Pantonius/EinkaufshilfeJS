import { StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { View, Text } from 'react-native';
import { CommonStyles } from '../style/CommonStyles';

export default function Barcode({ barcode }) {
    return (
        <View style={{...CommonStyles.hbox, ...CommonStyles.center}}>
            <Icon name='barcode' style={styles.icon} />
            <Text style={styles.barCode}>{barcode}</Text>
        </View>
    );
}

const styles = StyleSheet.create({

    icon: {
        fontSize: 60,
    },

    barCode: {
        marginHorizontal: 8,

        fontSize: 24,
        fontFamily: 'monospace',
    },
});