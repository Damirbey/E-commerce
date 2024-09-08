import { useContext } from "react";
import { Store } from "../Store";
import { Navigate } from "react-router-dom";

function AdminRoute (props){
    const {state} = useContext(Store);
    const {userInfo} = state;
    return userInfo && userInfo.isAdmin ? props.children : <Navigate to = "/"/>
}
export default AdminRoute;
