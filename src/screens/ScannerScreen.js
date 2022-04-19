import { StackActions} from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View} from 'react-native';

export default function ScannerScreen({ route, navigation }) {
  const { addItem } = route.params;

  const [hasPermission, setHasPermission] = useState(null);
  const requestPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  }

  useEffect(() => {
    requestPermission();
  }, []);

  const handleBarCodeScanned = ({data}) => {
    navigation.dispatch(StackActions.replace('Scanner', {addItem: addItem}));

    if(addItem === 'true')
      navigation.navigate('AddItem', { barcode: data });
    else
      navigation.navigate('RemoveItem', { barcode: data });
  };

  if(hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }

  if(hasPermission === false) {
    return <Text>No access to camera (permission denied)</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.barcodeContainer}>
        <View style={styles.scanner}>
          <BarCodeScanner onBarCodeScanned={handleBarCodeScanned}
            style={{height: 400, width: 400}} />
        </View>
        <Text style={styles.overlayText}>{addItem === 'true' ? 'Einchecken' : 'Auschecken'}</Text>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
  },

  barcodeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  scanner: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
    backgroundColor: 'tomato'
  },

  overlayText: {
    color: 'white',
    backgroundColor: 'black',
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    fontSize: 24,

    width: 300,
    textAlign: 'center',
    padding: 4,
    margin: 4,
    marginTop: 0,
  },

  overlayButton: {
    backgroundColor: 'black',
    borderRadius: 24,
  }
});