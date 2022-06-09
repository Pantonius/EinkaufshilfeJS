import * as SQlite from 'expo-sqlite';
import { useState } from 'react';

const db = SQlite.openDatabase('inventory');

export function openDatabase() {
    db.transaction((tx) => {
        // Household
        tx.executeSql('CREATE TABLE IF NOT EXISTS household(' + 
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
            'name TEXT UNIQUE)');

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
            'name TEXT,' +
            'householdid INTEGER,' +
            'FOREIGN KEY(householdid) REFERENCES household(id))');

        // User
        tx.executeSql('CREATE TABLE user(' +
            'id INTEGER PRIMARY KEY AUTOINCREMENT,' +
            'name TEXT UNIQUE,' +
            'email TEXT UNIQUE,' +
            'lastLogin TEXT)');
        
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

    return db;
}

export function initializeDB() {
    openDatabase();
    ['Getränk', 'Nahrungsmittel', 'Hygieneprodukt', 'Reinigungsmittel', 'Sonstiges'].forEach((kind) => {
        insertProductkind(kind);
    });
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
        //tx.executeSql('SELECT barcode, name, productkind FROM product', [], (_, { rows }) => console.log(JSON.stringify(rows)));
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

export function insertItem(userid, purchaseinfoid, productbarcode, expirationdate) {
    db.transaction((tx) => {
        tx.executeSql('INSERT INTO item(userid, purchaseinfoid, productbarcode, expirationdate) VALUES (?, ?, ?, ?)', [userid, purchaseinfoid, productbarcode, expirationdate && expirationdate.toISOString()]);
        tx.executeSql('SELECT * FROM item', [], (_, { rows }) => console.log(JSON.stringify(rows)));
    }, (e) => {
        console.log('Error: ' + e.message);
    });
}

export function insertPurchaseinfo(date, ondone = () => {}) {
    db.transaction((tx) => {
        tx.executeSql('INSERT INTO purchaseinfo(date) VALUES (?)', [date && date.toISOString()]);
        tx.executeSql('SELECT * FROM purchaseinfo', [], (_, { rows }) => console.log(JSON.stringify(rows)));

        if(ondone)
            tx.executeSql('SELECT id FROM purchaseinfo ORDER BY id desc LIMIT 1', [], (_, { rows: { _array } }) => { ondone(_array[0].id) });
    }, (e) => {
        console.log('Error: ' + e.message);
    });
}

export function insertInventoryLocation(name, householdid) {
    db.transaction((tx) => {
        tx.executeSql('INSERT INTO inventorylocation(name, householdid) VALUES (?, ?)', [name, householdid]);
    }, (e) => {
        console.log('Error: ' + e.message);
    });
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
    });
    
    initializeDB();

    console.log('DATABASE REFRESHED');
}


// UTIL


export function formatDate(date) {
    if(!date) return `--.--.----`;

    const double = (num) => {
      return ('' + num).length > 1 ? ('' + num) : ('0' + num);
    }

    return `${double(date.getDate())}.${double(date.getMonth())}.${date.getFullYear()}`;
}