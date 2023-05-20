import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Home from "./components/Home";
import EditProduct from './components/EditProduct';


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
          <Route path="*" element={"404: ruta no encontrada"} />
        </Routes>
    </BrowserRouter>
    </>
  )
} 

export default App;