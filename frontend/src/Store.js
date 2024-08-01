import {createContext, useReducer} from 'react';

export const Store = createContext();

const initialState = {
    cart:{
        cartItems:localStorage.getItem('cartItems') ?
        JSON.parse(localStorage.getItem('cartItems'))
        : [],
        shippingAddress: localStorage.getItem('shippingAddress') ? 
        JSON.parse(localStorage.getItem('shippingAddress'))
        :{},
        paymentMethod:localStorage.getItem('paymentMethod') ?
        localStorage.getItem('paymentMethod') :
        ''
    },
    userInfo:localStorage.getItem('userInfo')?
    JSON.parse(localStorage.getItem('userInfo'))
    :null
};

function reducer(state, action){
    switch(action.type){
        case 'ADD_TO_CART':{
            const newItem = action.payload;
            const existItem = state.cart.cartItems.find((cartItem)=>cartItem._id === newItem._id);
            const cartItems = existItem ? 
            state.cart.cartItems.map((cartItem)=>cartItem._id === existItem._id ? newItem : cartItem)
            :
            [...state.cart.cartItems, newItem];  
            localStorage.setItem('cartItems', JSON.stringify(cartItems));
            return {...state, cart:{...state.cart,cartItems}} ;
        }
        case 'CART_CLEAR':{
            return{...state, cart:{...state.cart, cartItems:[]}}
        }
        case 'CART_REMOVE_ITEM':{
            const itemToDelete = action.payload;
            const cartItems = state.cart.cartItems.filter((cartItem)=>cartItem._id !== itemToDelete._id);
            return {...state, cart:{...state.cart, cartItems}};
        }
        case 'SAVE_SHIPPING_ADDRESS':{
            return {...state, cart:{...state.cart, shippingAddress:action.payload}};
        }
        case 'SAVE_PAYMENT_METHOD':{
            return {...state,cart:{...state.cart,paymentMethod:action.payload}};
        }
        case 'SIGN_IN':{
            return {...state, userInfo:action.payload}
        }
        case 'SIGN_OUT':{    
            localStorage.removeItem('userInfo');
            localStorage.removeItem('shippingAddress');
            localStorage.removeItem('paymentMethod');
            localStorage.removeItem('cartItems');
            return{...state, userInfo:null, cart:{cartItems:[],shippingAddress:{},paymentMethod:''}}
        }

        default:
            return state;
    }
}

export function StoreProvider(props){
    const [state, dispatch] = useReducer(reducer, initialState);
    const value = {state, dispatch};
    return <Store.Provider value={value}>{props.children}</Store.Provider>
}