import { Link } from "react-router-dom";
import "./styles/Navbar.css";

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to={"/"} className="link">Home</Link></li>
                <li><Link to={"/products"} className="link">Productos</Link></li>
                <li>Clientes</li>
                <li>Perfil</li>
                <li>Análisis</li>
            </ul>
        </nav>
    )
}

export default Navbar