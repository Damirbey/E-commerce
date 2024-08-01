import React , {useContext, useEffect, useState} from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { getError } from "../utils";
import {toast} from 'react-toastify';
import axios from "axios";
import { Store } from "../Store";

function SignIn(){
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const {state,dispatch:ctxDispatch} = useContext(Store);
    const {userInfo} = state;
    const navigate = useNavigate();
    
    const onSumbitHandler = async (e)=>{
        e.preventDefault();
        try{
            const {data} = await axios.post('/api/users/signIn',{
                email,
                password
            });
            ctxDispatch({type:'SIGN_IN',payload:data});
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/');

        }catch(err){
            toast.error(getError(err));
        }
    }

    useEffect(()=>{
        if(userInfo){
            navigate(redirect);
        }
    },[userInfo,redirect, navigate]);

    return(<div className="signIn">
        <Helmet>
            <title>Sign In</title>
        </Helmet>
        <h1 className="heading-1 bold-text">Sign In</h1>
        <form className="form" onSubmit={onSumbitHandler} method="POST">  
            <p className="form_label">Email</p>
            <input type="email" name="email" className="form_input" onChange={(e)=>setEmail(e.target.value)}/>
            <p className="form_label">Password</p>
            <input type="password" name="password" className="form_input" onChange={(e)=>setPassword(e.target.value)}/>
            <button type="submit" className="btn form_btn">Sign In</button>
            <p className="form_link">New customer? <Link to='/signUp' >Create your account</Link></p>
        </form>
    </div>
    )
}

export default SignIn;