import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { addCategory } from "../features/categories/categorySlice";
import { Link } from "react-router-dom";
import { getCategories } from "../services/categories.service";
import "./styles/Category.css";
import Loader from "./Loader";


const Categories = () => {
    const [loading, setLoading] = useState(false);
    const categories = useSelector(state => state.categories);
    const dispatch = useDispatch();

    useEffect(() => {
        if (categories.length === 0) {      
            setLoading(true);
            const fetchCategories = async () => {
                try {
                    const data = await getCategories();
                    data.forEach(x => {
                        dispatch(addCategory(x));
                    });
                } catch (error) {
                    console.log(error.message);
                } finally { //Se ejecuta al final de la petición sin importar que haya habido error.
                    setLoading(false);
                }
            }

            fetchCategories();
        }
    }, [dispatch, categories]);

    return (
        <section>
            <h1>Categorías</h1>
            <div className="container-all">
                <div className="center">
                        {categories.map(c => 
                            <div className="container-category" key={c.id}>
                                <Link to={`/categories/${c.id}`} className="link">
                                    <h3>{c.name}</h3>
                                    <img alt={c.name} src={c.image} width="50%" height="32%" />
                                </Link>
                            </div>
                        )}
                        {loading && (<Loader></Loader>)}
                </div>
            </div>
        </section>
    )
}

export default Categories;