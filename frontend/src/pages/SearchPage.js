import React from "react";
import ProductRating from "../components/ProductRating";
import ProductCard from "../components/ProductCard";
import data from "../data.js";
function SearchPage(){
    return(<div className="searchPage">
        <div className="searchPage_leftSection">
            <div className="searchPage_leftSection_item">
                <h3 className="heading-3 bold-text">Categories</h3>
                <ul>
                    <li>Any</li>
                    <li>Pants</li>
                    <li>Shirts</li>
                </ul>
            </div>

            <div className="searchPage_leftSection_item">
                <h3 className="heading-3 bold-text">Price</h3>
                <ul>
                    <li className="active">Any</li>
                    <li>1$ to 50$</li>
                    <li>51$ to 200$</li>
                    <li>201$ to 1000$</li>
                </ul>
            </div>

            <div className="searchPage_leftSection_item">
                <h3 className="heading-3 bold-text">Average Customer Review</h3>
                <ul>
                    <li>Any</li>
                    <li><ProductRating rating={4}/>& up</li>
                    <li><ProductRating rating={3}/>& up</li>
                    <li><ProductRating rating={2}/>& up</li>
                    <li><ProductRating rating={1}/>& up</li>
                </ul>
            </div>

        </div>
        <div className="searchPage_middleSection">
            <h4 className="heading-4 bold-text">Results</h4>
            <div className="searchPage_middleSection_results">
                <ProductCard product={data.products[0]}/>
                <ProductCard product={data.products[1]}/>
            </div>
        </div>

        <div className="searchPage_rightSection">
            <span className="heading-4 bold-text">Sort By</span>
            <select>
                <option>Newest Arrivals</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Avg.Customer Reviews</option>
            </select>
        </div>
    </div>
    )
}

export default SearchPage;