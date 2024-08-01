import { Helmet } from "react-helmet-async";
import { Steps } from "../components/Components";
import React,{useContext, useEffect, useState} from "react";
import { Store } from "../Store";
import {useNavigate} from "react-router-dom";

function PaymentMethodPage(){
    const {state, dispatch:ctxDispatch} = useContext(Store);
    const {paymentMethod, shippingAddress} = state.cart;

    const [paymentType, setPaymentMethod] = useState(paymentMethod ||'PayPal');
    const navigate = useNavigate();
    const onSumbitHandler = (e)=>{
        e.preventDefault();
        ctxDispatch({type:'SAVE_PAYMENT_METHOD',payload:paymentType});
        localStorage.setItem('paymentMethod', paymentMethod);
        navigate('/placeOrder');
    }
    useEffect(()=>{
        if(!shippingAddress.address){
            navigate("/shipping");
        }
    },[shippingAddress, navigate]);

    return (<div className="paymentScreen">
        <Helmet>
            <title>Payment</title>
        </Helmet>
        <Steps step1 step2 step3/>
        <h1 className="heading-1 bold-text">Payment Method</h1>
        <form className="form form_payment" onSubmit={onSumbitHandler}>  
            <div className="radio_input">
                <input type="radio" name="paymentMethod" className="form_input" value='PayPal' onChange={(e)=>setPaymentMethod(e.target.value)} checked={paymentType=='PayPal'} />
                <p className="form_label">PayPal</p>
            </div>
            
            <div className="radio_input">
                <input type="radio" name="paymentMethod" className="form_input" value='Stripe' onChange={(e)=>setPaymentMethod(e.target.value)} checked={paymentType=='Stripe'}/>
                <p className="form_label">Stripe</p>
            </div>

            <button type="submit" className="btn form_btn">Continue</button>
        </form>
    </div>
    )
}

export default PaymentMethodPage;