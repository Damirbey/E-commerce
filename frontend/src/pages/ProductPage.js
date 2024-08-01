import React, { useContext } from "react";
import { useEffect, useReducer } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from 'axios';
import ProductStatus from "../components/ProductStatus";
import ProductRating from "../components/ProductRating";
import {Helmet} from 'react-helmet-async';
import Spinner from "../components/Spinner";
import MessageBox from "../components/MessageBox";
import { getError } from "../utils";
import { Store } from "../Store";

//REDUCER TO MANAGE STATE
const reducer = (state,action)=>{
    switch(action.type){
        case 'FETCH_REQUEST':
            return {...state, loading:true};
        case 'FETCH_SUCCESS':
            return {...state, loading: false, product:action.payload};
        case 'FETCH_FAIL':
            return {...state, loading: false, error:action.payload};
        default:
            return state;
    }
}

function ProductPage(){
    const params = useParams();
    const {slug} = params;
    const [{product, loading, error}, dispatch] = useReducer(reducer,{
        loading:true,
        product:''
    });
    const {state, dispatch :ctxDispatch} = useContext(Store);
    const {cartItems} = state.cart;
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchProduct = async()=>{
            dispatch({type:'FETCH_REQUEST'});
            try{
                const result = await axios.get(`/api/getProducts/slug/${slug}`);
                dispatch({type:'FETCH_SUCCESS', payload:result.data})
            }catch(error){
                dispatch({type:'FETCH_FAIL', payload:getError(error)})
            }
        }
        fetchProduct();
    },[slug]);

    const addToCartHandler = async()=>{
        const {data} = await axios.get(`/api/getProducts/id/${product._id}`);
        const existItem = cartItems.find((cartItem)=>cartItem._id == product._id);
        const quantity = existItem ? existItem.quantity + 1 : 1;
        if(data.countInStock < quantity){
            window.alert("Sorry we are out of stock");
            return;
        }
        ctxDispatch({type:'ADD_TO_CART', payload:{...product,quantity:quantity}});
        navigate("/cart");
    }
    return <div className="product-screen"> 
        {
            loading ? 
            <Spinner/>
            :
            error ? 
            <MessageBox message={error} type='alert-danger'/>
            :
            (<React.Fragment>

            
                <img src={product.image} className="product-screen_image" alt={product.description}/>

                <div className="product-screen_info">
                    <h2>{product.name}</h2>
                    <div className="product_card_details_reviews">
                        <ProductRating rating = {product.rating} numOfReviews = {product.numOfReviews}/>
                    </div>
                    <div className="product-screen_info_description">
                        <p>Description: </p>
                        <p>{product.description}</p>
                    </div>
                </div>

                <div className="product-screen_status">
                    <p>Price:</p>
                    <p>${product.price}</p>
                    <p>Status</p>
                    <ProductStatus countInStock={product.countInStock}/>
                    <button className="btn product-screen_status_btn"
                        onClick={addToCartHandler}>Add to Cart</button>
                </div>
                </React.Fragment>
            )
        }
        <Helmet><title>{product.slug}</title></Helmet>    
    </div>    
} 

export default ProductPage;