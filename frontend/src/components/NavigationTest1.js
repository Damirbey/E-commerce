import { Link } from "react-router-dom";
import React, { useContext, useRef, useEffect } from "react";
import { Store } from "../Store";
import { FaShoppingCart, FaBars, FaTimes, FaSearch } from "react-icons/fa";
import { MdOutlineArrowForwardIos } from "react-icons/md";

function Navigation(props) {
    const { state, dispatch: ctxDispatch } = useContext(Store);
    const { cart, userInfo } = state;
    const navRef = useRef();
    const catRef = useRef();
    const outerModal = useRef();

    const onSignOutHandler = (e) => {
        e.preventDefault();
        ctxDispatch({ type: 'SIGN_OUT' });
        localStorage.removeItem('userInfo');
    }

    const openMenu = (e) => {
        e.stopPropagation();
        outerModal.current.classList.toggle('showModal');
        navRef.current.classList.toggle('responsive_nav');
    }

    const openCategories = (e) => {
        e.stopPropagation();
        outerModal.current.classList.toggle('showModal');
        catRef.current.classList.toggle('responsive_categories');
    }

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (navRef.current && !navRef.current.contains(e.target)) {
                navRef.current.classList.remove('responsive_nav');
            }
            if (catRef.current && !catRef.current.contains(e.target)) {
                catRef.current.classList.remove('responsive_categories');
            }
            
            if (outerModal.current && !outerModal.current.contains(e.target)) {
               outerModal.current.classList.remove('showModal');
            }
        };

        window.addEventListener("click", handleClickOutside);

        return () => {
            window.removeEventListener("click", handleClickOutside);
        };
    }, [navRef, catRef, props.outerModal]);

    return (
        <header className="navigation">
            <div className="navigation_branding">
                <FaBars onClick={openCategories} />
                <Link to="/"><h1 className="heading-1 navigation_brand">Amazona</h1></Link>
            </div>

            <form action="#" className="navigation_searchBox">
                <input type="text" placeholder="Search for a product" className="navigation_searchBox_input" />
                <button type="submit" className="navigation_searchBox_btn">
                    <svg className="navigation_searchBox_icon">
                        <use xlinkHref="/images/sprite.svg#icon-magnifying-glass"></use>
                    </svg>
                </button>
            </form>

            <nav className="nav">
                <div className="nav_item">
                    <FaShoppingCart />
                    <span className="nav_item_text">Cart</span>
                </div>
                <div className="nav_item" onClick={openMenu}>
                    <span className="nav_item_text">User</span>
                    <MdOutlineArrowForwardIos />
                </div>
            </nav>
            <FaBars className="nav_btn" />

            <div className="extraMenu" ref={navRef}>
                <div className="extraMenu_item">
                    History
                </div>
                <div className="extraMenu_item">
                    Orders
                </div>
                <div className="extraMenu_item">
                    <span onClick={onSignOutHandler}>Logout</span>
                </div>
                <FaTimes className="extraMenu_btn" onClick={openMenu} />
            </div>

            <div className="categories" ref={catRef}>
                <div className="categories_item">
                    Shirts
                </div>
                <div className="categories_item">
                    Pants
                </div>
                <div className="categories_item">
                    Boots
                </div>
                <FaTimes className="categories_btn" onClick={openCategories} />
            </div>
            <div className="outer_modal" ref={outerModal}></div>
        </header>
    )
}

export default Navigation;
