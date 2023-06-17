import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { getRebtors } from '../services/customers.service';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addReborts } from '../features/reborts/rebortSlice';
import Loader from './Loader';

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

const headers = ["Nombre", "Ubicación", "Deuda", "Confirmación de pago", "Abono", "Detalle"];


const Home = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const dispatch = useDispatch();
    const reborts = useSelector(state => state.reborts);

    useEffect(() => {
        setLoading(true);
        let errorOCurred = false;
        const fetchReborts = async () => {
            try {
                const data = await getRebtors();
                // console.log(data);
                dispatch(addReborts(data));
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
        fetchReborts();
    }, [dispatch]);


    const closeErrorModal = () => { //Cierra el modal en caso de dar click en el botón de cerrar
        setLoading(false);
        setErrorMessage("");
    }


    return (
        <div style={{padding: "30px"}}>
            <h3>Deudores</h3>
            <br></br>
            {reborts.length === 0 
                ? <h3>No hay deudores</h3>
                : (
                    <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 700 }} aria-label="customized table">
                            <TableHead>
                            <TableRow>
                                {headers.length !== 0 ? (headers.map(h => (
                                    <StyledTableCell align="center" key={h}>{h}</StyledTableCell> 
                                )))
                                : <p>No hay datos</p>}
                            </TableRow>
                            </TableHead>
                            <TableBody>
                            {reborts[0].map(row => (
                                <StyledTableRow key={row.id}>
                                    <StyledTableCell component="th" scope="row" align="center" key={row.name}>{row.name}</StyledTableCell>
                                    <StyledTableCell component="th" scope="row" align="center" key={row.location}>{row.location}</StyledTableCell>
                                    <StyledTableCell component="th" scope="row" align="center" key={row.debt}>{row.debt}</StyledTableCell>
                                    <StyledTableCell align="center">
                                        <input type='checkbox' />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <TextField id="outlined-basic" label="Abono" variant="outlined" />
                                    </StyledTableCell>
                                    <StyledTableCell align="center">
                                        <Button>
                                            <Link to={`/details/${row.id}`}>
                                                Ver detalle
                                            </Link>
                                        </Button>
                                    </StyledTableCell>
                                </StyledTableRow>
                            ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )
            }
            
            {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
        </div>
        
    )
}

export default Home;