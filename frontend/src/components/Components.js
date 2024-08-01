import React from "react";

export function CartButton(props) {
    const {disabled, type , onClickHandler} = props;
    let content;

    if(type === 'bin'){
        content = <svg className="cartScreen_cartItems_cartItem_button" onClick={onClickHandler}>
        <use xlinkHref="../../images/sprite.svg#icon-bin"></use>
    </svg>
    }else if(type === 'minus'){
        content = disabled ? 
        <svg className="cartScreen_cartItems_cartItem_button disabled">
            <use xlinkHref="../../images/sprite.svg#icon-circle-with-minus"></use>
        </svg> :
        <svg className="cartScreen_cartItems_cartItem_button" onClick={onClickHandler}>
            <use xlinkHref="../../images/sprite.svg#icon-circle-with-minus"></use>
        </svg>
    }else if(type === 'plus'){
        content = <svg className="cartScreen_cartItems_cartItem_button" onClick={disabled ? undefined : onClickHandler}>
        <use xlinkHref="../../images/sprite.svg#icon-circle-with-plus"></use>
    </svg>
    }

    return content;
}

export function Steps(props){
    const {step1, step2, step3, step4} = props;
    return(
        <div className="steps">
            <div className={`steps_step ${step1 ? 'steps_step_active' : ''}`} >
                Sign In
            </div>
            <div className={`steps_step ${step2 ? 'steps_step_active' : ''}`} >
                Shipping
            </div>
            <div className={`steps_step ${step3 ? 'steps_step_active' : ''}`} >
                Payment
            </div>
            <div className={`steps_step ${step4 ? 'steps_step_active' : ''}`} >
                Place Order
            </div>
        </div>
    )
}