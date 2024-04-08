

const express = require('express');
const router = express.Router();

const { client, dbName } = require('../network/mongodb');
const mysqlConnection = require('../network/mysql')();
const collectionName = 'product';
const dbTable = 'product';
const dbJoinedTable = 'productpic';

function getProducts() {

    return new Promise((resolve, reject) => {
        mysqlConnection.query('SELECT * FROM ' + dbTable, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(rows);
            }
        });
    });
}
function getProductPics() {

    return new Promise((resolve, reject) => {
        mysqlConnection.query('SELECT * FROM ' + dbJoinedTable, function (err, rows, fields) {
            if (err) {
                return reject(err);
            }
            else {
                return resolve(rows);
            }
        });
    });
}

router.get('/test', async (req, res) => {
    try {
        console.log("mysql products", "calling...");
        getProducts().then(async (products) => {
            console.log("mysql products", products.length);
            console.log("mysql productpics", "calling...");
            getProductPics().then(async (productpics) => {
                console.log("mysql productpics", productpics.length);

                console.log("mongodb", "calling...");
                const db = client.db(dbName);
                const collection = db.collection(collectionName);
                const documents = await collection.find({}, {}).toArray();
                console.log("mongodb", documents.length);
                res.status(200).send({
                    "mysql products": products,
                    "mysql productpics": productpics,
                    "mongodb data": documents
                });
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error fetching test data for migration');
    }
});

router.get('/run', async (req, res) => {
    try {
        // Step 1: Retrieve Data from MySQL
        getProducts().then(async (products) => {
            getProductPics().then(async (productpics) => {
                // Step 2: Transform Data
                const transformedProducts = await Promise.all(products.map(async product => {
                    const productPictures = await productpics.filter(pic => pic.productid === product.id);
                    return {
                        ...product,
                        pictures: await Promise.all(productPictures.map(async pic => ({
                            id: pic.id,
                            image: pic.image,
                            pictype: pic.pictype
                        })))
                    };
                }));

                console.log("transformed", transformedProducts);


                // Step 3: Load Data into MongoDB
                const db = client.db(dbName);
                const collection = db.collection(collectionName);
                const result = await collection.insertMany(transformedProducts);
                console.log('Inserted documents', result);
                res.status(200).send({
                    "result": result.insertedCount + "products migrated",
                    transformedProducts
                });
            });
        });
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving documents');
    }
});


module.exports = router;