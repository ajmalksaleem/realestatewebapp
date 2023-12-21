import express from 'express';
const app = express();
import { config } from 'dotenv';
import connectToDatabase from './db/connection.js';
config()




connectToDatabase()
    .then(() => {
        app.listen(3000, () => {
            console.log('server start running...');
        })
    })
    .catch((err) => {
        console.log(err);
    });



