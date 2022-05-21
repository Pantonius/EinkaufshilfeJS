import { useState, useEffect } from "react"
import { View, Text, Image, ScrollView } from "react-native";
import Divider from "../components/Divider";
import { CommonStyles } from "../style/CommonStyles";
import { openDatabase } from "../util/db";
import FontAwesome5Icon from 'react-native-vector-icons/FontAwesome5';

export default function EditItemModal({ route, navigation }) {
    const { id, name } = route.params;
    navigation.setOptions({ title: name });

    const [item, setItem] = useState(null);
    const [product, setProduct] = useState(null);
    const [purchaseinfo, setPurchaseinfo] = useState(null);
    const [inventorylocation, setInventorylocation] = useState(null);


    useEffect(() => {
        openDatabase().transaction((tx) => {
            if(item === null) return;

            // Product Info
            tx.executeSql('SELECT * FROM product WHERE product.barcode = ?', [item.productbarcode], (_, { rows: { _array }}) => {
                setProduct(_array.length > 0  ? _array[0] : null);
            }, (tx, e) => {
                console.log('PRODUCT: ' + e.message);
            });

            // Purchase Info
            tx.executeSql('SELECT date, street, streetnumber, postalcode, city.name AS city, country.name AS country FROM purchaseinfo, address, city, country WHERE purchaseinfo.addressid = address.id AND address.cityid = city.id AND city.countryid = country.id AND purchaseinfo.id = ?', [item.purchaseinfoid], (_, { rows: { _array }}) => {
                setPurchaseinfo(_array.length > 0  ? _array[0] : null);
            }, (tx, e) => {
                console.log('PURCHASEINFO: ' + e.message);
            });

            // Inventory Location
            tx.executeSql('SELECT * FROM inventorylocation WHERE inventorylocation.id = ?', [item.inventorylocationid], (_, { rows: { _array } }) => {
                setInventorylocation(_array.length > 0  ? _array[0] : null);
            }, (tx, e) => {
                console.log('INVENTORYLOCATION: ' + e.message);
            });
        });
    }, [item]);

    useEffect(() => {
        openDatabase().transaction((tx) => {
            // Item
            tx.executeSql('SELECT * FROM item WHERE item.id = ?', [id], (_, { rows: { _array }}) => {
                setItem(_array.length > 0 ? _array[0] : null);
            
                navigation.setOptions({ title: _array[0].name });
            });

            console.log(item);
        });
    }, []);

    return (
        <ScrollView>
            <View style={CommonStyles.card}>
                <Text style={CommonStyles.cardHeader}>Product Information</Text>
                <View style={CommonStyles.hbox}>
                    <Text style={CommonStyles.formTextTitle}>Name:</Text>
                    <Text style={CommonStyles.formTextDesc}>{product ? product.name : ''}</Text>
                </View>
                <View style={CommonStyles.hbox}>
                    <Text style={CommonStyles.formTextTitle}>Kind:</Text>
                    <Text style={CommonStyles.formTextDesc}>{product ? product.productkind : ''}</Text>
                </View>
                {product && product.imageblob ? <Image style={{ ...CommonStyles.roundImage, width: '90%', height: 256, margin: 12 }} source={{ uri: 'data:image/jpg;base64,' + product.imageblob }} /> : <View />}
                <View style={{ marginVertical: 16 }} />
                <View style={CommonStyles.hbox}>
                    <Text style={CommonStyles.formTextTitle}>Expiration Date:</Text>
                    <Text style={CommonStyles.formTextDesc}> {product ? product.expirationdate : ''}</Text>
                </View>

                <Divider />
                
                <Text style={CommonStyles.cardHeader}>Purchase Info</Text>
                <View style={CommonStyles.hbox}>
                    <Text style={CommonStyles.formTextTitle}>Date:</Text>
                    <Text style={CommonStyles.formTextDesc}>{purchaseinfo ? purchaseinfo.date : ''}</Text>
                </View>
                <View style={CommonStyles.hbox}>
                    <Text style={CommonStyles.formTextTitle}>Address:</Text>
                    <Text style={CommonStyles.formTextDesc}>{purchaseinfo ? purchaseinfo.street + purchaseinfo.streetnumber + ',\n' + purchaseinfo.postalcode + ',\n' + purchaseinfo.city + ',\n' + purchaseinfo.country : ''}</Text>
                </View>
                
                <Divider />
                
                <Text style={CommonStyles.cardHeader}>Inventory Location</Text>
                <View style={CommonStyles.hbox}>
                    <Text style={CommonStyles.formTextTitle}>Name:</Text>
                    <Text style={CommonStyles.formTextDesc}>{inventorylocation ? inventorylocation.name : ''}</Text>
                </View>
            </View>
        </ScrollView>
    );
}