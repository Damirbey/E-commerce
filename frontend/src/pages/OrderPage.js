import { Link, useNavigate, useParams } from "react-router-dom";
import React, {useContext, useEffect, useReducer} from "react";
import { Store } from "../Store";
import Spinner from "../components/Spinner";
import { getError } from "../utils";
import axios from "axios";
import { Helmet } from "react-helmet-async";
import MessageBox from "../components/MessageBox";
import { PayPalButtons, usePayPalScriptReducer } from '@paypal/react-paypal-js';
import { toast } from 'react-toastify';

const reducer = (state,action)=>{
    switch(action.type){
        case 'FETCH_REQUEST':
            return {...state, loading:true};
        case 'FETCH_SUCCESS':
            return {...state, loading:false, order:action.payload};
        case 'FETCH_FAIL':
            return {...state, loading:false, error:action.payload};
        case 'PAY_REQUEST':
            return { ...state, loadingPay: true };
        case 'PAY_SUCCESS':
            return { ...state, loadingPay: false, successPay: true };
        case 'PAY_FAIL':
            return { ...state, loadingPay: false };
        case 'PAY_RESET':
            return { ...state, loadingPay: false, successPay: false };    
        case 'DELIVER_REQUEST':
            return { ...state, loadingDeliver: true };
        case 'DELIVER_SUCCESS':
            return { ...state, loadingDeliver: false, successDeliver: true };
        case 'DELIVER_FAIL':
            return { ...state, loadingDeliver: false };
        case 'DELIVER_RESET':
            return {
                ...state,
                loadingDeliver: false,
                successDeliver: false,
            };
        default:
            return state;
    }
}

function OrderPage(){
    const {id:orderId} = useParams();
    const {state, dispatch:ctxDispatch} = useContext(Store);
    const [{order,loading,loadingPay,successPay,loadingDeliver, successDeliver, error}, dispatch] = useReducer(reducer,{
        loading:true,
        order:{},
        error:'',
        loadingPay:false,
        successPay:false,
    })
    const {userInfo} = state;
    const navigate = useNavigate();
    const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

    function createOrder(data, actions) {
        return actions.order
          .create({
            purchase_units: [
              {
                amount: { value: order.totalPrice },
              },
            ],
          })
          .then((orderID) => {
            return orderID;
          });
    }

    function onApprove(data, actions) {
        return actions.order.capture().then(async function (details) {
          try {
            dispatch({ type: 'PAY_REQUEST' });
            const { data } = await axios.put(
              `/api/orders/${order._id}/pay`,
              details,
              {
                headers: { authorization: `Bearer ${userInfo.token}` },
              }
            );
            dispatch({ type: 'PAY_SUCCESS', payload: data });
            toast.success('Order is paid');
          } catch (err) {
            dispatch({ type: 'PAY_FAIL', payload: getError(err) });
            toast.error(getError(err));
          }
        });
    }

    function onError(err) {
        toast.error(getError(err));
    }


    const deliverOrderHandler = async ()=> {
        try {
          dispatch({ type: 'DELIVER_REQUEST' });
          const { data } = await axios.put(
            `/api/orders/${order._id}/deliver`,
            {},
            {
              headers: { authorization: `Bearer ${userInfo.token}` },
            }
          );
          dispatch({ type: 'DELIVER_SUCCESS', payload: data });
          toast.success('Order is delivered');
        } catch (err) {
          toast.error(getError(err));
          dispatch({ type: 'DELIVER_FAIL' });
        }
    }

    useEffect(()=>{
        const fetchOrder = async()=>{
            try{
                dispatch({type:'FETCH_REQUEST'});
                const {data} = await axios.get(`/api/orders/${orderId}`, {
                    headers: { authorization: `Bearer ${userInfo.token}` },
                });
                dispatch({type:'FETCH_SUCCESS', payload:data});
            }catch(error){
                dispatch({type:'FETCH_FAIL', payload:getError(error)});
            }
        }
        if(!order._id || successPay || successDeliver || (order._id && order._id !== orderId)){
            fetchOrder();
            if (successPay) {
                dispatch({ type: 'PAY_RESET' });
            }
            if (successDeliver) {
                dispatch({ type: 'DELIVER_RESET' });
            }
        }else {
            const loadPaypalScript = async () => {
              const { data: clientId } = await axios.get('/api/keys/paypal', {
                headers: { authorization: `Bearer ${userInfo.token}` },
              });
              paypalDispatch({
                type: 'resetOptions',
                value: {
                  'client-id': clientId,
                  currency: 'CAD',
                },
              });
              paypalDispatch({ type: 'setLoadingStatus', value: 'pending' });
            };
            loadPaypalScript();
        }

    },[userInfo, navigate,order, orderId, successPay, successDeliver, paypalDispatch]);

    
    return (<div className="placeOrderScreen">
        <Helmet>
            <title>Order Page</title>
        </Helmet>
        <h1 className="heading-1 bold-text">Order {orderId}</h1>
        {loading?<Spinner/>
        :

        <div className="order">
            <div className="order_details">
                <div className="order_details_item">
                    <h3 className="heading-3 bold-text">Shipping</h3>
                    <p className="order_details_item_text"><strong>Name:</strong> {order.shippingAddress.name}</p>
                    <p className="order_details_item_text"><strong>Address:</strong> {order.shippingAddress.address}, {order.shippingAddress.postalCode}, {order.shippingAddress.city}, {order.shippingAddress.country}</p>

                    {order.isDelivered ?
                    <MessageBox message={`Delivered on ${order.deliveredAt}`} type='alert-success'/>
                    :
                    <MessageBox message={'Not Delivered'} type='alert-danger'/>
                    }
                </div>

                <div className="order_details_item">
                    <h3 className="heading-3 bold-text">Payment</h3>
                    <p className="order_details_item_text"><strong>Method:</strong> {order.paymentMethod}</p>

                    {order.isPaid ?
                    <MessageBox message={`Paid on ${order.paidAt}`} type='alert-success'/>
                    :
                    <MessageBox message={'Not Paid'} type='alert-danger'/>
                    }
                </div>

                <div className="order_details_item">
                    <h3 className="heading-3 bold-text">Items</h3>
                    <div className="order_items">
                        {
                            order.orderItems.map((item,index)=>(
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
                    
                </div>

            </div>

            <div className="order_summary">
                <h3 className="heading-3 bold-text">Order Summary</h3>
                <div className="order_summary_item">
                    <div className="order_summary_item_name">
                        Item
                    </div>
                    <div className="order_summary_item_price">
                        $ {order.itemsPrice.toFixed(2)}
                    </div>
                </div>

                <div className="order_summary_item">
                    <div className="order_summary_item_name">
                        Shipping
                    </div>
                    <div className="order_summary_item_price">
                        $ {order.shippingPrice.toFixed(2)}
                    </div>
                </div>

                <div className="order_summary_item">
                    <div className="order_summary_item_name">
                        Tax
                    </div>
                    <div className="order_summary_item_price">
                        $ {order.taxPrice.toFixed(2)}
                    </div>
                </div>

                <div className="order_summary_item">
                    <div className="order_summary_item_name bold-text">
                        Order Total
                    </div>
                    <div className="order_summary_item_price bold-text">
                        $ {order.totalPrice.toFixed(2)}
                    </div>
                </div>
                {   !order.isPaid && 
                    ( 
                        isPending ? 
                        <Spinner/>
                        :
                        <div>
                            <PayPalButtons
                                createOrder={createOrder}
                                onApprove={onApprove}
                                onError={onError}
                            ></PayPalButtons>
                        </div> 
                    )
                    
                }   
                {
                    userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                        <button className="btn" onClick={deliverOrderHandler}> Deliver Order</button>
                    )
                }
                {
                    loadingPay && <Spinner/>
                }          
            </div>

        </div>
        }
        
    </div>
    )
}
export default OrderPage;