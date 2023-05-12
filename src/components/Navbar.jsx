import { Link } from "react-router-dom";
import "./styles/Navbar.css";

const Navbar = () => {
    return (
        <nav>
            <ul>
                <Link to={"/"} className="link">Home</Link>
                <li>Productos</li>
                <li>Clientes</li>
                <li>Perfil</li>
                <li>Análisis</li>
            </ul>
        </nav>
    )
}

export default Navbar