import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Categories from "./components/Categories";
import Products from "./components/Products";

const App = () => {
  return(
    <>
    <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path='/' element={<Categories />}/>
          <Route path='/products' element={<Products />}/>
        </Routes>
    </BrowserRouter>
    </>
  )
} 

export default App;