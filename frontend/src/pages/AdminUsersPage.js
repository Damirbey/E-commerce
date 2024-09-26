import { Helmet } from "react-helmet-async";
import Spinner from "../components/Spinner";
import { useContext, useEffect, useReducer, useState } from "react";
import { Store } from "../Store";
import axios from "axios";
import ReactPaginate from "react-paginate";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getError } from "../utils";

const reducer = (state,action)=>{
    switch(action.type){
        case "USERS_REQUEST":
            return {...state, loadingUsers:true};
        case "USERS_SUCCESS":
            return {...state, loadingUsers:false, users:action.payload};
        case "USERS_FAIL":
            return {...state, loadingUsers:false}
        case "DELETE_REQUEST":
            return {...state, loadingDelete:true, successDelete:false};
        case "DELETE_SUCCESS":
            return {...state, loadingDelete:false, successDelete:true};
        case "DELETE_FAIL":
            return {...state, loadingDelete:false, successDelete:false};
        case "DELETE_RESET":
            return {...state, loadingDelete:false, successDelete:false};
        default:
            return state;
    }
}


function AdminUsersPage(){
    const [{users, loadingUsers, loadingDelete, successDelete}, dispatch] = useReducer(reducer,{
        loadingUsers:false,
        successDelete:false,
        loadingDelete:false,
        users:[]
    });
    const {state} = useContext(Store);
    const {userInfo} = state;
    const navigate = useNavigate();
    const [pageNumber, setPageNumber] = useState('');
    //IMPLEMENTING PAGINATION

    const usersPerPage = 4;
    const pagesVisited = pageNumber * usersPerPage;
    const displayUsers = users.slice(
        pagesVisited,
        usersPerPage + pagesVisited
    );
    const pageCount = Math.ceil(users.length / usersPerPage);
    const changePage = ({ selected }) => {
        setPageNumber(selected);
    };

    const onDeleteUser = async (user)=>{
        if(window.confirm("Are you sure you want to delete the selected user?")){
            try{
                dispatch({type:"DELETE_REQUEST"});
                await axios.delete(`/api/users/${user._id}`,{
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                dispatch({type:"DELETE_SUCCESS"});
                toast.success("User deleted successfully");
                if(displayUsers.length === 1 && pageNumber > 0){
                    setPageNumber(pageNumber-1);
                }

            }catch(err){
                toast.error(getError(err));
                dispatch({type:"DELETE_FAIL"});
            }
        }
    }

    useEffect(()=>{
        const fetchUsers = async ()=>{
            try{

                dispatch({type:"USERS_REQUEST"});
                const {data} = await axios.get("/api/users",{
                    headers: { Authorization: `Bearer ${userInfo.token}` }
                });
                dispatch({type:"USERS_SUCCESS", payload:data});
            }catch(err){
                dispatch({type:"USERS_FAIL"});
            }
        }

        if(successDelete){
            dispatch({type:"DELETE_RESET"});
        }

        fetchUsers();
    },[userInfo,successDelete])

    return (<div className="tabularPage">
        <Helmet>
            <title>Users</title>
        </Helmet>
        <div className="tabularPage_heading">
            <h1 className="heading-1">Users List</h1>
        </div>
        
        {
            loadingUsers ? 
            <Spinner/>
            :
            <div className="table-container">
                <table className="responsive-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>IS ADMIN</th>
                            <th>ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                       {displayUsers.map((user,index) =>(
                        <tr key={index}>
                            <td>{user._id}</td>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                            <td>{user.isAdmin ? "Yes": "No"}</td>
                            <td>
                                <button className="btn" onClick={()=>navigate(`/user/${user._id}`)}> Edit</button>  <button className="btn btn-disabled" onClick={()=>onDeleteUser(user)}> Delete</button>
                            </td>
                        </tr>
                       ))}
                    </tbody>
                </table>
                
            </div>
            
        }
        <ReactPaginate
            previousLabel={'Previous'}
            nextLabel={'Next'}
            pageCount={pageCount}
            onPageChange={changePage}
            containerClassName={'paginationBttns'}
            previousLinkClassName={'previousBttn'}
            nextLinkClassName={'nextBttn'}
            disabledClassName={'paginationDisabled'}
            activeClassName={'paginationActive'}
            forcePage={pageNumber}
        />
    </div>
    )

}
export default AdminUsersPage;