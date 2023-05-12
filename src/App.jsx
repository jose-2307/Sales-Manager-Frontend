import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from "./components/Navbar";
import Categories from "./components/Categories";

const App = () => {
  return(
    <>
    <BrowserRouter>
      <Navbar />
        <Routes>
          <Route path='/' element={<Categories />}/>
        </Routes>
    </BrowserRouter>
    </>
  )
} 

export default App;