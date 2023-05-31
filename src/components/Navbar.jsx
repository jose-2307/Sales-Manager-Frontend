import { Link } from "react-router-dom";
import "./styles/Navbar.css";

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to={"/"} className="link">Home</Link></li>
                <li><Link to={"/categories"} className="link">Productos</Link></li>
                <li><Link to={"/login"} className="link">Productos</Link></li>
                <li>Perfil</li>
                <li>Análisis</li>
            </ul>
        </nav>
    )
}

export default Navbar