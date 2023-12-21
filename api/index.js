import express from 'express';
const app = express();
import { config } from 'dotenv';
import connectToDatabase from './db/connection.js';
import userRoute from './routes/userRoutes.js';
config()

// app.use(express.json());
app.use("/api/user", userRoute);

connectToDatabase()
    .then(() => {
        app.listen(3000, () => {
            console.log('server start running...');
        })
    })
    .catch((err) => {
        console.log(err);
    });



