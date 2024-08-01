import React,{useContext, useState} from "react";
import { Helmet } from "react-helmet-async";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { getError } from "../utils";
import { Store } from "../Store";

function SignUp(){
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const {dispatch:ctxDispatch} = useContext(Store);
    const navigate = useNavigate();
    const { search } = useLocation();
    const redirectInUrl = new URLSearchParams(search).get('redirect');
    const redirect = redirectInUrl ? redirectInUrl : '/';

    const onSumbitHandler= async (e)=>{
        e.preventDefault();
        if(password!==confirmPassword){
            toast.error('Passwords do not match');
            return;
        }

        try{
            const {data} = await axios.post('/api/users/signUp',{
                name,
                email,
                password
            });
            ctxDispatch({type:'SIGN_IN',payload:data});
            localStorage.setItem('userInfo', JSON.stringify(data));
            navigate(redirect || '/');
        }catch(error){
            toast.error(getError(error));
        }
    }
    
    return(
        <div className="signIn">
        <Helmet>
            <title>Sign Up</title>
        </Helmet>
        <h1 className="heading-1 bold-text">Sign Up</h1>
        <form className="form" onSubmit={onSumbitHandler} method="POST">  
            <p className="form_label">Name</p>
            <input type="text" name="name" className="form_input" onChange={(e)=>setName(e.target.value)} required/>

            <p className="form_label">Email</p>
            <input type="email" name="email" className="form_input" onChange={(e)=>setEmail(e.target.value)} required/>

            <p className="form_label">Password</p>
            <input type="password" name="password" className="form_input" onChange={(e)=>setPassword(e.target.value)} required/>

            <p className="form_label">Confirm Password</p>
            <input type="password" name="confirmPassword" className="form_input" onChange={(e)=>setConfirmPassword(e.target.value)} required/>

            <button type="submit" className="btn form_btn">Sign Up</button>
            <p className="form_link">Already have an account? <Link to="/signIn" >Sign In</Link></p>
        </form>
    </div>
    )
}
export default SignUp;