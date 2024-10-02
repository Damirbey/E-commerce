import React, { useContext, useState } from "react";
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
import { toast } from "react-toastify";

//REDUCER TO MANAGE STATE
const reducer = (state,action)=>{
    switch(action.type){
        case 'CREATE_REQUEST':
            return {...state, loadingCreate:true};
        case 'CREATE_SUCCESS':
            return {...state, loadingCreate:false};
        case 'CREATE_FAIL':
            return {...state, loadingCreate:false};
        case 'REFRESH_PRODUCT':
            return {...state, product:action.payload};
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
    const {userInfo} = state;
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

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

    const onSubmitHandler = async(e)=>{
        e.preventDefault();
        if(!comment || !rating){
            toast.error("Please enter comment and rating ");
            return;
        }

        try{
            dispatch({type:'CREATE_REQUEST'});

            const { data } = await axios.post(
                `/api/getProducts/${product._id}/reviews`,
                { rating, comment, name: userInfo.name },
                {
                  headers: { Authorization: `Bearer ${userInfo.token}` },
                }
              );
              dispatch({
                type: 'CREATE_SUCCESS',
              });
              toast.success('Review submitted successfully');
              product.reviews.unshift(data.review);
              product.numReviews = data.numReviews;
              product.rating = data.rating;
              dispatch({ type: 'REFRESH_PRODUCT', payload: product });

        }catch(err){
            dispatch({type:'CREATE_FAIL'});
            toast.error(getError(err));
        }
    }

    return <div className="product-screen"> 
        <Helmet><title>{product.slug}</title></Helmet>    
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

        <div className="product-screen_reviews">
            {product.reviews && product.reviews.length > 0 ?
                <div>
                    <h1>Reviews</h1>
                    {product.reviews.map((review)=>
                        <div className="reviewBox">
                            <p className="reviewBox_name">{review.name}</p>
                            <ProductRating rating={review.rating}/>
                            <p className="reviewBox_comment">{review.comment}</p>

                            <p className="reviewBox_date" style={{color:'#888'}}>
                               <em>Posted on {new Date(review.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })} </em>
                            </p>
                        </div>
                    )}
                    
                </div>
                
                :
                <MessageBox message={'No Reviews'} type="alert-info"/>
                
            }
            {userInfo ? <div className="review-form">
                    <h1>Write a customer review</h1>
                    <form onSubmit={onSubmitHandler}>
                        <select value={rating} 
                            onChange={(e)=>setRating(e.target.value)}className="review-form_select">
                            <option value="">Select...</option>
                            <option value="1">1- Poor</option>
                            <option value="2">2- Fair</option>
                            <option value="3">3- Good</option>
                            <option value="4">4- Very good</option>
                            <option value="5">5- Excelent</option>
                        </select>

                        <textarea onChange={(e)=>setComment(e.target.value)}
                            className="review-form_textarea" placeholder="Comments" rows="5"/>
                        <button className="btn">Submit</button>
                    </form>
                    
                </div>
            :<MessageBox type="alert-warning" message={"Please to leave comment"} link={'/signIn'} linkMessage={'sign in'}></MessageBox>
            }
        </div>
        
    </div>    
} 

export default ProductPage;