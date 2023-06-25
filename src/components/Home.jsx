import { styled } from '@mui/material/styles';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { Button, InputAdornment, TextField } from '@mui/material';
import { Link } from 'react-router-dom';
import { getRebtors, updateRebtors } from '../services/customers.service';
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
    const [formValues, setFormValues] = useState({});
    const [validationError, setValidationError] = useState(false); //Valida el contenido del input
    const [blockButton, setBlockButton] = useState(false); //Bloquea el botón en caso de no ser válido
    const [selectedRows, setSelectedRows] = useState({}); //Controla los checkboxes seleccionados en cada fila para deshabilitar el input correspondiente. Además, se utiliza para visibilizar el botón de guardar 
    const [inputRows, setInputRows] = useState({}); //Permite visibilizar el botón de guardar al ingresar datos 


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
    console.log(reborts)


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
            
            // for (let x of format) {
            //     await updateRebtors(x.id,);
            // }


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
            {reborts.length === 0 
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
                                {reborts[0].map(row => (
                                    <StyledTableRow key={row.id}>
                                        <StyledTableCell component="th" scope="row" align="center" key={row.name}>{row.name}</StyledTableCell>
                                        <StyledTableCell component="th" scope="row" align="center" key={row.location}>{row.location}</StyledTableCell>
                                        <StyledTableCell component="th" scope="row" align="center" key={row.debt}>{row.debt}</StyledTableCell>
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