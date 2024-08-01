import { Helmet } from "react-helmet-async";
import { Store } from "../Store";
import { useContext, useEffect, useState } from "react";
import { Steps } from "../components/Components";
import { useNavigate } from "react-router-dom";

function ShippingPage(){
    const {state, dispatch:ctxDispatch} = useContext(Store);
    const {userInfo} = state;
    const {shippingAddress} = state.cart;
    const navigate = useNavigate();
    const [name, setName] = useState(shippingAddress.name || '');
    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || '');

    useEffect(()=>{
        if(!userInfo){
            navigate('/signin?redirect=/shipping');
        }
    }, [userInfo, navigate]);

    const onSumbitHandler = (e)=>{
        e.preventDefault();
        ctxDispatch({type:'SAVE_SHIPPING_ADDRESS',payload:{
            name,
            address,
            city,
            postalCode,
            country
        }});
        localStorage.setItem('shippingAddress',JSON.stringify({
            name,
            address,
            city,
            postalCode,
            country
        }));
        navigate('/payment');
    }
    return(<div className="shippingPage">
        <Helmet>
            <title>Shipping Address</title>
        </Helmet>
        <Steps step1 step2/>
        <h1 className="heading-1 bold-text">Shipping Address</h1>
        <form className="form form_shipping" onSubmit={onSumbitHandler}>  
            <p className="form_label">Full Name</p>
            <input type="text" name="name" className="form_input" value={name} onChange={(e)=>setName(e.target.value)} required/>
            <p className="form_label">Address</p>
            <input type="text" name="address" className="form_input" value={address} onChange={(e)=>setAddress(e.target.value)} required/>
            <p className="form_label">City</p>
            <input type="text" name="city" className="form_input" value={city} onChange={(e)=>setCity(e.target.value)} required/>
            <p className="form_label">Postal Code</p>
            <input type="text" name="postalCode" className="form_input" value={postalCode} onChange={(e)=>setPostalCode(e.target.value)} required/>
            <p className="form_label">Country</p>
            <input type="text" name="country" className="form_input" value={country} onChange={(e)=>setCountry(e.target.value)} required/>
            <button type="submit" className="btn form_btn">Continue</button>
        </form>
    </div>)
}
export default ShippingPage;