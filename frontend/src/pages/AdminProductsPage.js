import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { useContext, useEffect, useReducer, useState } from "react";
import { useNavigate , Link} from "react-router-dom";
import { getError } from "../utils";
import axios from "axios";
import Spinner from "../components/Spinner";
import logger from 'use-reducer-logger';
import ReactPaginate from 'react-paginate';
import { toast } from "react-toastify";

const reducer = (state, action)=>{
    switch(action.type){
        case 'PRODUCTS_REQUEST':
            return {...state, loadingProducts:true};
        case 'PRODUCTS_SUCCESS':
            return {...state, loadingProducts:false, products:action.payload};
        case 'PRODUCTS_FAIL':
            return {...state, loadingProducts:false, error:action.payload};
        case 'CREATE_REQUEST':
            return {...state, loadingCreate:true};
        case 'CREATE_SUCCESS':
            return {...state, loadingCreate:false};
        case 'CREATE_FAIL':
            return {...state, loadingCreate:false};
        case 'DELETE_REQUEST':
            return {...state, loadingDelete:true, successDelete:false};
        case 'DELETE_SUCCESS':
            return {...state, loadingDelete:false, successDelete:true};
        case 'DELETE_FAIL':
            return {...state, loadingDelete:false, successDelete:false};
        case 'DELETE_RESET':
            return {...state, loadingDelete:false, successDelete:false};
        default:
            return state;
    }
}

function AdminProductsPage(){
    const {state, dispatch:ctxDispatch} = useContext(Store);
    const {userInfo} = state;
    const navigate = useNavigate();
    const [{loadingProducts,products,loadingCreate, loadingDelete, successDelete}, dispatch] = useReducer(logger(reducer),{
        loadingProducts:true,
        loadingCreate:true,
        products:[]
    });

    const [pageNumber, setPageNumber] = useState('');
    //IMPLEMENTING PAGINATION

    const productsPerPage = 4;
    const pagesVisited = pageNumber * productsPerPage;
    const displayProducts = products.slice(
        pagesVisited,
        productsPerPage + pagesVisited
    );
    const pageCount = Math.ceil(products.length / productsPerPage);
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };


    const onCreateNewProduct = async () =>{
        if(window.confirm("Are you sure, you want to create a new product?"))
        {
            try{
                dispatch({type:"CREATE_REQUEST"});
                const {data} = await axios.post('/api/getProducts',
                    {},
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` }
                    }
                );
                toast.success("Product Created Successfully");
                navigate(`/products/${data.product.slug}`)
                
            }catch(err){
                dispatch({type:"CREATE_FAIL"});
                toast.error(getError(err));
            }
        }
    }


    const onDeleteProduct = async (product) =>{
        if(window.confirm("Are you sure, you want to delete Product?")){
            try{
                dispatch({type:'DELETE_REQUEST'});
                await axios.delete(`/api/getProducts/${product._id}`,{
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                dispatch({type:'DELETE_SUCCESS'});
                toast.success("Product Deleted Successfully!");

                 // Check if the current page is empty after the deletion
                if (displayProducts.length === 1 && pageNumber > 0) {
                    // If it was the last product on the page, go to the previous page
                    setPageNumber(pageNumber - 1);
                }
            }catch(err){
                dispatch({type:'DELETE_FAIL'});
                toast.error(getError(err));
            }
        }
    }

    useEffect(()=>{

        const fetchProducts = async()=>{
            try{
                dispatch({type:'PRODUCTS_REQUEST'});
                const {data} = await axios.get('/api/getProducts',
                    {
                        headers: { Authorization: `Bearer ${userInfo.token}` },
                    }
                );
                dispatch({type:'PRODUCTS_SUCCESS', payload:data});
            }catch(error){
                dispatch({type:'PRODUCTS_FAIL', payload:getError(error)})
            }
        }
        if(successDelete){
            dispatch({type:'DELETE_RESET'});
        }
        fetchProducts();
    },[userInfo, navigate, successDelete]);

    return (<div className="tabularPage">
        <Helmet>
            <title>Products</title>
        </Helmet>
        <div className="tabularPage_heading">
            <h1 className="heading-1">Products List</h1>
            <button className="btn" onClick={onCreateNewProduct}> Create New Product</button>
        </div>
        
        {
            loadingProducts ? 
            <Spinner/>
            :
            <div className="table-container">
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>PRICE</th>
                            <th>CATEGORY</th>
                            <th>BRAND</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                       {displayProducts.map((product,index) =>(
                        <tr key={index}>
                            <td>{product._id}</td>
                            <td>{product.name}</td>
                            <td>{product.price} $</td>
                            <td>{product.category}</td>
                            <td>{product.brand}</td>
                            <td>
                                <button className="btn" onClick={()=>navigate(`/adminProductEdit/${product._id}`)}> Edit</button>  <button className="btn btn-disabled" onClick={()=>onDeleteProduct(product)}> Delete</button>
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
export default AdminProductsPage;