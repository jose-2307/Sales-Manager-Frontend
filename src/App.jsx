import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Home from "./components/Home";
import EditProduct from './components/EditProduct';
import CreatePurchase from './components/CreatePurchase';
import CreateProduct from "./components/CreateProduct";
import Login from './components/Login';


const App = () => {
  return(
    <>
    <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path="/" element={<Home />}/>
          <Route path="/categories" element={<Categories />}/>
          <Route path="/categories/:id" element={<Products />}/>
          <Route path="/categories/:id/edit-product/:productId" element={<EditProduct />}/>
          <Route path="/categories/:id/create-purchase/:productId" element={<CreatePurchase />}/>
          <Route path="/categories/:id/create-product" element={<CreateProduct />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="*" element={"404: ruta no encontrada"} />
        </Routes>
    </BrowserRouter>
    </>
  )
} 

export default App;