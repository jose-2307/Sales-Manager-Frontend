import { Link } from "react-router-dom";
import "./styles/Navbar.css";
import { logoutBack } from "../services/auth.service";
import Loader from "./Loader";
import { useState } from "react";

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
                    <li>
                        <Link to={"/"} className="link"><img className="logo" src="../../icons/logo.png"/></Link>
                    </li>
                    <li><Link to={"/categories"} className="link">Productos</Link></li>
                    <li><Link to={"/customers"} className="link">Clientes</Link></li>
                    <li><Link to={"/analysis"} className="link">Análisis</Link></li>
                    <div className="dropdown">
                        <button className="dropbtn">Cuenta
                            <i className="fa fa-caret-down"></i>
                        </button>
                        <div className="dropdown-content">
                            <Link to={"/account"}>Modificar cuenta</Link>
                            <a onClick={logout}>Cerrar sesión</a>
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