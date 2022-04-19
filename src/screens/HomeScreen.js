import { StatusBar } from "expo-status-bar";
import { StyleSheet, View, Button, FlatList, Text, TouchableOpacity, Image } from "react-native";
import { useState, useEffect } from "react";
import { CommonStyles } from "../style/CommonStyles";
import { openDatabase, refreshDB } from "../util/db";
import { useIsFocused } from "@react-navigation/native";

function Item({title, imageSource, amount, onPress}) {
    return (
        <TouchableOpacity style={CommonStyles.card} onPress={onPress}>
            <View style={CommonStyles.hbox}>
                <Text style={styles.itemText}>{amount}x</Text>
                <View style={{ marginHorizontal: 4 }} />
                <Text style={styles.itemText}>{title}</Text>
            </View>
        </TouchableOpacity>
    );
}

export default function HomeScreen({navigation}) {
    const [items, setItems] = useState(null);

    useEffect(() => {
        openDatabase().transaction((tx) => {
            // Get all items
            tx.executeSql('SELECT id, barcode, imageblob, name, productkind, COUNT(id) as amount FROM item, product WHERE item.productbarcode = product.barcode GROUP BY name ORDER BY id asc', [],(_, { rows: {_array} }) => {
                setItems(_array.length > 0 ? _array : null);
            });
        });
    }, [useIsFocused()]);

    const renderItem = ({item}) => {
        return (<Item title={item.name} amount={item.amount} imageSource={'data:image/jpg;base64,' + item.imageblob} onPress={() => navigation.navigate('Items', { barcode: item.barcode, name: item.name })} />);
    }

    return (
        <View style={styles.container}>
            <StatusBar />
            <Button title="Einchecken" onPress={() => navigation.navigate('Scanner', { addItem: 'true' })} />
            <Button title="Auschecken" onPress={() => navigation.navigate('Scanner', { addItem: 'false' })} />
            <Button title="DB säubern" onPress={() => refreshDB()} />
            <FlatList nestedScrollEnabled={true} data={items} renderItem={renderItem} keyExtractor={item => item.id} />
        </View>);
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
    },

    itemText: {
        ...CommonStyles.text,
        fontSize: 18,
    }
});