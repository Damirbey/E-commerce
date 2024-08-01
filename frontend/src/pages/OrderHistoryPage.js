import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { useContext, useEffect, useReducer } from "react";
import { useNavigate , Link} from "react-router-dom";
import { getError } from "../utils";
import axios from "axios";
import Spinner from "../components/Spinner";
const reducer = (state, action)=>{
    switch(action.type){
        case 'ORDERS_REQUEST':
            return {...state, loadingOrders:true};
        case 'ORDERS_SUCCESS':
            return {...state, loadingOrders:false, orders:action.payload};
        case 'ORDERS_FAIL':
            return {...state, loadingOrders:false, error:action.payload};
    }
}

function OrderHistoryPage(){
    const {state, dispatch:ctxDispatch} = useContext(Store);
    const {userInfo} = state;
    const navigate = useNavigate();
    const [{loadingOrders,orders}, dispatch] = useReducer(reducer,{
        loadingOrders:true,
        orders:[]
    });

    useEffect(()=>{
        if(!userInfo){
            navigate('/signIn');
        }

        const fetchOrders = async()=>{
            try{
                dispatch({type:'ORDERS_REQUEST'});
                const {data} = await axios.get('/api/orders/mine',
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                );
                dispatch({type:'ORDERS_SUCCESS', payload:data});
            }catch(error){
                dispatch({type:'ORDERS_FAIL', payload:getError(error)})
            }
        }
        fetchOrders();
    },[userInfo, navigate])
    return (<div className="tabularPage">
        <Helmet>
            <title>Order History</title>
        </Helmet>
        <h1 className="heading-1">Order History</h1>
        {
            loadingOrders ? 
            <Spinner/>
            :
            <div className="table-container">
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            orders.map((order, index)=>(
                            <tr key={index}>
                                <td>{order._id}</td>
                                <td>{order.createdAt}</td>
                                <td>$ {order.totalPrice}</td>
                                <td>{order.isPaid ? 'Yes':'No'}</td>
                                <td>{order.isDelivered ? 'Yes':'No'}</td>
                                <td>
                                    <Link to={`/order/${order._id}`}>
                                    <button className="btn btn-disabled">Details</button>
                                    </Link>
                                </td>
                            </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        }
        
    </div>
    )
}
export default OrderHistoryPage;