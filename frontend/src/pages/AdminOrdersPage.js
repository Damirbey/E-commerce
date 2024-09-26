import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import Spinner from "../components/Spinner";
import { useContext, useReducer } from "react";
import { Store } from "../Store";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getError } from "../utils";

const reducer = (state, action)=>{
    switch(action.type){
        case "ORDERS_REQUEST":
            return {...state, loadingOrders:true};
        case "ORDERS_SUCCESS":
            return {...state,loadingOrders:false, orders:action.payload};
        case "ORDERS_FAIL":
            return {...state, loadingOrders:false, error:action.payload};
        case "DELETE_REQUEST":
            return {...state, loadingDelete:true, successDelete:false};
        case "DELETE_SUCCESS":
            return {...state, loadingDelete:false, successDelete:true};
        case "DELETE_FAIL":
            return {...state, loadingDelete:false, successDelete:false};
        default:
            return state; 
    }
}


function AdminOrdersPage(){
    const navigate = useNavigate();
    const [{loadingOrders, successDelete, orders}, dispatch] = useReducer(reducer,{
        loadingOrders:true,
        successDelete:false,
        orders:[]
    });
    const {state} = useContext(Store);
    const {userInfo} = state;
    const [pageNumber, setPageNumber] = useState('');
    //IMPLEMENTING PAGINATION

    const ordersPerPage = 4;
    const pagesVisited = pageNumber * ordersPerPage;
    const displayOrders = orders.slice(
        pagesVisited,
        ordersPerPage + pagesVisited
    );
    const pageCount = Math.ceil(orders.length / ordersPerPage);
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    const onDeleteOrder = async (order)=>{
        if(window.confirm("Are you sure you want to delete the order?")){
            try{
                dispatch({type:"DELETE_REQUEST"});
                await axios.delete(`/api/orders/${order._id}`,{
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                toast.success("Order deleted successfully!");
                dispatch({type:"DELETE_SUCCESS"});

                if(displayOrders.length === 1 && pageNumber > 0){
                    setPageNumber(pageNumber-1);
                }

            }catch(err){
                toast.error(getError(err));
                dispatch({type:"DELETE_FAIL"});
            }
        }
    }

    useEffect(()=>{
        const fetchOrders = async ()=>{
            try{
                dispatch({type:"ORDERS_REQUEST"});
                const {data} = await axios.get("/api/orders",
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` }
                    }
                );
                dispatch({type:"ORDERS_SUCCESS", payload:data});
            }catch(err){
                dispatch({type:"ORDERS_FAIL", payload:err});
            }
        }
        fetchOrders();
    },[successDelete]);

    return(<div className="tabularPage">
        <Helmet>
            <title>Orders</title>
        </Helmet>
        <div className="tabularPage_heading">
            <h1 className="heading-1">Orders List</h1>
        </div>
        
        {
            loadingOrders ? 
            <Spinner/>
            :
            <div className="table-container">
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>USER</th>
                            <th>DATE</th>
                            <th>TOTAL</th>
                            <th>PAID</th>
                            <th>DELIVERED</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                       {displayOrders.map((order,index) =>(
                        <tr key={index}>
                            <td>{order._id}</td>
                            <td>{order.user ? order.user.name : "DELETED USER"}</td>
                            <td>{new Date(order.createdAt).toISOString().split('T')[0]}</td>
                            <td>{order.totalPrice} $</td>
                            <td>{order.isPaid ? "Yes": "No"}</td>
                            <td>{order.isDelivered ? "Yes": "No"}</td>
                            <td>
                                <button className="btn" onClick={()=>navigate(`/order/${order._id}`)}> Edit</button>  <button className="btn btn-disabled" onClick={()=>onDeleteOrder(order)}> Delete</button>
                            </td>
                        </tr>
                       ))}
                    </tbody>
                </table>
                
            </div>
            
        }
        <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={'paginationBttns'}
            previousLinkClassName={'previousBttn'}
            nextLinkClassName={'nextBttn'}
            disabledClassName={'paginationDisabled'}
            activeClassName={'paginationActive'}
            forcePage={pageNumber}
        />
    </div>
    )
}
export default AdminOrdersPage;