import * as SQlite from 'expo-sqlite';
import { useState } from 'react';

const db = SQlite.openDatabase('inventory');

export function openDatabase() {
    db.transaction((tx) => {
        // Country
        tx.executeSql('CREATE TABLE IF NOT EXISTS country(' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
            'name TEXT UNIQUE)');

        // City
        tx.executeSql('CREATE TABLE IF NOT EXISTS city(' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
            'name TEXT UNIQUE,' +
            'countryid INTEGER,' +
            'FOREIGN KEY(countryid) REFERENCES country(id))');

        // Address
        tx.executeSql('CREATE TABLE IF NOT EXISTS address(' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
            'street TEXT,' +
            'streetnumber INTEGER,' +
            'postalcode INTEGER,' +
            'cityid INTEGER,' +
            'FOREIGN KEY(cityid) REFERENCES city(id))');
        
        // PurchaseInfo
        tx.executeSql('CREATE TABLE IF NOT EXISTS purchaseinfo(' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
            'date TEXT,' +
            'addressid INTEGER,' +
            'FOREIGN KEY(addressid) REFERENCES address(id))');
        
        // InventoryLocation
        tx.executeSql('CREATE TABLE IF NOT EXISTS inventorylocation(' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
            'name TEXT UNIQUE)');

        // User
        tx.executeSql('CREATE TABLE IF NOT EXISTS user(' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
            'name TEXT,' +
            'email TEXT UNIQUE,' +
            'lastlogin TEXT)');
        
        // Product
        tx.executeSql('CREATE TABLE IF NOT EXISTS product(' +
            'barcode INTEGER PRIMARY KEY NOT NULL,' +
            'name TEXT UNIQUE,' +
            'productkind TEXT,' +
            'imageblob BLOB,' +
            'FOREIGN KEY(productkind) REFERENCES productkind(name))');
        
        // ProductKind
        tx.executeSql('CREATE TABLE IF NOT EXISTS productkind(' +
            'name TEXT PRIMARY KEY)');
        
        // Item
        tx.executeSql('CREATE TABLE IF NOT EXISTS item(' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
            'userid INTEGER,' +
            'purchaseinfoid INTEGER,' +
            'productbarcode INTEGER,'  +
            'expirationdate TEXT,'  +
            'inventorylocationid INTEGER,' +
            'FOREIGN KEY(userid) REFERENCES user(id),' +
            'FOREIGN KEY(purchaseinfoid) REFERENCES purchaseinfo(id),' +
            'FOREIGN KEY(productbarcode) REFERENCES product(id),' +
            'FOREIGN KEY(inventorylocationid) REFERENCES inventorylocation(id))')
    });

    insertCountry('Deutschland');
    insertProductkind('Getränk');
    insertProductkind('Alkohol');

    return db;
}

export function read(table, column) {
    const [items, setItems] = useState(null);

    db.transaction((tx) => {
        tx.executeSql('SELECT ? from ?',
            [column, table],
            (_, { rows: { _array } }) => setItems(_array));
    });

    return items;
}

export function insertCountry(name) {
    db.transaction((tx) => {
        tx.executeSql('INSERT OR ABORT INTO country(name) VALUES (?)', [name]);
        tx.executeSql('SELECT * FROM country', [], (_, { rows }) => console.log(JSON.stringify(rows)));
    }, (e) => {
        console.log('Error: ' + e.message);
    });
}

export function insertProduct(barcode, name, productKind, image) {
    db.transaction((tx) => {
        tx.executeSql('INSERT INTO product(barcode, name, productkind, imageblob) VALUES (?, ?, ?, ?)', [barcode, name, productKind, image]);
        tx.executeSql('SELECT * FROM product', [], (_, { rows }) => console.log(JSON.stringify(rows)));
    }, (e) => {
        console.log('Error: ' + e.message);
    });
}

export function insertProductkind(name) {
    db.transaction((tx) => {
        tx.executeSql('INSERT INTO productkind(name) VALUES (?)', [name]);
        tx.executeSql('SELECT * FROM productkind', [], (_, { rows }) => console.log(JSON.stringify(rows)));
    }, (e) => {
        console.log('Error: ' + e.message);
    });
}

export function insertItem(userid, purchaseinfoid, productbarcode) {
    db.transaction((tx) => {
        tx.executeSql('INSERT INTO item(userid, purchaseinfoid, productbarcode) VALUES (?, ?, ?)', [userid, purchaseinfoid, productbarcode]);
        tx.executeSql('SELECT * FROM item', [], (_, { rows }) => console.log(JSON.stringify(rows)));
    }, (e) => {
        console.log('Error: ' + e.message);
    });
}

export function insertPurchaseinfo(street, streetnumber, postalcode, city, country) {
    
}

export function removeItem(id) {
    db.transaction((tx) => {
        tx.executeSql('DELETE FROM item WHERE item.id = ?', [id]);
    }, (e) => {
        console.log('Error: ' + e.message);
    });
}

export function dropAddress() {
    db.transaction((tx) => 
        tx.executeSql('DROP TABLE address')
    );
}

export function dropCity() {
    db.transaction((tx) => 
        tx.executeSql('DROP TABLE city')
    );
}

export function dropCountry() {
    db.transaction((tx) => 
        tx.executeSql('DROP TABLE country')
    );
}

export function dropInventorylocation() {
    db.transaction((tx) => 
        tx.executeSql('DROP TABLE inventorylocation')
    );
}

export function dropItem() {
    db.transaction((tx) => 
        tx.executeSql('DROP TABLE item')
    );
}

export function dropProduct() {
    db.transaction((tx) => 
        tx.executeSql('DROP TABLE product')
    );
}

export function dropProductkind() {
    db.transaction((tx) => 
        tx.executeSql('DROP TABLE productkind')
    );
}

export function dropPurchaseinfo() {
    db.transaction((tx) => 
        tx.executeSql('DROP TABLE purchaseinfo')
    );
}

export function dropUser() {
    db.transaction((tx) => 
        tx.executeSql('DROP TABLE user')
    );
}

export function refreshDB() {
    // Drop all
    db.transaction((tx) => {
        tx.executeSql('DROP TABLE address');
        tx.executeSql('DROP TABLE city');
        tx.executeSql('DROP TABLE country');
        tx.executeSql('DROP TABLE inventorylocation');
        tx.executeSql('DROP TABLE item');
        tx.executeSql('DROP TABLE product');
        tx.executeSql('DROP TABLE productkind');
        tx.executeSql('DROP TABLE purchaseinfo');
        tx.executeSql('DROP TABLE user');
    })

    // reload
    openDatabase();
}