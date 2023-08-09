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
import Loader from './Loader';
import { dateTransform, formatNumber, nameTransform } from '../utils/functions';
import { Link } from 'react-router-dom';
import "./styles/NewPurchaseOrder.css";
import Sales from './Sales';
import Pagination from './Pagination';


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
    const [debtors, setDebtors] = useState([]);
    const [formValues, setFormValues] = useState({});
    const [validationError, setValidationError] = useState(false); //Valida el contenido del input
    const [blockButton, setBlockButton] = useState(false); //Bloquea el botón en caso de no ser válido
    const [selectedRows, setSelectedRows] = useState({}); //Controla los checkboxes seleccionados en cada fila para deshabilitar el input correspondiente. Además, se utiliza para visibilizar el botón de guardar 
    const [inputRows, setInputRows] = useState({}); //Permite visibilizar el botón de guardar al ingresar datos 
    const [openDetailModal, setOpenDetailModal] = useState(null); //Controla que se abra el modal del deudor asociado
    const [open, setOpen] = useState(false); //Controla el abrir y cerrar del modal
    const [clickDebtorsButton, setclickDebtorsButton] = useState(true); //Controla la tabla que se muestra
    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [debtorsPerPage, setDebtorsPerPage] = useState(10);


    useEffect(() => {
        setLoading(true);
        let errorOCurred = false;
        const fetchDebtors = async () => {
            try {
                const data = await getDebtorsBack();
                data.sort((a, b) => { //Ordena los deudores 
                    const aFirstOrderId = a.purchaseOrders.length > 0 ? a.purchaseOrders[0].id : Number.MAX_SAFE_INTEGER;
                    const bFirstOrderId = b.purchaseOrders.length > 0 ? b.purchaseOrders[0].id : Number.MAX_SAFE_INTEGER;
                    return bFirstOrderId - aFirstOrderId;
                });
                for (let element of data) {
                    element.name = nameTransform(element.name);
                    element.purchaseOrders.sort((a,b) => a.id - b.id); //Ordena las órdenes de compra según su id
                }
                setDebtors(data);
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
    }, [setDebtors]);

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
    
    const handleInputChange = (event, rowId, debt) => {
        const { name, value } = event.target;
        let hasError = false;

        if (parseInt(value) <= 0 || parseInt(value) > parseInt(debt)) { //Valida el dato
            hasError = true;
        }

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
                const debtor = debtors.find(x => x.id == f.id);
                let accum = f.subscriber ? f.subscriber : null;
                for (let p of debtor.purchaseOrders) {
                    const fecha = new Date();
                    if ("check" in f) { //Se borra el deudor
                        //Se paga completo
                        await updateDebtorsBack(f.id, p.id, { paymentDate: fecha, paidOut: true });
                        setDebtors(prevDebtors => prevDebtors.filter(debtor => debtor.id != f.id));
                    } else {
                        if (p.orderDebt <= accum) { //Se borra la orden de compra del deudor
                            await updateDebtorsBack(f.id, p.id, { paymentDate: fecha, paidOut: true });
                            let orderDebt;
                            const updateDebtors = debtors.map(debtor => {
                                if (debtor.id == f.id) {
                                    debtor.purchaseOrders.forEach(order => {
                                        if (order.id == p.id) orderDebt = p.orderDebt;
                                    });
                                    const updatedPurchaseOrders = debtor.purchaseOrders.filter(
                                        order => order.id != p.id
                                    );
                                    // return { ...debtor, debt: parseInt(debtor.debt) - parseInt(orderDebt), purchaseOrders: updatedPurchaseOrders };
                                    return { ...debtor, debt: parseInt(debtor.debt) - parseInt(orderDebt), purchaseOrders: updatedPurchaseOrders };
                                }
                                return debtor;
                            });
                            setDebtors(updateDebtors);
                            accum -= p.orderDebt;
                        } else { //Se actualiza el subscriber de la orden de compra del deudor
                            
                            await updateDebtorsBack(f.id, p.id, { subscriber: accum });
                            const updateDebtors = debtors.map(debtor => {
                                if (debtor.id == f.id) {
                                    const updatedPurchaseOrders = debtor.purchaseOrders.map(order => {
                                        if (order.id == p.id) {
                                          return { ...order, 
                                            orderDebt: parseInt(order.orderDebt) - parseInt(accum), 
                                            subscriber: parseInt(order.subscriber) + parseInt(accum) 
                                            };
                                        }
                                        return order;
                                    });
                                    return { ...debtor, debt: parseInt(debtor.debt) - parseInt(accum), purchaseOrders: updatedPurchaseOrders };
                                }
                                return debtor;
                            });
                            setDebtors(updateDebtors);
                            accum = 0;
                        }
                        if (accum === 0) {
                            break;
                        }
                    }
                }
            }
            //Se limpia el formulario
            setFormValues({});
            setSelectedRows({});
            setInputRows({});
            location.reload();
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


    //Pagination
    const lastProductIndex = currentPage * debtorsPerPage;
    const firstProductIndex = lastProductIndex - debtorsPerPage;
    const currentDebtors = debtors.slice(firstProductIndex, lastProductIndex);

    return (
        <div style={{padding: "30px"}}>
            {clickDebtorsButton
                ? (
                    <>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row", borderRadius: "0.75rem", backgroundColor: "#000000", width: "230px", height: "42px"}}>
                                <div style={{ backgroundColor: "rgba(224, 224, 224, 1)", borderRadius: "0.5rem", width: "112px", display: "flex", justifyContent: "center" }}>
                                    <Button style={{ color: "black" }} disabled>Deudores</Button>
                                </div>
                                <div style={{ backgroundColor: "#000000", borderRadius: "0.5rem", width: "112px", display: "flex", justifyContent: "center" }}>
                                    <Button style={{ color: "#fff" }} onClick={() => setclickDebtorsButton(!clickDebtorsButton)}>Todos</Button>
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <Link className="purchaseOrderButton" to="/create-purchase-order">
                            Registrar venta<img src="../../icons/registrar.png"/>
                        </Link>
                        <br></br>
                        {debtors.length === 0 
                            ? <h3>No hay deudores</h3>
                            : (
                                <div style={{display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
                                    <TableContainer component={Paper} sx={{ maxHeight: 400, overflowY: "auto"}}>
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
                                            {currentDebtors.map(row => (
                                                <StyledTableRow key={row.id}>
                                                    <StyledTableCell component="th" scope="row" align="center" key={row.name}>{row.name}</StyledTableCell>
                                                    <StyledTableCell component="th" scope="row" align="center" key={row.location}>{row.location ? row.location : "-"}</StyledTableCell>
                                                    <StyledTableCell component="th" scope="row" align="center" key={row.debt}>{`$ ${formatNumber(row.debt)}`}</StyledTableCell>
                                                    <StyledTableCell align="center">
                                                        <input
                                                            style={{width: "16px", height: "16px", cursor: "pointer"}}
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
                                                            onChange={(e) => handleInputChange(e, row.id, row.debt)}
                                                            helperText={validationError[`subscriber-${row.id}`] && <p>Error: El valor debe ser mayor que 0 y menor o igual a la deuda.</p>}
                                                        />
                                                    </StyledTableCell>
                                                    
                                                    <StyledTableCell align="center">
                                                        <Button onClick={() => {setOpenDetailModal(row.id); setOpen(true)}}>
                                                            Ver detalle
                                                        </Button>
                                                    </StyledTableCell>
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
                                                                    p: 4,
                                                                    overflowY: "auto",
                                                                    height: 400,
                                                                    
                                                                }}>

                                                                    {row.purchaseOrders.map((order, i) => (
                                                                        <>  
                                                                            <Typography id="transition-modal-title" style={{color: "grey", fontSize: "14px", paddingBottom: "4px", paddingLeft:"8px"}} key={order.id *0.25}>
                                                                                Fecha
                                                                            </Typography>
                                                                            <Typography id="transition-modal-title" style={{paddingBottom: "6px", paddingLeft:"8px"}} key={order.id}>
                                                                                {dateTransform(order.saleDate)}
                                                                            </Typography>
                                                                            {order.purchaseOrderProducts.map(p => (
                                                                                <section key={p.productName} style={{
                                                                                    display: "flex",
                                                                                    flexDirection: "row",
                                                                                    justifyContent: "space-between",
                                                                                    backgroundColor: "#f2f2f2" 
                                                                                    
                                                                                }}>
                                                                                    <Typography id="transition-modal-description" sx={{ mt: 2, paddingLeft:"8px" }} key={Math.random()}>
                                                                                        {`${p.productName[0].toUpperCase().concat(p.productName.slice(1))} `} {`(${formatNumber(p.weight)} g)`}
                                                                                    </Typography>
                                                                                    <Typography id="transition-modal-description" sx={{ mt: 2, paddingRight:"8px" }}key={Math.random()} >{`$ ${formatNumber(parseInt(p.weight) * parseInt(p.priceKilo)/1000)}`}</Typography>
                                                                                </section>
                                                                            ))}
                                                                            {order.subscriber != 0 && (
                                                                                <section key={order.subscriber} style={{
                                                                                    display: "flex",
                                                                                    flexDirection: "row",
                                                                                    justifyContent: "space-between",
                                                                                    backgroundColor: "#f2f2f2",
                                                                                    paddingBottom: "14px"
                                                                                }}>
                                                                                    <Typography id="transition-modal-description" sx={{ mt: 2, paddingLeft:"8px" }} key={order.subscriber + 1}>Abono</Typography>
                                                                                    <Typography id="transition-modal-description" sx={{ mt: 2, paddingRight:"8px" }} key={order.subscriber}>{`$ ${formatNumber(order.subscriber)}`}</Typography>
                                                                                </section>
                                                                            )}
                                                                            <section key={Math.random()} style={{
                                                                                display: "flex",
                                                                                flexDirection: "row",
                                                                                justifyContent: "space-between",
                                                                            }}>
                                                                                <Typography id="transition-modal-description" sx={{ mt: 2, paddingLeft:"8px"  }} key={order.orderDebt + 1}><b>Total</b></Typography>
                                                                                <Typography id="transition-modal-description" sx={{ mt: 2, paddingRight:"8px" }} key={order.orderDebt}><b>{`$ ${formatNumber(order.orderDebt)}`}</b></Typography>
                                                                            </section>
                                                                            <br></br>
                                                                            {i != row.purchaseOrders.length - 1 && (
                                                                                <>
                                                                                    <div style={{color: "#bfb8b8", fontSize: "20px"}} >- - - - - - - - - - - - - - - - - - - - - - - - - - - -</div>
                                                                                    <br></br>
                                                                                </>
                                                                            )}
                                                                        </>
                                                                    ))}
                                                                    <br></br>
                                                                    <Button variant="contained" style={{position: "absolute", right: "170px"}} onClick={() => setOpen(false)}>Cerrar</Button>
                                                                    <br></br>
                                                                    
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
                        <Pagination totalElements={debtors.length} elementsPerPage={debtorsPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
                    </>
                )
                : (
                    <>
                        <div style={{display: "flex", justifyContent: "center"}}>
                            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "row", borderRadius: "0.75rem", backgroundColor: "#000000", width: "230px", height: "42px"}}>
                                <div style={{ backgroundColor: "#000000", borderRadius: "0.5rem", width: "112px", display: "flex", justifyContent: "center" }}>
                                    <Button style={{ color: "#fff" }} onClick={() => setclickDebtorsButton(!clickDebtorsButton)}>Deudores</Button>
                                </div>
                                <div style={{ backgroundColor: "rgba(224, 224, 224, 1)", borderRadius: "0.5rem", width: "112px", display: "flex", justifyContent: "center" }}>
                                    <Button style={{ color: "black" }} disabled>Todos</Button>
                                </div>
                            </div>
                        </div>
                        <br></br>
                        <Sales />

                    </>
                ) 
            } 
            
            {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
        </div>
        
    )
}

export default Home;