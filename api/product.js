

const express = require('express');
const router = express.Router();

const { client, dbName } = require('../network/mongodb');
const collectionName = 'product';


router.get('/empty', async (req, res) => {
    try {
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.deleteMany({});
        res.status(201).send(`${result.deletedCount} documents deleted from the collection`);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error emptying');
    }
});

router.get('/', async (req, res) => {
    try {
        const { page = 1, pageSize = 10, sortBy = "_id", sortOrder = "asc" } = req.query;

        // Construct options for pagination and sorting
        const options = {
            skip: (page - 1) * pageSize,
            limit: parseInt(pageSize),
        };
        if (sortBy) {
            const sortOption = {};
            sortOption[sortBy] = sortOrder === 'desc' ? -1 : 1;
            options.sort = sortOption;
        }
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const documents = await collection.find({}, options).toArray();
        res.json(documents);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error retrieving documents');
    }
});


router.post('/', async (req, res) => {
    try {
        const { document } = req.body;
        const db = client.db(dbName);
        const collection = db.collection(collectionName);
        const result = await collection.insertOne(document);
        console.log(`Inserted document with _id: ${result.insertedId}`);
        res.status(201).send('Document inserted successfully');
    } catch (err) {
        console.error(err);
        res.status(500).send('Error inserting document');
    }
});



module.exports = router;