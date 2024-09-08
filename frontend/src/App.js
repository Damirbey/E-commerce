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
import SearchPage from './pages/SearchPage';
import ProtectedRoute from './components/ProtectedRoute';
import AdminDashboardPage from './pages/AdminDashboardPage';
import AdminRoute from './components/AdminRoute';
 
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
          <Route path="/shipping" element={
            <ProtectedRoute>
              <ShippingPage/>
            </ProtectedRoute>
          }/>
          <Route path="/payment" element={
            <ProtectedRoute>
              <PaymentMethodPage/>
            </ProtectedRoute>
          }/>
          <Route path="/placeOrder" element={
            <ProtectedRoute>
              <PlaceOrderPage/>
            </ProtectedRoute>
          }/>
          <Route path="/userProfile" element={
            <ProtectedRoute>
              <UserProfilePage/>
            </ProtectedRoute>
          }/>
          <Route path="/order/:id" element={
            <ProtectedRoute>
              <OrderPage/>
            </ProtectedRoute>
          }/>
          <Route path="/orderHistory" element={
            <ProtectedRoute>
              <OrderHistoryPage/>
            </ProtectedRoute>
          }/>
          <Route path="/search" element={<SearchPage/>}/>
          <Route path="/dashboard" element={
            <AdminRoute>
              <AdminDashboardPage/>
            </AdminRoute>
          }/>
        </Routes>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
