import { StyleSheet, View, FlatList, Text, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useState, useEffect } from "react";
import { openDatabase, removeItem } from "../util/db";
import { CommonStyles } from "../style/CommonStyles";
import Barcode from "../components/Barcode";

function Item({id, title, userid, purchaseinfoid, expirationdate, inventorylocationid, onRemove, removed}) {
    return (
        <View style={{...styles.item, backgroundColor: removed ? CommonStyles.negative.color : styles.item.backgroundColor }}>
            <View style={CommonStyles.hbox}>
                <View style={styles.itemInfo}>
                    <Text style={CommonStyles.cardTitle}>{title}</Text>
                    <Text>User: {userid}</Text>
                    <Text>PurchaseInfo: {purchaseinfoid}</Text>
                    <Text>Expiration Date: {expirationdate}</Text>
                    <Text>Inventory Location: {inventorylocationid}</Text>
                </View>
                <View style={styles.itemButtonArea}>
                    <TouchableOpacity style={styles.removeButton} onPress={() => {
                        onRemove(id);
                    }}>
                        <Icon name='delete-outline' style={styles.itemButtons} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default function RemoveItemModal({ route, navigation }) {
    const { barcode } = route.params;

    const [items, setItems] = useState(null);
    const [removed, setRemoved] = useState(null);

    useEffect(() => {
        openDatabase().transaction((tx) => {
            tx.executeSql('SELECT id, userid, purchaseinfoid, barcode, expirationdate, inventorylocationid, name, imageblob, productkind FROM item, product WHERE item.productbarcode = product.barcode AND item.productbarcode = ? ORDER BY id DESC', [barcode], (_, {rows: { _array }}) => {
                setItems(_array.length > 0 ? _array : null);
                
                if(_array.length > 0)
                    navigation.setOptions({ title: _array[0].name });
            });
        });
    }, [removed]);

    const renderItem = ({ item }) => {
        return (<Item   id={item.id}
                        title={item.name}
                        userid={item.userid}
                        purchaseinfoid={item.purchaseinfoid}
                        expirationdate={item.expirationdate}
                        inventorylocationid={item.inventorylocationid}
                        onRemove={(id) => {
                            setRemoved(id);

                            setTimeout(() => {
                                removeItem(id);
                                setItems(items);
                                setRemoved(null);
                            }, 300);
                        }}
                        removed={removed === item.id}
                />);
    }

    return (
        <View style={styles.container}>
            <View style={{ marginVertical: 24, ...CommonStyles.center}}>
                <Barcode barcode={barcode} />
            </View>
            <FlatList   ListHeaderComponent={
                            <Text style={{ marginHorizontal: CommonStyles.card.paddingHorizontal }}>{items ? items.length : 0} Results</Text>
                        }
                        style={styles.list}
                        data={items}
                        renderItem={renderItem}
                        keyExtractor={item => item.id} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginHorizontal: 8,
    },

    list: {
        marginBottom: 16,
    },

    item: {
        ...CommonStyles.card,
        flex: 1,
        paddingHorizontal: 0,
        paddingVertical: 0,
    },

    itemInfo: {
        flex: 5,
        marginHorizontal: CommonStyles.card.paddingHorizontal,
        marginVertical: CommonStyles.card.paddingVertical,
    },

    itemButtonArea: {
        width: 48,
    },

    removeButton: {
        backgroundColor: CommonStyles.negative.color,
        borderTopRightRadius: CommonStyles.card.borderRadius,
        borderBottomRightRadius: CommonStyles.card.borderRadius,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    itemButtons: {
        fontSize: 32,
    },
});