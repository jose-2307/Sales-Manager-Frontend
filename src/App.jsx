import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Categories from "./components/Categories";
import Products from "./components/Products";
import Home from "./components/Home";


const App = () => {
  return(
    <>
    <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path='/' element={<Home />}/>
          <Route path='/categories' element={<Categories />}/>
          <Route path='/categories/:id' element={<Products />}/>
        </Routes>
    </BrowserRouter>
    </>
  )
} 

export default App;