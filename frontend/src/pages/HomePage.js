import {useReducer, useEffect} from 'react';
import axios from 'axios';
import logger from 'use-reducer-logger';
import ProductCard from '../components/ProductCard';
import MessageBox from '../components/MessageBox';
import Spinner from '../components/Spinner';
import { getError } from '../utils';
import {Helmet} from 'react-helmet-async';

const reducer = (state, action) =>{
    switch(action.type){
        case 'FETCH_REQUEST':
            return {...state, loading:true};
        case 'FETCH_SUCCESS':
            return {...state, loading:false, products:action.payload};
        case 'FETCH_FAIL':
            return {...state, loading:false, error:action.payload};
        default:
            return state;
    }
}

function HomePage(){
    const [{products, loading, error}, dispatch] = useReducer(logger(reducer),{
        loading:true,
        products:[],
        error:''
    });

    useEffect(() => {
        const fetchProducts = async () => {
            dispatch({type:'FETCH_REQUEST'});
            try{
                const result = await axios.get('/api/getProducts');
                dispatch({type:'FETCH_SUCCESS', payload:result.data});    
            }catch(error){
                dispatch({type:'FETCH_FAIL', payload:getError(error)});
            }
        };
        fetchProducts();
    }, []);

    return (
        <section className="products">
            <Helmet>
                <title>Amazona</title>
            </Helmet>
            {   loading ? 
                <Spinner/>
                :
                error ? 
                <MessageBox message={error} type='alert-danger'/>
                :
                products.map((product, index)=>{
                    return <ProductCard key = {index} product={product}/>
                })
            }
        </section>
    )
}
export default HomePage;