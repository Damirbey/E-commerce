import { Link, useNavigate } from "react-router-dom";
import React, {useContext, useEffect, useReducer} from "react";
import { Store } from "../Store";
import { Steps } from "../components/Components";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from "axios";
import { Helmet } from "react-helmet-async";
const reducer = (state,action)=>{
    switch(action.type){
        case 'CREATE_REQUEST':
            return {...state, loading:true};
        case 'CREATE_SUCCESS':
            return {...state, loading:false};
        case 'CREATE_FAIL':
            return {...state, loading:false};
        default:
            return state;
    }
}

function PlaceOrderPage(){
    const {state, dispatch:ctxDispatch} = useContext(Store);
    const {userInfo, cart} = state;
    const {shippingAddress, paymentMethod, cartItems} = cart;
    cart.itemsPrice = cartItems.reduce((acc,cur)=>(acc+cur.price*cur.quantity),0);
    cart.shippingPrice = cart.itemsPrice > 100 ? 20 : 0;
    cart.taxPrice = ((cart.itemsPrice + cart.shippingPrice) * 0.13); 
    cart.orderTotal = cart.itemsPrice + cart.shippingPrice + cart.taxPrice;
    const [{loading}, dispatch] = useReducer(reducer,{
        loading:false
    });
    
    const navigate = useNavigate();

    useEffect(()=>{
        if(!paymentMethod){
            navigate('/payment');
        }
    }, [paymentMethod, navigate]);

    const onSubmitHandler = async(e)=>{
        e.preventDefault();

        try{
            dispatch({type:'CREATE_REQUEST'});
            const {data} = await axios.post('/api/orders',{
                orderItems:cartItems,
                shippingAddress:shippingAddress,
                paymentMethod:paymentMethod,
                itemsPrice:cart.itemsPrice,
                shippingPrice:cart.shippingPrice,
                taxPrice:cart.taxPrice,
                totalPrice:cart.orderTotal
            },{
                headers: {
                    authorization: `Bearer ${userInfo.token}`,
                  },
            });
            dispatch({type:'CREATE_SUCCESS'});
            ctxDispatch({type:'CART_CLEAR'});
            localStorage.removeItem('cartItems');
            navigate(`/order/${data.order._id}`);
        }catch(error){
            toast.error(getError(error));
            dispatch({type:'CREATE_FAIL'});
        }
        
    }
    return (<div className="placeOrderScreen">
        <Helmet>
            <title>Place Order</title>
        </Helmet>
        <Steps step1 step2 step3 step4/>
        <h1 className="heading-1 bold-text">Preview Order</h1>
        <div className="order">
            <div className="order_details">
                <div className="order_details_item">
                    <h3 className="heading-3 bold-text">Shipping</h3>
                    <p className="order_details_item_text"><strong>Name:</strong> {shippingAddress.name}</p>
                    <p className="order_details_item_text"><strong>Address:</strong> {shippingAddress.address}, {shippingAddress.postalCode}, {shippingAddress.city}, {shippingAddress.country}</p>

                    <p className="order_details_item_link">
                        <Link to="/shipping">Edit</Link>
                    </p>
                </div>

                <div className="order_details_item">
                    <h3 className="heading-3 bold-text">Payment</h3>
                    <p className="order_details_item_text"><strong>Method:</strong> {paymentMethod}</p>

                    <p className="order_details_item_link">
                        <Link to="/payment">Edit</Link>
                    </p>
                </div>

                <div className="order_details_item">
                    <h3 className="heading-3 bold-text">Items</h3>
                    <div className="order_items">
                        {
                            cartItems.map((item,index)=>(
                            <div className="order_item" key={index}>
                                <div className="order_item_img">
                                    <img src={item.image} alt='item'/>
                                    <p><Link>{item.name}</Link></p>
                                </div>
                                
                                <div className="order_item_quantity">
                                    {item.quantity}
                                </div>

                                <div className="order_item_price">
                                    ${item.quantity * item.price}
                                </div>
                                
                            </div>
                            ))
                        }
                        
                    </div>
                    
                    <p className="order_details_item_link">
                        <Link to="/cart">Edit</Link>
                    </p>
                </div>

            </div>

            <div className="order_summary">
                <h3 className="heading-3 bold-text">Order Summary</h3>
                <div className="order_summary_item">
                    <div className="order_summary_item_name">
                        Item
                    </div>
                    <div className="order_summary_item_price">
                        $ {cart.itemsPrice.toFixed(2)}
                    </div>
                </div>

                <div className="order_summary_item">
                    <div className="order_summary_item_name">
                        Shipping
                    </div>
                    <div className="order_summary_item_price">
                        $ {cart.shippingPrice.toFixed(2)}
                    </div>
                </div>

                <div className="order_summary_item">
                    <div className="order_summary_item_name">
                        Tax
                    </div>
                    <div className="order_summary_item_price">
                        $ {cart.taxPrice.toFixed(2)}
                    </div>
                </div>

                <div className="order_summary_item">
                    <div className="order_summary_item_name bold-text">
                        Order Total
                    </div>
                    <div className="order_summary_item_price bold-text">
                        $ {cart.orderTotal.toFixed(2)}
                    </div>
                </div>
                {cartItems.length > 0 ?
                <button onClick={onSubmitHandler} className="btn">Place Order</button>:
                <button className="btn-disabled">Place Order</button>
                }
                
                {loading && <Spinner/>}
            </div>

        </div>
    </div>
    )
}
export default PlaceOrderPage;