import { Helmet } from "react-helmet-async";
import React, {useState} from "react";
import { toast } from "react-toastify";
import { getError } from "../utils";
import axios from "axios";

function ForgotPasswordPage(){
    const [email, setEmail] = useState('');

    const onSumbitHandler = async (e)=>{
        e.preventDefault();
        try{
            const {data} = await axios.post('/api/users/forgot-password',{
                email
            });
            toast.success(data.message);
        }catch(err){
            toast.error(getError(err));
        }
    }

    return (
        <div className="signIn">
        <Helmet>
            <title>Forgot Password</title>
        </Helmet>
        <h1 className="heading-1 bold-text">Forgot Password</h1>
        <form className="form" onSubmit={onSumbitHandler} method="POST">  
            <p className="form_label">Email</p>
            <input type="email" name="email" className="form_input" onChange={(e)=>setEmail(e.target.value)}/>
            <button type="submit" className="btn form_btn">Submit</button>

        </form>
    </div>
    )

}
export default ForgotPasswordPage;