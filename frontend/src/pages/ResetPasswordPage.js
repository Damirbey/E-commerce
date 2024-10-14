import React, {useState, useEffect} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from "axios";

function ResetPasswordPage(){
    const {token} = useParams();
    const navigate = useNavigate();
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    useEffect(()=>{
        if(!token){
            navigate("/");
        }
    }, [navigate,token]);


    const onSumbitHandler = async (e)=>{
        e.preventDefault();
        try{
            if(password!==confirmPassword){
                toast.error("Passwords do not match");
                return;
            }else{
                const {data} = await axios.post('/api/users/reset-password',{
                    token,
                    password
                });
                toast.success(data.message);
                navigate("/signIn");
            }
        }catch(err){
            toast.error(getError(err));
        }
    }

    return(<div className="signIn">
        <Helmet>
            <title>Reset Password</title>
        </Helmet>
        <h1 className="heading-1 bold-text">Reset Password</h1>
        <form className="form" onSubmit={onSumbitHandler} method="POST">  
            <p className="form_label">New Password</p>
            <input type="password" name="password" className="form_input" onChange={(e)=>setPassword(e.target.value)}/>
            <p className="form_label">Confirm New Password</p>
            <input type="password" name="confirmPassword" className="form_input" onChange={(e)=>setConfirmPassword(e.target.value)}/>
            <button type="submit" className="btn form_btn">Submit</button>
        </form>
    </div>)
}

export default ResetPasswordPage;