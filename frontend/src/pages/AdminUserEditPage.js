import { Helmet } from "react-helmet-async";
import { useContext, useEffect, useReducer, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Store } from "../Store";
import { toast } from "react-toastify";
import { getError } from "../utils";

const reducer = (state,action)=>{
    switch(action.type){
        case "USER_REQUEST":
            return {...state, loadingUser:true};
        case "USER_SUCCESS":
            return {...state, loadingUser:false, user:action.payload};
        case "USER_FAIL":
            return {...state, loadingUser:false};
        case "UPDATE_REQUEST":
            return {...state, loadingUpdate:true};
        case "UPDATE_SUCCESS":
            return {...state, loadingUpdate:false};
        case "UPDATE_FAIL":
            return {...state, loadingUpdate:false};
        default:
            return state;
    }
}

function AdminUserEditPage(){
    const [{loadingUser, user}, dispatch] = useReducer(reducer,{
        loadingUser:false,
        user:''
    });
    const {state} = useContext(Store);
    const {userInfo} = state;
    const params = useParams();
    const {id:userId} = params;
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [isAdmin, setIsAdmin] = useState(false)
    const navigate = useNavigate();

    const onSubmitHandler = async (e)=>{
        e.preventDefault();
        try{
            dispatch({type:"UPDATE_REQUEST"});
            await axios.put(`/api/users/${userId}`,
                {
                    name,
                    email,
                    isAdmin
                },
                {
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                }
            );
            dispatch({type:"UPDATE_SUCCESS"});
            toast.success("User Updated Successfully.");
            navigate("/adminUsers");
        }catch(err){
            dispatch({type:"UPDATE_FAIL"});
            toast.error(getError(err));
        }
    }


    useEffect(()=>{
        const fetchUser = async()=>{
            try{
                dispatch({type:"USER_REQUEST"});
                const {data} = await axios.get(`/api/users/${userId}`,{
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                setName(data.name);
                setEmail(data.email);
                setIsAdmin(data.isAdmin);
                dispatch({type:"USER_SUCCESS", payload:data});
            }catch(err){
                dispatch({type:"USER_FAIL"});
            }
        }
        fetchUser();
    },[userId,userInfo])


    return(
        <div className="editProduct">
            <Helmet>
                <title>
                    Edit User
                </title>
            </Helmet>
            <h1 className="heading-1 bold-text">Edit User {userId}</h1>
            <form className="form" onSubmit={onSubmitHandler}>  
                <p className="form_label">Name</p>
                <input type="text" name="name" className="form_input" value={name} onChange={(e)=>setName(e.target.value)}/>

                <p className="form_label">Email</p>
                <input type="text" name="email" className="form_input" value={email} onChange={(e)=>setEmail(e.target.value)}/>
                
                <label className="form_checkbox-wrapper">
                    <input type="checkbox" name="isAdmin" checked={isAdmin} onChange={(e)=>setIsAdmin(e.target.checked)} className="form_checkbox" id="myCheckbox"/>
                    <span className="form_checkbox-label">is Admin</span>
                </label>

                <button type="submit" className="btn form_btn">Update</button>
               
            </form>

        </div>
    )
}
export default AdminUserEditPage;