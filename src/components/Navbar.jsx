import { Link } from "react-router-dom";
import "./styles/Navbar.css";
import { logoutBack } from "../services/auth.service";
import Loader from "./Loader";
import { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

const Navbar = ({children}) => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");

    const logout = async () => {
        setLoading(true);
        let errorOCurred = false;
        try {
        await logoutBack();
        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.message);
            errorOCurred = true;
        } finally {
            if (!errorOCurred) {
                setLoading(false);
            }
        }
    }

    const closeErrorModal = () => { //Cierra el modal en caso de dar click en el botón de cerrar
        setLoading(false);
        setErrorMessage("");
    }

    return (
        <>
            <nav>
                <ul className="ul-nav">
                    <div>
                        <li>
                            <Link to={"/"} className="home-link"><img className="logo" src="../../icons/logo.png" alt="logo"/> <span className="sm">Sales Manager</span></Link>
                        </li>
                    </div>
                    <div className="lis-nav">
                        <li><Link to={"/categories"} className="link-nav">Productos</Link></li>
                        <li><Link to={"/customers"} className="link-nav">Clientes</Link></li>
                        <li><Link to={"/analysis"} className="link-nav">Análisis</Link></li>
                        <div className="dropdown">
                            <button className="dropbtn">Cuenta
                                <FontAwesomeIcon icon={faCaretDown} className="dropdow-icon" />
                            </button>
                            <div className="dropdown-content">
                                <Link to={"/account"}>Modificar cuenta</Link>
                                <a onClick={logout} className="logout">Cerrar sesión</a>
                            </div>
                        </div>
                    </div>
                </ul>
            </nav>
            {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
            {children}
        </>        
    )
}

export default Navbar