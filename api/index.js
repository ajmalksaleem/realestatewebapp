import express from 'express';
const app = express();
import { config } from 'dotenv';
import connectToDatabase from './db/connection.js';
import userRoute from './routes/userRoutes.js';
import authRoute from './routes/authRoute.js';
config()

app.use(express.json());
app.use("/api/user", userRoute);
app.use("/api/auth", authRoute);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "internal server Error";
    res.status(statusCode).json({
        success: false,
        statusCode,
        message
    })
})


connectToDatabase()
    .then(() => {
        app.listen(3000, () => {
            console.log('server start running...');
        })
    })
    .catch((err) => {
        console.log(err);
    });



