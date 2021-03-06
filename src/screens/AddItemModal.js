import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Barcode from '../components/Barcode';
import Counter from '../components/Counter';
import DropDown from '../components/DropDown';
import DatePicker from '../components/DatePicker';
import { formatDate, insertItem, insertProduct, insertPurchaseinfo, openDatabase } from '../util/db';
import { auth } from '../util/firebase';
import { CommonStyles } from '../style/CommonStyles';
import * as CommonColors from '../style/CommonColors';

function KnownText({ known }) {
    if(!known) {
        return (
            <View style={{...CommonStyles.hbox, ...CommonStyles.center}}>
                <Image style={{ width: 24, height: 24 }} source={require('../img/close.png')} />

                <Text style={{color: CommonColors.negative }}>Unbekannt</Text>
            </View>
        );
    }
    
    return (
        <View style={{...CommonStyles.hbox, ...CommonStyles.center}}>
            <Image style={{ width: 24, height: 24 }} source={require('../img/done.png')} />

            <Text style={{ color: CommonColors.positive }}>Bekannt</Text>
        </View>
    ); 
}

function ProductImage({ data }) {
    return (
        <Image
            style={data ? { ...CommonStyles.roundImage, width: '100%', height: '100%' } : {  }}
            source={data ? { uri: 'data:image/jpg;base64,' + data } : require('../img/camera.png')} />
    );
}

export default function AddItemModal({ route, navigation }) {
    const { barcode, imageData } = route.params;

    const [product, setProduct] = useState(null);
    const [productKinds, setProductKinds] = useState([]);

    const [productName, setProductName] = useState(null);
    const [productKind, setProductKind] = useState(null);
    const [productImage, setProductImage] = useState(imageData);

    const [expirationDate, setExpirationDate] = useState(null);

    const [count, setCount] = useState(1);

    useEffect(() => {
        openDatabase().transaction((tx) => {
            // Fill DropDown with productkind
            tx.executeSql('SELECT * FROM productkind', [], (_, { rows: {_array} }) => {
                setProductKinds(_array);
            });

            // Check for occurences of the barcode
            tx.executeSql('SELECT * FROM product WHERE barcode = ?',
                [barcode],
                (_, { rows: {_array} }) => {
                    if(_array.length === 0) return;

                    const prod = _array[0];
                    const kind = prod.productkind;
                    const image = prod.imageblob;
                    
                    console.log(JSON.stringify(prod));

                    setProduct(prod);
                    setProductName(prod.name);
                    setProductKind(kind);
                    setProductImage(image);
                });
        });
    }, []);

    useEffect(() => {
        if(route.params?.imageData) {
            setProductImage(route.params?.imageData);
        }
    }, [route.params?.imageData]);

    return (
        <View style={styles.container}>
            <View>
                <View style={{ width: '100%', height: 256, marginTop: 'auto' }}>
                    {!(product && productImage) ? 
                        <TouchableOpacity style={{ ...CommonStyles.roundImage, width: '100%', height: '100%', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, .4)' }} onPress={() => {
                            navigation.navigate('Camera');
                        }}>
                            <ProductImage data={productImage} />
                        </TouchableOpacity>
                    :
                        <ProductImage data={productImage} />
                    }
                </View>
                <View style={{ marginBottom: 24, ...CommonStyles.center}}>
                    <Barcode barcode={barcode} />

                    <KnownText known={ product !== null } />
                </View>

                <TextInput editable={product == null} style={CommonStyles.textInput} placeholder='Produktname' onChangeText={(text) => setProductName(text)}>{productName}</TextInput>
                <DropDown editable={product == null} options={productKinds} startValue={productKind} prompt={'Art des Produkts...'} onSelected={(val) => setProductKind(val.name)} />
                <Counter style={{ marginLeft: 'auto', marginVertical: 8, marginRight: 8, }} onValueChange={(value) => {
                    setCount(value);
                }} />

                <Text>Mindestens haltbar bis:</Text>
                <DatePicker prompt={formatDate(null)} onChange={(date) => setExpirationDate(new Date(date))} />
            </View>
            
            <View style={styles.buttonBox}>
                <TouchableOpacity style={styles.actionButton} onPress={() => navigation.goBack() }>
                    <Text style={styles.actionButtonText}>Abbruch</Text>
                </TouchableOpacity>
                <TouchableOpacity style={{...styles.actionButton, backgroundColor: CommonColors.positive}} onPress={() => {
                    insertProduct(barcode, productName, productKind, productImage);
                    const now = new Date(Date.now());
                    insertPurchaseinfo(now, (purchaseid) => {
                        console.log('LAST PURCHASE: ' + purchaseid);
                        console.log('EXPIRATION: ' + expirationDate);

                        for(let i = 0; i < count; i++) {
                            insertItem(auth.currentUser.displayName, purchaseid, barcode, expirationDate);
                        }
                    });
                    
                    navigation.goBack();
                }}>
                    <Text style={styles.actionButtonText}>Hinzuf??gen</Text>
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

    buttonBox: {
        ...CommonStyles.hbox,
        marginBottom: 32,
    }
});