import { useDispatch, useSelector } from "react-redux";
import { getCustomersBack } from "../services/customers.service";
import { addCustomer } from "../features/customers/customerSlice";
import { nameTransform } from "../utils/functions";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button } from '@mui/material';
import { useEffect, useState } from 'react';
import Loader from './Loader';
import { Link } from 'react-router-dom';
import "./styles/Customers.css";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    // hide last border
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));



const headers = ["Nombre", "Correo electrónico", "Contacto", "Ubicación", "Editar"];

const Customers = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const customers = useSelector(state => state.customers);
    const dispatch = useDispatch();

    useEffect(() => {
        if (customers.length === 0) {
            setLoading(true);
            let errorOCurred = false;
            const fetchData = async () => {
                try {
                    const data = await getCustomersBack();
                    data.forEach(x => {
                        dispatch(addCustomer(x));
                    });
                } catch (error) {
                    console.log(error.message);
                    setErrorMessage(error.message);
                    errorOCurred = true;
                } finally {
                    if (!errorOCurred) {
                        setLoading(false);
                    }
                }
            };
            fetchData();
        }
    }, []);

    const closeErrorModal = () => { //Cierra el modal en caso de dar click en el botón de cerrar
        setLoading(false);
        setErrorMessage("");
    }

    return (
        <div style={{padding: "30px"}}>
            <h3>Clientes</h3>
            <Link className="customerButton" to="create-customer">
                Registrar cliente<img src="../../icons/agregar-usuario.png"/>
            </Link>
            <br></br>
            {customers.length === 0
                ? <div>No hay clientes</div>
                : (
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                        <TableContainer component={Paper} sx={{ maxHeight: 350, overflowY: "auto"}}>
                            <Table sx={{ minWidth: 700 }} aria-label="customized table">
                                <TableHead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                                    <TableRow>
                                        {headers.length !== 0 ? (headers.map(h => (
                                            <StyledTableCell align="center" key={h}>{h}</StyledTableCell> 
                                        )))
                                        : <p>No hay datos</p>}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                {customers.map(row => (
                                    <StyledTableRow key={row.id}>
                                        <StyledTableCell component="th" scope="row" align="center" key={row.name}>{nameTransform(row.name)}</StyledTableCell>
                                        <StyledTableCell component="th" scope="row" align="center" key={row.email}>{row.email ? row.email : "-"}</StyledTableCell>
                                        <StyledTableCell component="th" scope="row" align="center" key={row.phone}>{row.phone}</StyledTableCell>
                                        <StyledTableCell component="th" scope="row" align="center" key={row.id*0.2}>{row.location ? row.location : "-"}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <Button>
                                                <Link style={{ textDecoration: "none", color: "#1976d2" }} to={`edit/${row.id}`}>Editar</Link>
                                            </Button>
                                        </StyledTableCell>
                                    </StyledTableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </div>
                )
            }
            {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
        </div>
    )
}

export default Customers;