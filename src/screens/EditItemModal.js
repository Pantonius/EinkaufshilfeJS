import { useState, useEffect } from "react";
import { View, Text, Image, ScrollView, TextInput } from "react-native";
import Divider from "../components/Divider";
import { CommonStyles } from "../style/CommonStyles";
import * as CommonColors from "../style/CommonColors";
import { openDatabase, formatDate } from "../util/db";

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
            if(item.purchaseinfoid != null) {
                tx.executeSql('SELECT * FROM purchaseinfo WHERE id = ?', [item.purchaseinfoid], (_, { rows: { _array }}) => {
                    setPurchaseinfo(_array.length > 0  ? _array[0] : null);
                }, (tx, e) => {
                    console.log('PURCHASEINFO: ' + e.message);
                });
            }

            // Inventory Location
            if(item.inventorylocationid) {
                tx.executeSql('SELECT * FROM inventorylocation WHERE inventorylocation.id = ?', [item.inventorylocationid], (_, { rows: { _array } }) => {
                    setInventorylocation(_array.length > 0  ? _array[0] : null);
                }, (tx, e) => {
                    console.log('INVENTORYLOCATION: ' + e.message);
                });
            }
        });
    }, [item]);

    useEffect(() => {
        openDatabase().transaction((tx) => {
            // Item
            tx.executeSql('SELECT * FROM item WHERE item.id = ?', [id], (_, { rows: { _array }}) => {
                setItem(_array.length > 0 ? _array[0] : null);
            });

            console.log(item);
        });
    }, []);

    return (
        <ScrollView>
            <View style={CommonStyles.card}>
                {product &&
                    <View>
                        <Text style={CommonStyles.cardHeader}>Produkt</Text>
                        <View style={CommonStyles.hbox}>
                            <Text style={CommonStyles.formTextTitle}>Name:</Text>
                            <Text style={CommonStyles.formTextDesc}>{product ? product.name : ''}</Text>
                        </View>

                        {product.productkind && 
                            <View style={CommonStyles.hbox}>
                                <Text style={CommonStyles.formTextTitle}>Art:</Text>
                                <Text style={CommonStyles.formTextDesc}>{product.productkind}</Text>
                            </View>
                        }

                        {product.imageblob &&
                            <Image
                                style={{ ...CommonStyles.roundImage, width: '90%', height: 256, margin: 12 }}
                                source={{ uri: 'data:image/jpg;base64,' + product.imageblob }} />
                        }
                        
                        {item.expirationdate &&
                            <View>
                                <View style={{ marginVertical: 16 }} />
                                <View style={CommonStyles.hbox}>
                                    <Text style={CommonStyles.formTextTitle}>Mindestens haltbar bis:</Text>
                                    <Text style={CommonStyles.formTextDesc}> {formatDate(new Date(item.expirationdate))}</Text>
                                </View>
                            </View>
                        }
                    </View>
                }
                
                {purchaseinfo &&
                    <View>
                        <Divider />
                        <Text style={CommonStyles.cardHeader}>Kaufinformationen</Text>

                        {purchaseinfo.date && 
                            <View style={CommonStyles.hbox}>
                                <Text style={CommonStyles.formTextTitle}>Kaufdatum:</Text>
                                <Text style={CommonStyles.formTextDesc}>{formatDate(new Date(purchaseinfo.date))}</Text>
                            </View>
                        }

                        {purchaseinfo.country &&
                            <View style={CommonStyles.hbox}>
                                <Text style={CommonStyles.formTextTitle}>Adresse:</Text>
                                <Text style={CommonStyles.formTextDesc}>{purchaseinfo.street + purchaseinfo.streetnumber + ',\n' + purchaseinfo.postalcode + ',\n' + purchaseinfo.city + ',\n' + purchaseinfo.country}</Text>
                            </View>
                        }
                    </View>
                }

                <Divider />
                
                <Text style={CommonStyles.cardHeader}>Lagerinformationen</Text>
                <View style={CommonStyles.hbox}>
                    <Text style={CommonStyles.formTextTitle}>Name:</Text>
                    <TextInput style={[CommonStyles.formTextDesc, CommonStyles.textInput, { backgroundColor: CommonColors.neutral, }]} placeholder={'Name'}>{(inventorylocation && inventorylocation.name) && inventorylocation.name}</TextInput>
                </View>
                
            </View>
        </ScrollView>
    );
}