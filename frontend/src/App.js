import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Footer from "./components/Footer";
import Navigation from "./components/Navigation";
import CartPage from "./pages/CartPage";
import HomePage from "./pages/HomePage";
import ProductPage from "./pages/ProductPage";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import { useRef } from 'react';
import ShippingPage from './pages/ShippingPage';
import PaymentMethodPage from './pages/PaymentMethodPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import UserProfilePage from './pages/UserProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';

function App() {
  const outerModal = useRef();
  return (
    
    <BrowserRouter>
      
      <Navigation outerModal={outerModal}/>
      <ToastContainer position='top-center'/>
        <Routes>
          <Route path="/" element={<HomePage/>}/>
          <Route path="/products/:slug" element={<ProductPage/>}/>
          <Route path="/cart" element={<CartPage/>}/>
          <Route path="/signIn" element={<SignIn/>}/>
          <Route path="/signUp" element={<SignUp/>}/>
          <Route path="/shipping" element={<ShippingPage/>}/>
          <Route path="/payment" element={<PaymentMethodPage/>}/>
          <Route path="/placeOrder" element={<PlaceOrderPage/>}/>
          <Route path="/userProfile" element={<UserProfilePage/>}/>
          <Route path="/order/:id" element={<OrderPage/>}/>
          <Route path="/orderHistory" element={<OrderHistoryPage/>}/>
        </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
