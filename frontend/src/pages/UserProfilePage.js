import { Helmet } from "react-helmet-async";
import React, {useState, useContext, useEffect, useReducer} from "react";
import { Store } from "../Store";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from "axios";

const reducer = (state, action)=>{
    switch(action.type){
        case 'UPDATE_REQUEST':
            return {...state, loadingUpdate:true};
        case 'UPDATE_FAIL':
            return {...state, loadingUpdate:false};
        case 'UPDATE_SUCCESS':
            return {...state, loadingUpdate:false};
        default:
            return state;
    }
}

function UserProfilePage(){
    const [{loadingUpdate}, dispatch] = useReducer(reducer,{
        loadingUpdate : false
    });
    const {state, dispatch:ctxDispatch} = useContext(Store);
    const {userInfo} = state;
    const [name, setName] = useState(userInfo.name);
    const [email, setEmail] = useState(userInfo.email);
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigate = useNavigate();
    
    const onSubmitHandler = async (e)=>{
        e.preventDefault();
        try{
            dispatch({type:'UPDATE_REQUEST'});
            if(!(password === confirmPassword)){
                toast.error('Passwords do not match!');
                return;
            }
            const {data} = await axios.put('/api/users/updateProfile',{
                name,
                email,
                password
            },
            {
                headers: { Authorization: `Bearer ${userInfo.token}` },
            }
            );
            dispatch({type:'UPDATE_SUCCESS'});
            ctxDispatch({type:'SIGN_IN', payload:data});
            localStorage.setItem('userProfile', JSON.stringify(data));
            toast.success("Profile updated successfully");
        }catch(error){
            dispatch({type:'UPDATE_FAIL'});
            toast.error(getError(error));
        }
    }
    
    return(
        <div className="signIn">
        <Helmet>
            <title>Settings</title>
        </Helmet>
        <h1 className="heading-1 bold-text">Update Profile</h1>
        <form className="form" onSubmit={onSubmitHandler} method="POST"> 
            <p className="form_label">Name</p>
            <input type="text" name="name" className="form_input" onChange={(e)=>setName(e.target.value)} value={name} required/> 
            <p className="form_label">Email</p>
            <input type="email" name="email" className="form_input" onChange={(e)=>setEmail(e.target.value)} value={email} required/>
            <p className="form_label">Password</p>
            <input type="password" name="password" className="form_input" onChange={(e)=>setPassword(e.target.value)} required/>
            <p className="form_label">Confirm Password</p>
            <input type="password" name="confirmPassword" className="form_input" onChange={(e)=>setConfirmPassword(e.target.value)} required/>
            <button type="submit" className="btn form_btn">Update</button>
        </form>
    </div>
    )
}
export default UserProfilePage;