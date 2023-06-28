import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Backdrop, Box, Button, Fade, InputAdornment, Modal, TextField, Typography } from '@mui/material';
import { getDebtorsBack, updateDebtorsBack } from '../services/customers.service';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDebtors, deleteDebtors, updateDebtor } from '../features/debtors/debtorSlice';
import Loader from './Loader';
import { dateTransform, formatNumber } from '../utils/functions';


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
    const debtors = useSelector(state => state.debtors);
    const [formValues, setFormValues] = useState({});
    const [validationError, setValidationError] = useState(false); //Valida el contenido del input
    const [blockButton, setBlockButton] = useState(false); //Bloquea el botón en caso de no ser válido
    const [selectedRows, setSelectedRows] = useState({}); //Controla los checkboxes seleccionados en cada fila para deshabilitar el input correspondiente. Además, se utiliza para visibilizar el botón de guardar 
    const [inputRows, setInputRows] = useState({}); //Permite visibilizar el botón de guardar al ingresar datos 
    const [openDetailModal, setOpenDetailModal] = useState(null); //Controla que se abra el modal del deudor asociado
    const [open, setOpen] = useState(false); //Controla el abrir y cerrar del modal



    useEffect(() => {
        setLoading(true);
        let errorOCurred = false;
        const fetchDebtors = async () => {
            try {
                const data = await getDebtorsBack();
                dispatch(addDebtors(data));
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
        fetchDebtors();
    }, [dispatch]);


    const closeErrorModal = () => { //Cierra el modal en caso de dar click en el botón de cerrar
        setLoading(false);
        setErrorMessage("");
    }


    const handleCheckboxChange = (event, rowId) => {
        const { name, checked } = event.target;

        setFormValues((prevFormValues) => ({
          ...prevFormValues,
          [name]: { ...prevFormValues[name], checked },
        }));

        setSelectedRows(prevSelectedRows => ({
            ...prevSelectedRows,
            [rowId]: checked,
        }));

      }
    
    const handleInputChange = (event, rowId) => {
        const { name, value } = event.target;

        // setInputValue(value);

        const sanitizedValue = Math.max(0, Number(value)); //Convierte a número y asegura que no sea menor o igual a 0
        const hasError = sanitizedValue !== Number(value); //Verifica si se realizó una corrección

        setFormValues((prevFormValues) => ({
            ...prevFormValues,
            [name]: { ...prevFormValues[name], value },
        }));

        setValidationError((prevErrors) => ({
            ...prevErrors,
            [name]: hasError,
        }));

        setInputRows(prevInputRows => ({
            ...prevInputRows,
            [rowId]: value,
        }));
        
        setBlockButton(hasError);
        
    }

    const toFormat = (data) => {
        //Se le da un formato fácil de utilizar
        const format = []; 
        for (let x of data) { 
            const obj = {};
            const key = Object.keys(x)[0];
            const splitKey = key.split("-");
            let isRegistred = false;
            if (format.length !== 0) { //Se comprueba si la fila ya está registrada
                for (let y of format){
                    if (y.id === splitKey[splitKey.length - 1]) {
                        isRegistred = true;
                        // if ("check" in y) break; //No puede haber un subscriber a la vez que un check
                        if ("subscriber" in y) { //Lo que se va a ingresar es un check
                            //Se debe borrar la propiedad de subscriber
                            delete y.subscriber;
                            y[splitKey[0]] = x[key];
                            break;
                        }
                       
                    }
                }
            }
            if (!isRegistred) {
                obj["id"] = splitKey[splitKey.length - 1];
                obj[splitKey[0]] = x[key];
                format.push(obj);
            }
        }
        return format;
    }

    const handleSaveChanges = async () => {
        setLoading(true);
        let errorOCurred = false;
        try {
            const keys = Object.keys(formValues);
            const data = [];
            //Filtro los datos relevantes
            keys.forEach(x => {
                if ("checked" in formValues[x] && formValues[x].checked !== false) {
                    data.push({
                        [x]: formValues[x].checked
                    });
                } else if ("value" in formValues[x] && formValues[x].value !== "") {
                    data.push({
                        [x]: formValues[x].value
                    });
                }
            });

            const format = toFormat(data); //Se le da un formato utilizable a la información
            
            for (let f of format) {
                const debtor = debtors[0].find(x => x.id == f.id);
                let accum = f.subscriber ? f.subscriber : null;
                for (let p of debtor.purchaseOrders) {
                    const fecha = new Date();
                    if ("check" in f) {
                        //Se paga completo
                        console.log("Se paga completo")
                        await updateDebtorsBack(f.id, p.id, { paymentDate: fecha, paidOut: true });
                        dispatch(deleteDebtors(f.id));
                    } else {
                        if (p.orderDebt <= accum) {
                            console.log("Queda pagada la orden de compra")
                            await updateDebtorsBack(f.id, p.id, { paymentDate: fecha, paidOut: true });
                            dispatch(updateDebtor(f.id, p.id));
                            accum -= p.orderDebt;
                        } else {
                            console.log("Queda como abono");
                            await updateDebtorsBack(f.id, p.id, { subscriber: accum });
                            //dispatch();
                            accum = 0;
                        }
                        if (accum === 0) {
                            console.log("Cuenta pagada")
                            break;
                        }
                    }
                }
            }


            console.log(format)
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

    return (
        <div style={{padding: "30px"}}>
            <h3>Deudores</h3>
            <br></br>
            {debtors.length === 0 || debtors[0].length === 0 
                ? <h3>No hay deudores</h3>
                : (
                    <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
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
                                {debtors[0].map(row => (
                                    <StyledTableRow key={row.id}>
                                        <StyledTableCell component="th" scope="row" align="center" key={row.name}>{row.name}</StyledTableCell>
                                        <StyledTableCell component="th" scope="row" align="center" key={row.location}>{row.location}</StyledTableCell>
                                        <StyledTableCell component="th" scope="row" align="center" key={row.debt}>{formatNumber(row.debt)}</StyledTableCell>
                                        <StyledTableCell align="center">
                                            <input
                                                style={{width: "16px", height: "16px"}}
                                                type="checkbox"
                                                name={`check-${row.id}`}
                                                checked={formValues[`check-${row.id}`]?.checked || false}
                                                // onChange={handleCheckboxChange}
                                                onChange={(e) => handleCheckboxChange(e, row.id)}
                                            />
                                        </StyledTableCell>
                                        <StyledTableCell align="center">

                                            <TextField
                                                error={validationError[`subscriber-${row.id}`] ? true : false}
                                                type="number"
                                                sx={{ m: 0.2, width: "20ch" }}
                                                name={`subscriber-${row.id}`}
                                                InputProps={{
                                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                                }}
                                                disabled={selectedRows[row.id]}
                                                value={selectedRows[row.id] ? "" : formValues[`subscriber-${row.id}`]?.value || ""}
                                                onChange={(e) => handleInputChange(e, row.id)}
                                                helperText={validationError[`subscriber-${row.id}`] && <p>Error: El valor debe ser mayor que 0.</p>}
                                            />
                                        </StyledTableCell>
                                        
                                        <StyledTableCell align="center">
                                            <Button onClick={() => {setOpenDetailModal(row.id); setOpen(true)}}>
                                                {/* <Link to={`/details/${row.id}`} target="_blank">
                                                    Ver detalle
                                                </Link> */}
                                                Ver detalle
                                            </Button>
                                        </StyledTableCell>
                                        {console.log(row)}
                                        {openDetailModal === row.id && ( // Controla que el modal a abrir sea el del producto asociado según el botón cliqueado
                                            <Modal
                                                aria-labelledby="transition-modal-title"
                                                aria-describedby="transition-modal-description"
                                                open={open} 
                                                onClose={() => {setOpenDetailModal(null); setOpen(false)}}
                                                closeAfterTransition
                                                slots={{ backdrop: Backdrop }}
                                                slotProps={{
                                                backdrop: {
                                                    timeout: 500,
                                                },
                                                }}
                                            >
                                                <Fade in={open}>
                                                    <Box sx={{
                                                        position: "absolute",
                                                        top: '50%',
                                                        left: '50%',
                                                        transform: 'translate(-50%, -50%)',
                                                        width: 400,
                                                        bgcolor: 'background.paper',
                                                        border: '2px solid #000',
                                                        boxShadow: 24,
                                                        p: 6,}}
                                                    >   
                                                        {row.purchaseOrders.map(order => (
                                                            <>
                                                                <Typography id="transition-modal-title" variant="h6" component="h2">
                                                                    {`Fecha de venta: ${dateTransform(order.saleDate)}`}
                                                                </Typography>
                                                                <Typography id="transition-modal-description" sx={{ mt: 2 }}>{`Monto total: $ ${formatNumber(order.orderDebt)}`}</Typography>
                                                                <Typography id="transition-modal-description" variant="h6" component="h2">{`Monto abonado: $ ${formatNumber(order.subscriber)}`}</Typography>

                                                                {order.purchaseOrderProducts.map(p => (
                                                                    <>
                                                                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>{`Producto: ${p.productName[0].toUpperCase().concat(p.productName.slice(1))}`}</Typography>
                                                                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>{`Cantidad: ${formatNumber(p.weight)}`}</Typography>
                                                                        <Typography id="transition-modal-description" sx={{ mt: 2 }}>{`Precio: $ ${formatNumber(parseInt(p.weight) * parseInt(p.priceKilo)/1000)}`}</Typography>
                                                                    </>
                                                                ))}
                                                                
                                                            </>
                                                            
                                                        ))}
                                                        
                                                        <br></br>
                                                        <Button variant="contained" style={{marginRight: "12%", marginLeft: "16%", backgroundColor: "grey"}} onClick={() => setOpen(false)}>Cerrar</Button>
                                                    </Box>
                                                </Fade>
                                            </Modal>
                                        )}
                                    </StyledTableRow>
                                ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                        
                        {
                            Object.values(inputRows).some((value) => value !== "") || Object.values(selectedRows).some((selected) => selected) //La segunda condición verifica si al menos 1 de los checkboxes han sido seleccionados
                            ? (
                             
                                blockButton
                                ? (
                                    <Button variant="contained" color="primary" disabled type="submit" onClick={handleSaveChanges} style={{margin:"20px"}}>
                                        Guardar
                                    </Button>
                                )
                                : (
                                    <Button variant="contained" color="primary" type="submit" onClick={handleSaveChanges} style={{margin:"20px"}}>
                                        Guardar
                                    </Button>
                                )
                            )
                            : null
                        }  
                    </div>
                )
            }
            
            {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
        </div>
        
    )
}

export default Home;