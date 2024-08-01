import { useContext } from "react";
import { Store } from "../Store";
import {Helmet} from 'react-helmet-async';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import MessageBox from "../components/MessageBox";
import {CartButton} from '../components/Components';

function CartPage (){
    const {state, dispatch:ctxDispatch} = useContext(Store);
    const {cartItems} = state.cart;
    const navigate = useNavigate();

    const updateCartHadler = async(cartItem, quantity)=>{
        const {data} = await axios.get(`/api/getProducts/id/${cartItem._id}`);
       
        if(data.countInStock < quantity){
            window.alert("Sorry we are out of stock");
            return;
        }
        ctxDispatch({type:'ADD_TO_CART', payload:{...cartItem,quantity}});
    }

    const deleteCartHandler = (cartItem)=>{
        ctxDispatch({type:"CART_REMOVE_ITEM", payload:cartItem});
    }

    const onCheckoutHandler = ()=> {
        navigate('/signIn?redirect=/shipping')
    }
    return(
    <div className="cart">
        <Helmet>
            <title>Shopping Cart</title>
        </Helmet>
        <h1 className="heading-1">Shopping Cart</h1>
        <div className="cartScreen">
            
            <div className="cartScreen_cartItems">
            {cartItems.length > 0 ?
                cartItems.map((cartItem, index)=>(
                    <div className="cartScreen_cartItems_cartItem" key={index}>
                            <div className="cartScreen_cartItems_cartItem_imageSection">
                                <img src={cartItem.image} className="cartScreen_cartItems_cartItem_img" alt={cartItem.name}/>
                                <Link to={`/products/${cartItem.slug}`}><p className="cartScreen_cartItems_cartItem_title">{cartItem.name}</p></Link>
                            </div>

                            <div className="cartScreen_cartItems_cartItem_quantity">
                                <CartButton type={'minus'} disabled={cartItem.quantity <= 1} onClickHandler ={()=>updateCartHadler(cartItem, cartItem.quantity - 1)} />
                                <p className="cartScreen_cartItems_cartItem_quantity_number">{cartItem.quantity}</p>
                                <CartButton type={'plus'} onClickHandler ={()=>updateCartHadler(cartItem, cartItem.quantity + 1)} />

                            </div>
                            <div className="cartScreen_cartItems_cartItem_price">
                                $ {cartItem.price}
                            </div>
                            <CartButton type={'bin'} disabled={cartItem.quantity <= 1} onClickHandler ={()=>deleteCartHandler(cartItem)} />
                        </div>
                        ))
                :<MessageBox message={'Cart is empty'} type="alert-info" link="/" linkMessage={'Go Shopping'} />
            }
            </div>

            <div className="cartScreen_total">
                <div className="cartScreen_total_price">
                    <p>Subtotal ({cartItems.reduce((acc,cur)=>(acc+cur.quantity),0)} items):</p>
                    <p>$ {cartItems.reduce((acc,cur)=>(acc+(cur.quantity*cur.price)),0)}</p>
                </div>
                <div className="cartScreen_total_proceed">
                    {cartItems.length > 0 ?
                    <button className="btn" onClick={onCheckoutHandler}>Proceed to Checkout</button>
                    :
                    <button className="btn-disabled">Proceed to Checkout</button>
                    }
                </div>
                
            </div>
        </div>
        
    </div>
    )
}
export default CartPage;