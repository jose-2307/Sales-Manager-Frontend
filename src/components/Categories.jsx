import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import "./styles/Category.css";


const Categories = () => {
    const categories = useSelector(state => state.categories);

    return (
        <section>
            <h1>Categorías</h1>
            <div className="container-all">
                <div className="center">
                        {categories.map(c => 
                            <div className="container-category" key={c.id}>
                                <Link to={`/my-products/${c.id}`} className="link">
                                    <h3>{c.name}</h3>
                                    <img alt={c.name} src={c.url} width="50%" height="32%" />
                                </Link>
                            </div>
                        )}
                </div>
            </div>
        </section>
    )
}

export default Categories;