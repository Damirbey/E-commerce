import { useContext } from "react";
import { Link } from "react-router-dom";
import { Store } from "../Store";
import ProductRating from "./ProductRating";
import ProductStatus from "./ProductStatus";
import axios from "axios";

function ProductCard(props){
    const {product} = props;
    const {state, dispatch:ctxDispatch} = useContext(Store);
    const {cartItems} = state.cart;

    const addToCartHandler = async()=>{
        const {data} = await axios.get(`/api/getProducts/id/${product._id}`);
        const existItem = cartItems.find((cartItem)=>cartItem._id == product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        if(data.countInStock < quantity){
            window.alert("Sorry we are out of stock");
            return;
        }
        ctxDispatch({type:'ADD_TO_CART', payload:{...product,quantity:quantity}});
    }

    return (
        <div className="product_card">
            <Link to={`/products/${product.slug}`}>
                <img src={product.image} className="product_card_img" alt={product.description}/>
            </Link>
            <div className="product_card_details">
                <Link to={`/products/${product.slug}`}>
                    <p className="product_card_details_title">{product.name}</p>
                </Link>    
                <div className="product_card_details_reviews">
                    <ProductRating rating = {product.rating} numOfReviews = {product.numOfReviews}/>
                </div>
                <p className="product_card_details_price">{product.price} $</p>
                {product.countInStock > 0 ? 
                <button className="btn" onClick={addToCartHandler}> Add to Cart</button>
                :
                <ProductStatus countInStock = {product.countInStock}/>
                 }
            </div>
        </div>
    )

}
export default ProductCard;