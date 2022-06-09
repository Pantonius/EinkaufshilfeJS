import { View, StyleSheet, FlatList, Text, TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';
import { useEffect, useState } from "react";
import { openDatabase, removeItem, formatDate } from "../util/db";
import { CommonStyles } from "../style/CommonStyles";
import * as CommonColors from "../style/CommonColors";

function Item({id, title, userid, purchasedate, expirationdate, inventorylocation, onRemove, onEdit, removed}) {
    return (
        <View style={{...styles.item, backgroundColor: removed ? CommonColors.negative : styles.item.backgroundColor }}>
            <View style={CommonStyles.hbox}>
                <View style={styles.itemInfo}>
                    <Text style={CommonStyles.cardTitle}>{title}</Text>
                    <Text>User: {userid}</Text>
                    <Text>Kaufdatum: {formatDate(new Date(purchasedate))}</Text>
                    <Text>Mindestshaltbarkeitsdatum: {formatDate(new Date(expirationdate))}</Text>
                    <Text>Aufbewahrungsort: {inventorylocation}</Text>
                </View>
                <View style={styles.itemButtonArea}>
                    <TouchableOpacity style={styles.editButton} onPress={() => {
                        onEdit(id);
                    }}>
                        <Icon name='edit' style={styles.itemButtons} />
                    </TouchableOpacity>
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

export default function ItemOfTypeScreen({ route, navigation }) {
    const { barcode } = route.params;

    const [items, setItems] = useState(null);
    const [removed, setRemoved] = useState(null);

    useEffect(() => {
        openDatabase().transaction((tx) => {
            tx.executeSql('SELECT item.id, userid, barcode, expirationdate, product.name, imageblob, productkind, purchaseinfo.date AS purchasedate FROM item, product, purchaseinfo WHERE item.productbarcode = product.barcode AND item.productbarcode = ? AND item.purchaseinfoid = purchaseinfo.id ORDER BY item.id DESC', [barcode], (_, {rows: { _array }}) => {
                setItems(_array.length > 0 ? _array : null);
                _array.forEach((elem) => console.log(JSON.stringify(elem)));
            });
        }, (error) => console.log(error));
    }, [removed]);

    const renderItem = ({ item }) => {
        return (<Item   id={item.id}
                        title={item.name}
                        userid={item.userid}
                        purchasedate={item.purchasedate}
                        expirationdate={item.expirationdate}
                        inventorylocation={null}
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
        backgroundColor: CommonColors.negative,
        borderBottomRightRadius: CommonStyles.card.borderRadius,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },

    editButton: {
        backgroundColor: CommonColors.neutral,
        borderTopRightRadius: CommonStyles.card.borderRadius,
        alignItems: 'center',
        justifyContent: 'center',
        flex: 2,
    },

    itemButtons: {
        fontSize: 32,
    },
});
