import express from 'express';
import Product from '../models/productsModel.js';
import expressAsyncHandler from 'express-async-handler';

const productRouter = express.Router();

productRouter.get('/',async (req,res)=>{
    const products = await Product.find();
    res.send(products);
});

productRouter.get('/categories',expressAsyncHandler(async (req,res)=>{
    const categories = await Product.find().distinct('category');
    res.send(categories);
}));

productRouter.get('/id/:id', async (req,res)=>{
    let productId = req.params.id;
    const product = await Product.findById(productId);

    if(product){
        res.send(product);
    }else{
        res.status(404).send({message:'Sorry product not found'});
    }
});

productRouter.get('/slug/:slug',async (req,res)=>{
    let slug = req.params.slug;

    const product = await Product.findOne({ slug });

    if(product){
        res.send(product);
    }else{
        res.status(404).send({message:'Sorry product not found'});
    }
});

export default productRouter;