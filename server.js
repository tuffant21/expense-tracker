const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const path = require('path');
require('dotenv').config();

const app = express();
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

function connectToDatabase() {
    // Connection URL and Database Name
    const client = new MongoClient(process.env.MONGO_URL);
    return client.connect();
}

function getBillsCollection(client) {
    return client.db(process.env.MONGO_DB).collection(process.env.MONGO_COLLECTION);
}

// API routes
app.get('/api/bills', async (req, res) => {
    try {
        const client = await connectToDatabase();
        const billsCollection = getBillsCollection(client);
        const bills = await billsCollection.find().toArray();
        await client.close();
        res.json(bills);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/bills', async (req, res) => {
    try {
        const client = await connectToDatabase();
        const billsCollection = getBillsCollection(client);
        const result = await billsCollection.insertOne(req.body);
        await client.close();
        res.status(201).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/bills/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const client = await connectToDatabase();
        const billsCollection = getBillsCollection(client);
        const result = await billsCollection.findOneAndUpdate(
            { _id: new ObjectId(id) },
            { $set: req.body },
            { returnOriginal: false }
        );
        await client.close();
        res.json(result.value);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/bills/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const client = await connectToDatabase();
        const billsCollection = getBillsCollection(client);
        await billsCollection.deleteOne({ _id: new ObjectId(id) });
        await client.close();
        res.status(204).end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Serve the index.html file for all other routes (for a single-page app)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
