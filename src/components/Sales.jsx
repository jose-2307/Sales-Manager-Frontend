import { useEffect, useState } from "react";
import Loader from "./Loader";
import { getMonthsBack, getSalesBack, getYearsBack } from "../services/customers.service";
import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Backdrop, Box, Button, Fade, FormControl, InputLabel, MenuItem, Modal, Select, Typography } from '@mui/material';
import { dateTransform, formatNumber, nameTransform } from "../utils/functions";
import Pagination from "./Pagination";


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

const headers = ["Nombre", "Ubicación", "Presenta deuda", "Detalle"];

const Sales = () => {
    const [sales, setSales] = useState([]);
    const [years, setYears] = useState([]);
    const [months, setMonths] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [openDetailModal, setOpenDetailModal] = useState(null); //Controla que se abra el modal del deudor asociado
    const [open, setOpen] = useState(false); //Controla el abrir y cerrar del modal
    const [year, setYear] = useState(""); //Controla el año seleccionado
    const [month, setMonth] = useState(""); //Controla el mes seleccionado
    //Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [salesPerPage, setSalesPerPage] = useState(10);

    useEffect(() => {
        setLoading(true);
        let errorOCurred = false;
        const fetchData = async () => {
            try {
                const salesData = await getSalesBack();
                salesData.sort((a,b) => a.name.localeCompare(b.name));
                setSales(salesData);
                const yearsData = await getYearsBack();
                setYears(yearsData);
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
        fetchData();
    }, []);


    const handleYearChange = async (event) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            const monthsData = await getMonthsBack(event.target.value);
            setMonths(monthsData);
            setYear(event.target.value);
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

    const handleMonthChange = async (event) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            const salesData = await getSalesBack(year,event.target.value);
            salesData.sort((a,b) => a.name.localeCompare(b.name));
            setSales(salesData);  
            setMonth(event.target.value);
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

    const closeErrorModal = () => { //Cierra el modal en caso de dar click en el botón de cerrar
        setLoading(false);
        setErrorMessage("");
    }

    //Pagination
    const lastProductIndex = currentPage * salesPerPage;
    const firstProductIndex = lastProductIndex - salesPerPage;
    const currentSales = sales.slice(firstProductIndex, lastProductIndex);

    return (
        <>
            <br></br>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                <FormControl style={{width: "90px", paddingRight: "6px"}} size="small">
                    <InputLabel id="demo-select-small-label" style={{display: "grid", placeItems: "center"}}>Año</InputLabel>
                    <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={year}
                        label="Año"
                        onChange={handleYearChange}
                    >
                        {years.map(y => (
                            <MenuItem key={y} value={y}>{y}</MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {months.length > 0 && (
                    <>
                        <FormControl style={{width: "90px", paddingLeft: "6px"}} size="small">
                            <InputLabel id="demo-select-small-label">Mes</InputLabel>
                            <Select
                                labelId="demo-select-small-label"
                                id="demo-select-small"
                                value={month}
                                label="Mes"
                                onChange={handleMonthChange}
                            >
                                {months.map(m => (
                                    <MenuItem key={m} value={m}>{m}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                    </>
                )}
            </div>
            <br></br>
            {sales.length === 0 
                ? <h3>No hay ventas registradas</h3>
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
                                {currentSales.map(row => (
                                    <StyledTableRow key={row.id}>
                                        <StyledTableCell component="th" scope="row" align="center" key={row.name}>{nameTransform(row.name)}</StyledTableCell>
                                        <StyledTableCell component="th" scope="row" align="center" key={row.location}>{row.location ? row.location : "-"}</StyledTableCell>
                                        {row.purchaseOrders.filter(x => x["paidOut"] == false).length > 0 
                                            ?   <StyledTableCell component="th" scope="row" align="center" key={row.id} style={{color: "red"}}>
                                                    Sí
                                                </StyledTableCell>
                                            :   <StyledTableCell component="th" scope="row" align="center" key={row.id} style={{color: "green"}}>
                                                    No
                                                </StyledTableCell>
                                        }
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
                                                                        <Typography id="transition-modal-description" sx={{ mt: 2, paddingLeft:"8px" }} >
                                                                            {`${p.productName[0].toUpperCase().concat(p.productName.slice(1))} `} {`(${formatNumber(p.weight)} g)`}
                                                                        </Typography>
                                                                        <Typography id="transition-modal-description" sx={{ mt: 2, paddingRight:"8px" }} >{`$ ${formatNumber(parseInt(p.weight) * parseInt(p.priceKilo)/1000)}`}</Typography>
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
                                                                {order.paidOut 
                                                                    ? (
                                                                        <section style={{
                                                                            display: "flex",
                                                                            flexDirection: "row",
                                                                            justifyContent: "space-between",
                                                                        }}>
                                                                            <Typography id="transition-modal-description" sx={{ mt: 2, paddingLeft:"8px" }} key={order.subscriber + 1}>Situación</Typography>
                                                                            <Typography id="transition-modal-description" sx={{ mt: 2, paddingRight:"8px", color: "green" }} key={order.subscriber}>Pagado</Typography>
                                                                        </section>
                                                                    ) 
                                                                    : (
                                                                        <section style={{
                                                                            display: "flex",
                                                                            flexDirection: "row",
                                                                            justifyContent: "space-between",
                                                                        }}>
                                                                            <Typography id="transition-modal-description" sx={{ mt: 2, paddingLeft:"8px" }} key={order.subscriber + 1}>Situación</Typography>
                                                                            <Typography id="transition-modal-description" sx={{ mt: 2, paddingRight:"8px", color: "red" }} key={order.subscriber}>Pendiente de pago</Typography>
                                                                        </section>
                                                                    )
                                                                }
                                                                
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
                    </div>
                )
            }
            <Pagination totalElements={sales.length} elementsPerPage={salesPerPage} setCurrentPage={setCurrentPage} currentPage={currentPage}/>
            {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
        </>
    )
}

export default Sales;