import { StackActions } from '@react-navigation/native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View} from 'react-native';

export default function ScannerScreen({navigation}) {
  const [hasPermission, setHasPermission] = useState(null);
  const requestPermission = async () => {
    const { status } = await BarCodeScanner.requestPermissionsAsync();
    setHasPermission(status === 'granted');
  }

  useEffect(() => {
    requestPermission();
  }, []);

  const handleBarCodeScanned = ({type, data}) => {
    console.log('Type: ' + type);

    navigation.dispatch(StackActions.replace('Scanner'));
    navigation.navigate('AddItem', { code: data });
  };

  if(hasPermission === null) {
    return <Text>Requesting camera permission</Text>;
  }

  if(hasPermission === false) {
    return <Text>No access to camera (permission denied)</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.scanner}>
        <BarCodeScanner onBarCodeScanned={handleBarCodeScanned}
          style={{height: 400, width: 400}} />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },

  scanner: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: 300,
    overflow: 'hidden',
    borderRadius: 50,
    backgroundColor: 'tomato'
  },

  overlayText: {
    color: 'white',
    backgroundColor: 'black',
    fontSize: 24,

    padding: 4,
    margin: 4,
  },

  overlayButton: {
    backgroundColor: 'black',
    borderRadius: 24,
  }
});