import { View, StyleSheet, FlatList, Text, Image, TouchableOpacity } from "react-native";
import { useEffect, useState } from "react";
import { openDatabase, removeItem } from "../util/db";
import { CommonStyles } from "../style/CommonStyles";

function Item({id, title, userid, purchaseinfoid, expirationdate, inventorylocationid, onRemove, onEdit, removed}) {
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
                    <TouchableOpacity style={styles.editButton} onPress={() => {
                        onEdit(id);
                    }}>
                        <Image style={styles.itemButtons} source={require('../img/edit_black.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.removeButton} onPress={() => {
                        onRemove(id);
                    }}>
                        <Image style={styles.itemButtons} source={require('../img/delete_black.png')} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
}

export default function ItemOfTypeScreen({ route, navigation }) {
    const { barcode } = route.params;

    const [items, setItems] = useState(null);
    const [removed, setRemoved] = useState(null);

    useEffect(() => {
        openDatabase().transaction((tx) => {
            tx.executeSql('SELECT id, userid, purchaseinfoid, barcode, expirationdate, inventorylocationid, name, imageblob, productkind FROM item, product WHERE item.productbarcode = product.barcode AND item.productbarcode = ? ORDER BY id DESC', [barcode], (_, {rows: { _array }}) => {
                setItems(_array.length > 0 ? _array : null);
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
                        onEdit={(id) => {
                            navigation.navigate('EditItem', { id: id, name: item.name});
                        }}
                        removed={removed === item.id}
                />);
    }

    return (
        <View style={styles.container}>
            <FlatList ListHeaderComponent={
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
        borderBottomRightRadius: CommonStyles.card.borderRadius,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    editButton: {
        backgroundColor: CommonStyles.neutral.color,
        borderTopRightRadius: CommonStyles.card.borderRadius,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2,
    },

    itemButtons: {
        width: 24,
        height: 24,
    },
});
