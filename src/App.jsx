import { useSelector } from "react-redux";

const App = () => {
  const products = useSelector(state => state.products);
  const categories = useSelector(state => state.categories);


  console.log({products, categories})
  return(
    <div>Hello world</div>
  )
} 

export default App;