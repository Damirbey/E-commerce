import express from 'express';
import Product from '../models/productsModel.js';
import User from '../models/usersModel.js';
import data from '../data.js';

const seedRouter = express.Router();

seedRouter.get('/', async (req,res)=>{
    await Product.deleteMany({});
    const createdProducts = await Product.insertMany(data.products);
    await User.deleteMany({});
    const createdUsers = await User.insertMany(data.users);

    res.send({createdProducts, createdUsers});
});
export default seedRouter;