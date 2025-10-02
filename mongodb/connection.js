require('dotenv').config();

const { MongoClient } = require('mongodb');
const uri = process.env.MONGO_URI;

let db;

/*
    * Connect to MongoDB  
*/
async function connectToDb(callback) {
    try {
        if (db) {
            return callback(null, db);
        }

        MongoClient.connect(uri).then((client) => {
            db = client.db();
            return callback(null, db);
        })
    } catch (error) {
        return callback(error);
    }
}

/*
    * Get the database instance  
*/
function getDb() {
    if (!db) {
        throw new Error('Database not connected. Call connectToDb first.');
    }
    return db;
}

module.exports = { connectToDb, getDb };