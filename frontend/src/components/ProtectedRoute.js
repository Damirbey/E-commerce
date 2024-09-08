import { Store } from "../Store";
import { useContext } from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute(props){
    const {state} = useContext(Store);
    const {userInfo} = state;
    return userInfo ? props.children : <Navigate to="/signIn"/>
}

export default ProtectedRoute;