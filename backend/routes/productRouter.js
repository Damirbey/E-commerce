import express from 'express';
import Product from '../models/productsModel.js';
import expressAsyncHandler from 'express-async-handler';
import { isAuth, isAdmin } from '../utils.js';

const productRouter = express.Router();

productRouter.get('/',async (req,res)=>{
    const products = await Product.find();
    res.send(products);
});


productRouter.post('/', 
  isAuth, 
  isAdmin,
  expressAsyncHandler(async (req,res) => {
    const date = new Date();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const newProduct = new Product({
      name:'sample name' + minutes+seconds,
      slug:'sample-name-'+ minutes+seconds,
      category:'sample category',
      brand:"sample brand",
      rating:0,
      numOfReviews:0,
      price:0,
      countInStock:0,
      description:'sample description',
      image:"../images/p1.jpeg"
    })
    const product = await newProduct.save();
    res.send({message:'Product Created', product});
  })
);

productRouter.put("/:id", isAuth, isAdmin, expressAsyncHandler(async(req,res)=>{
  let productId = req.params.id;
  const product = await Product.findById(productId);
  if(product){
    product.name = req.body.name;
    product.slug = req.body.slug;
    product.price = req.body.price;
    product.image = req.body.image;
    product.category = req.body.category;
    product.brand = req.body.brand;
    product.countInStock = req.body.countInStock;
    product.description = req.body.description;

    await product.save();
    res.send({message:"Product updated successfully!"});
  }else{
    res.status(404).send({message:"Error updating product!"});
  }
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
const PAGE_SIZE = 3;
productRouter.get(
  '/search',
  expressAsyncHandler(async (req, res) => {
    const { query } = req;
    const category = query.category || '';
    const price = query.price || '';
    const rating = query.rating || '';
    const order = query.order || '';
    const searchQuery = query.query || '';
    const queryFilter =
      searchQuery && searchQuery !== 'all'
        ? {
            name: {
              $regex: searchQuery,
              $options: 'i',
            },
          }
        : {};
    const categoryFilter = category && category !== 'all' ? { category } : {};
    const ratingFilter =
      rating && rating !== 'all'
        ? {
            rating: {
              $gte: Number(rating),
            },
          }
        : {};
    const priceFilter =
      price && price !== 'all'
        ? {
            // 1-50
            price: {
              $gte: Number(price.split('-')[0]),
              $lte: Number(price.split('-')[1]),
            },
          }
        : {};
    const sortOrder =
      order === 'featured'
        ? { featured: -1 }
        : order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : order === 'newest'
        ? { createdAt: -1 }
        : { _id: -1 };

    const products = await Product.find({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    })
      .sort(sortOrder)

    const countProducts = await Product.countDocuments({
      ...queryFilter,
      ...categoryFilter,
      ...priceFilter,
      ...ratingFilter,
    });
    res.send({
      products,
      countProducts
    });
  })
);


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