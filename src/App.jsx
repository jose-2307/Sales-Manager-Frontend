import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Home from "./components/Home";
import EditProduct from './components/EditProduct';
import CreatePurchase from './components/CreatePurchase';
import CreateProduct from "./components/CreateProduct";
import Login from './components/Login';
import SignUp from './components/SignUp';
import RecoveryPassword from './components/RecoveryPassword';
import ChangePassword from './components/ChangePassword';
import Analysis from './components/Analysis';
import CreatePurchaseOrder from './components/CreatePurchaseOrder';
import Customers from './components/Customers';
import EditCustomer from './components/EditCustomer';
import CreateCustomer from './components/CreateCustomer';
import EditUser from './components/EditUser';


const App = () => {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navbar><Home /></Navbar>}/>
        <Route path="/create-purchase-order" element={<Navbar><CreatePurchaseOrder /></Navbar>}/>
        <Route path="/categories" element={<Navbar><Categories /></Navbar>}/>
        <Route path="/categories/:id" element={<Navbar><Products /></Navbar>}/>
        <Route path="/categories/:id/edit-product/:productId" element={<Navbar><EditProduct /></Navbar>}/>
        <Route path="/categories/:id/create-purchase/:productId" element={<Navbar><CreatePurchase /></Navbar>}/>
        <Route path="/categories/:id/create-product" element={<Navbar><CreateProduct /></Navbar>}/>
        <Route path="/customers" element={<Navbar><Customers /></Navbar>}/>
        <Route path="/customers/edit/:id" element={<Navbar><EditCustomer /></Navbar>}/>
        <Route path="/customers/create-customer" element={<Navbar><CreateCustomer /></Navbar>}/>
        <Route path="/account" element={<Navbar><EditUser /></Navbar>}/>
        <Route path="/login" element={<Login />}/>
        <Route path="/sign-up" element={<SignUp />}/>
        <Route path="/recovery-password" element={<RecoveryPassword />}/>
        <Route path="/analysis" element={<Navbar><Analysis /></Navbar>}/>
        <Route path="/change-password" element={<ChangePassword />}/>
        <Route path="*" element={"404: ruta no encontrada"} />
      </Routes>
    </BrowserRouter>
  )
} 

export default App;