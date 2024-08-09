import React, { useEffect, useReducer, useState } from "react";
import ProductRating from "../components/ProductRating";
import ProductCard from "../components/ProductCard";
import data from "../data.js";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getError } from "../utils.js";
import axios from "axios";
import LinkContainer from 'react-router-bootstrap/LinkContainer';
import Button from 'react-bootstrap/Button';
import Spinner from "../components/Spinner.js";

const prices = [
    {
      name: '$1 to $50',
      value: '1-50',
    },
    {
      name: '$51 to $200',
      value: '51-200',
    },
    {
      name: '$201 to $1000',
      value: '201-1000',
    },
];
const ratings =[
    {
        name: '4stars & up',
        rating: 4,
      },
    
      {
        name: '3stars & up',
        rating: 3,
      },
    
      {
        name: '2stars & up',
        rating: 2,
      },
    
      {
        name: '1stars & up',
        rating: 1,
      },
];
const reducer = (state, action) => {
    switch (action.type) {
      case 'FETCH_REQUEST':
        return { ...state, loading: true };
      case 'FETCH_SUCCESS':
        return {
          ...state,
          products: action.payload.products || [],
          page: action.payload.page,
          pages: action.payload.pages,
          countProducts: action.payload.countProducts,
          loading: false,
        };
      case 'FETCH_FAIL':
        return { ...state, loading: false, error: action.payload };
  
      default:
        return state;
    }
};
function SearchPage(){
    const navigate = useNavigate();
    const {search} = useLocation();
    const searchParameter = new URLSearchParams(search);
    const category = searchParameter.get('category') || 'all';
    const query = searchParameter.get('query') || 'all';
    const price = searchParameter.get('price') || 'all';
    const rating = searchParameter.get('rating') || 'all';
    const order = searchParameter.get('order') || 'newest';
    const page = searchParameter.get('page') || 1;
    const [categories,setCategories] = useState([]);
    const [{loading,error, products, pages, countProducts}, dispatch] = useReducer(reducer,{
        loading:true,
        products:[],
        error:''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data } = await axios.get(
                `/api/getProducts/search?page=${page}&query=${query}&category=${category}&price=${price}&rating=${rating}&order=${order}`
                );
                dispatch({ type: 'FETCH_SUCCESS', payload: data });
            } catch (err) {
                dispatch({
                type: 'FETCH_FAIL',
                payload: getError(error),
                });
            }
        };
        fetchData();
    }, [category, error, order, page, price, query, rating]);

    useEffect(()=>{
        const fetchCategories = async ()=>{
            try{
                const {data} = await axios.get('/api/getProducts/categories');
                setCategories(data) ;
            }catch(error){
                toast.error(getError(error));
            }
        }
        fetchCategories();
    }, [dispatch]);

    const getFilterUrl = (filter) => {
        const filterPage = filter.page || page;
        const filterCategory = encodeURIComponent(filter.category || category);
        const filterQuery = encodeURIComponent(filter.query || query);
        const filterRating = encodeURIComponent(filter.rating || rating);
        const filterPrice = encodeURIComponent(filter.price || price);
        const sortOrder = encodeURIComponent(filter.order || order);
    
        return {
            pathname: "/search",
            search: `?category=${filterCategory}&query=${filterQuery}&price=${filterPrice}&rating=${filterRating}&order=${sortOrder}&page=${filterPage}`
        };
    };
    console.log("product srae", products)
    return(<div className="searchPage">
        <div className="searchPage_leftSection">
            <div className="searchPage_leftSection_item">
                <h3 className="heading-3 bold-text">Categories</h3>
                <ul>
                    <li>
                        <Link to={getFilterUrl({category:'all'})}>Any</Link>
                    </li>
                    {
                        categories.map((c)=>(
                            <li>
                                <Link to={getFilterUrl({category:c})}>{c}</Link>
                            </li>
                        ))
                    }
                </ul>
            </div>

            <div className="searchPage_leftSection_item">
                <h3 className="heading-3 bold-text">Price</h3>
                <ul>
                    <li>
                        <Link to={getFilterUrl({price:'all'})}>Any</Link>
                    </li>
                    {
                        prices.map(price=>(
                            <li>
                                <Link to={getFilterUrl({price:price.value})}>{price.name}</Link>
                            </li>
                        ))
                    }
                </ul>
            </div>

            <div className="searchPage_leftSection_item">
                <h3 className="heading-3 bold-text">Average Customer Review</h3>
                <ul>
                    <li>
                        <Link to={getFilterUrl({rating:'all'})}>Any</Link>
                    </li>
                    {
                        ratings.map(rating=>(
                            <li>
                                <Link to={getFilterUrl({rating:rating.rating})}>
                                    <ProductRating rating={rating.rating}/>& up
                                </Link>
                            </li>
                        ))
                    }
                </ul>
            </div>

        </div>
        <div className="searchPage_middleSection">
            <h4 className="heading-4 bold-text">
                {countProducts === 0 ? 'No' : countProducts} Results
                {query !== 'all' && ' : ' + query}
                {category !== 'all' && ' : ' + category}
                {price !== 'all' && ' : Price ' + price}
                {rating !== 'all' && ' : Rating ' + rating + ' & up'}
            </h4>
            <div className="searchPage_middleSection_results">
                {loading ?
                    <Spinner/>
                    :
                    (
                    <React.Fragment>
                    
                        {  products.length > 0 && products.map((product,i)=>(
                            <ProductCard product={product}/>
                        ))
                        }
                        <div>
                            {[...Array(pages).keys()].map((pageNumber) => (
                                <LinkContainer
                                key={pageNumber + 1}
                                className="mx-1"
                                to={getFilterUrl({ page: pageNumber + 1 })}
                                >
                                <Button
                                    className={Number(page) === pageNumber + 1 ? 'text-bold' : ''}
                                    variant="light"
                                >
                                    {pageNumber + 1}
                                </Button>
                                </LinkContainer>
                            ))}
                        </div>
                    </React.Fragment>
                    )
                }
                
                
             </div>
        </div>

        <div className="searchPage_rightSection">
            <span className="heading-4 bold-text">Sort By</span>
            <select
                value={order}
                onChange={(e)=>navigate(getFilterUrl({order:e.target.value}))}
            >
                <option value="newest">Newest Arrivals</option>
                <option value="lowest">Price: Low to High</option>
                <option value="highest">Price: High to Low</option>
                <option value="toprated">Avg.Customer Reviews</option>
            </select>
        </div>
    </div>
    )
}

export default SearchPage;