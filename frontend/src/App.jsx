import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import {ToastContainer} from 'react-toastify'
import "react-toastify/dist/ReactToastify.css";
import Header from "./components/Header.jsx/Header";
import Footerr from "./components/Footer/Footer";
import Home from "./pages/Home";
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import PrivateRoute from './components/PrivateRoute'
import Dashboard from "./pages/Dashboard";
import Product from "./pages/Product";
import EditProduct from "./pages/EditProduct";
import AdminPrivateRoute from "./components/AdminPrivateRoute"
import Cart from "./pages/Cart";
import Collections from "./pages/Collections";
import Orders from "./pages/Orders";
import ShippingAddress from "./pages/ShippingAddress";

function App() {
  return (
    <BrowserRouter>
      <ToastContainer />
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/address" element={<ShippingAddress />} />
          
        </Route>
        <Route path="/product/:prodId" element={<Product />} />
        <Route element={<AdminPrivateRoute />}>
          <Route path="/product/edit/:prodId" element={<EditProduct />} />
        </Route>
        <Route path="/collections/:collectionName" element={<Collections />} />
      </Routes>
      <Footerr />
    </BrowserRouter>
  );
}

export default App;
