import express from "express";
import mongoose from "mongoose";
import dotenv from 'dotenv';
import seedRouter from "./routes/seedRouter.js";
import productRouter from "./routes/productRouter.js";
import userRouter from "./routes/userRoutes.js";
import orderRouter from "./routes/orderRouter.js";
import path from "path";

dotenv.config();

const app = express();
const __dirname = path.resolve();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'/frontend/build')));

const PORT = process.env.PORT || 3001;

mongoose.connect(process.env.MONGO_DB_URI).then(()=>{
    console.log("Connected to db");
}).catch((error)=>{
    console.log("error is ", error.message);
});
app.get('*',(req,res) =>
    res.sendFile(path.join(__dirname, '/frontend/build/index.html'))
);

app.use('/api/seed', seedRouter);
app.use('/api/getProducts', productRouter);
app.use('/api/users', userRouter);
app.use('/api/orders', orderRouter);
//RETURNING PAYPAL CLIENT ID
app.get('/api/keys/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});

app.use((err, req, res, next) => {
    res.status(500).send({ message: err.message });
});

app.listen(PORT,()=>{
    console.log("server is running on Port ", PORT);
})