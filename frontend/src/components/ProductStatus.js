import React from "react";

function ProductStatus(props){
    const {countInStock} = props;
    let content = countInStock > 0 ? 
    <div className="inStock">In Stock</div> :
    <div className="outOfStock">Unavailable</div>
    return <div>
            {content}
    </div>
}
export default ProductStatus;