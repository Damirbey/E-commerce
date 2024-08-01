import React from "react";

function ProductRating(props){
    const {rating, numOfReviews} = props;
  
    return<React.Fragment>
                <svg className="product_card_details_reviews_star">
                    {
                        rating < 0.5 ?
                        <use xlinkHref="/images/sprite.svg#icon-star-empty"></use>
                        :
                        rating === 0.5 ?
                        <use xlinkHref="/images/sprite.svg#icon-star-half"></use>
                        :
                        <use xlinkHref="/images/sprite.svg#icon-star-full"></use>
                    }
                </svg>
                <svg className="product_card_details_reviews_star">
                    {
                        rating < 1.5 ?
                        <use xlinkHref="/images/sprite.svg#icon-star-empty"></use>
                        :
                        rating === 1.5 ?
                        <use xlinkHref="/images/sprite.svg#icon-star-half"></use>
                        :
                        <use xlinkHref="/images/sprite.svg#icon-star-full"></use>
                    }
                </svg>
                <svg className="product_card_details_reviews_star">
                    {
                        rating < 2.5 ?
                        <use xlinkHref="/images/sprite.svg#icon-star-empty"></use>
                        :
                        rating === 2.5 ?
                        <use xlinkHref="/images/sprite.svg#icon-star-half"></use>
                        :
                        <use xlinkHref="/images/sprite.svg#icon-star-full"></use>
                    }
                </svg>
                <svg className="product_card_details_reviews_star">
                    {
                        rating < 3.5 ?
                        <use xlinkHref="/images/sprite.svg#icon-star-empty"></use>
                        :
                        rating === 3.5 ?
                        <use xlinkHref="/images/sprite.svg#icon-star-half"></use>
                        :
                        <use xlinkHref="/images/sprite.svg#icon-star-full"></use>
                    }
                </svg>
                <svg className="product_card_details_reviews_star">
                    {
                        rating < 4.5 ?
                        <use xlinkHref="/images/sprite.svg#icon-star-empty"></use>
                        :
                        rating === 4.5 ?
                        <use xlinkHref="/images/sprite.svg#icon-star-half"></use>
                        :
                        <use xlinkHref="/images/sprite.svg#icon-star-full"></use>
                    }
                </svg>
                <p className="product_card_details_reviews_numReviews">{numOfReviews} Reviews</p>
        </React.Fragment>
}

export default ProductRating;