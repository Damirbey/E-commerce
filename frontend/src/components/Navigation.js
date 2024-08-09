import { Link, useNavigate } from "react-router-dom";
import React, { useContext, useRef, useEffect, useState } from "react";
import { Store } from "../Store";
import { FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { RiLoginBoxLine } from "react-icons/ri";
import { RiExpandRightFill } from "react-icons/ri";
import {toast} from 'react-toastify';
import { getError } from "../utils";
import axios from "axios";

function Navigation(){
    const outerModal = useRef();
    const categoryMenu = useRef();
    const navRef = useRef();
    const userNafRef = useRef();
    const {state, dispatch:ctxDispatch} = useContext(Store);
    const {userInfo} = state;
    const {cartItems} = state.cart;
    const [categories, setCategories] = useState([]);
    const [query,setQuery] = useState('');
    const navigate = useNavigate();
    let navContent;
    let cart = <Link to="/cart">
        <div className="nav_item">
            <span className="nav_item_text">Cart</span>
            <span className="nav_notification">{cartItems.reduce((acc,curr)=>(acc+curr.quantity),0)}</span>
        </div>
    </Link>

    const toggleModal = ()=>{
        outerModal.current.classList.toggle('responsive_menu');
    }
    
    const toggleCategoryMenu = ()=>{
        toggleModal();
        categoryMenu.current.classList.toggle('responsive_category_menu');
    }

    const toggleNavMenu = () =>{
        toggleModal();
        navRef.current.classList.toggle('responsive_nav_menu');
    }

    const toggleUserNav = ()=>{
        if(navRef.current.classList.contains('responsive_nav_menu')) {
            navRef.current.classList.remove('responsive_nav_menu');
            userNafRef.current.classList.toggle('responsive_nav_menu');
        }else{
            toggleModal();
            userNafRef.current.classList.toggle('responsive_nav_menu');
        }
    }

    const onSignOutHandler = ()=>{
        ctxDispatch({type:'SIGN_OUT'});
        toggleModal();
        window.location.href="/signIn"
    }

    const onClickHandler = (page)=>{
        navigate(page);
        toggleUserNav();
    }

    const onCategoryHandler = (category)=>{
        navigate(`/search?category=${category}`);
        toggleCategoryMenu();
    }

    const onSubmitHandler = (e)=>{
        e.preventDefault();
        navigate(query ? `/search?query=${query}` : '/search');
    }

    useEffect(()=>{
        const fetchCategories = async()=>{
            try{
                const {data} = await axios.get('/api/getProducts/categories');
                setCategories(data);
            }catch(error){
                toast.error(getError(error));
            }
        }
        fetchCategories();
        
    },[categories])

    if(!userInfo){
        navContent = <React.Fragment>
                <div className="nav" ref={navRef}>
                {cart}
                <Link to="/signIn">
                    <div className="nav_item">
                        <span className="nav_item_text">Log In</span>
                        <RiLoginBoxLine/>
                    </div>
                </Link>
                
            <FaTimes className="nav_close_btn" onClick={toggleNavMenu}/>
            </div>
            <FaBars className="menu_btn" onClick={toggleNavMenu}/>
        </React.Fragment>
    }else{
        navContent = <React.Fragment>
        <div className="nav" ref={navRef}>
        {cart}
        
        <div className="nav_item" onClick={toggleUserNav}>
            <span className="nav_item_text">{userInfo.name}</span>
            <RiExpandRightFill/>
        </div>

        
        <div className="userNav" ref={userNafRef}>
            <div className="userNav_nav">
                <p className="userNav_nav_text">Hello, {userInfo.name}</p>
                <FaTimes className="userNav_nav_close_btn" onClick={toggleUserNav}/>
            </div>

            <div className="userNav_section">    
                <h3 className="userNav_section_heading">Profile</h3>
                <div className="userNav_section_item" onClick={()=>onClickHandler('/userProfile')}>Settings</div>
                <div className="userNav_section_item" onClick={onSignOutHandler}>Sign Out</div>
            </div>

            <div className="userNav_section">    
                <h3 className="userNav_section_heading">Your Orders</h3>
                <div className="userNav_section_item" onClick={()=>onClickHandler('/orderHistory')}>Order History</div>
            </div>
            {userInfo.isAdmin &&
            <div className="userNav_section">    
                <h3 className="userNav_section_heading">Admin</h3>
                <div className="userNav_section_item">Dashboard</div>
                <div className="userNav_section_item">Products</div>
                <div className="userNav_section_item">Orders</div>
                <div className="userNav_section_item">Users</div>
            </div>
            }
        </div>
        
        <FaTimes className="nav_close_btn" onClick={toggleNavMenu}/>
    </div>
    <FaBars className="menu_btn" onClick={toggleNavMenu}/>
    </React.Fragment>
    }
   
    return(<header className="navigation">
        <div className="logo">
            <FaBars className="logo_btn" onClick={toggleCategoryMenu}/>
            <Link to="/"><h1 className="heading-1 logo_title">Amazona</h1></Link>
        </div>

        <form className="search" onSubmit={onSubmitHandler}>
            <input type="text" className="search_input" />
            <button className="search_btn">
                <FaSearch className="search_btn_logo"/>
            </button>
        </form>

        {navContent}

        <div className="outer_modal" ref={outerModal}>
        </div>
    
        <div className="category_menu" ref={categoryMenu}>
            <FaTimes className="category_menu_btn" onClick={toggleCategoryMenu}/>
            {categories.map((category)=>(
                <div className="category_menu_item" onClick={()=>onCategoryHandler(category)}>
                    {category}
                </div>
            ))}
            
        </div>

    </header>
    )
}

export default Navigation;