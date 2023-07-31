import { useNavigate, useParams } from "react-router-dom";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Loader from "./Loader";
import { Button, Card, CardContent, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import TextInput from "./TextInput";
import { nameTransform } from "../utils/functions";
import { updateCustomerBack } from "../services/customers.service";
import { updateCustomer } from "../features/customers/customerSlice";


const validate = (values) => {
    const errors = {};
    const emailData = values.email.split(".");

    if (values.name.length < 3 ) {
        errors.name = "El valor debe tener al menos 3 caracteres.";
    } else if (values.name.length > 30) {
        errors.name = "El valor debe tener a lo más 30 caracteres.";
    }
    if (values.phone.length != 12) {
        errors.phone = "El valor deber tener 12 caracteres."
    } 
    
    if (values.location.length < 3 && values.location != "") {
        errors.location = "El valor debe tener al menos 3 caracteres.";
    } else if (values.location.length > 30 && values.location != "") {
        errors.location = "El valor debe tener a lo más 30 caracteres.";
    }

    if (emailData[emailData.length-1] != "cl" && emailData[emailData.length-1] != "com" && emailData[emailData.length-1] != "net" && values.email != "") {
        errors.email = "Correo electrónico inválido.";
    }

    return errors;
}

const EditCustomer = () => {
    const {id} = useParams();
    const [customer, setCustomer] = useLocalStorage("customer","");
    const dispatch = useDispatch();
    const customers = useSelector(state => state.customers);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (customers.length != 0) { //Evalúa la presencia de datos 
            setCustomer(customers.find(x => x.id == id)); //Lo almacena en el localstorage
        }
    }, [id, customers]);

    const handleSubmit = async (values) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            let resp = await updateCustomerBack(id, { name: values.name.trim(), email: values.email, location: values.location, phone: values.phone })
            dispatch(updateCustomer(resp));
            setCustomer(resp);

            navigate(-1); //Para volver a la página anterior
            
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
        
        <div>
            {customer.id == id && (
                <div style={{display: "grid", placeItems: "center", height: "90vh"}}>
                <Card sx={{ maxWidth: 345 }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {nameTransform(customer.name)}
                        </Typography>
                        <Formik 
                            initialValues={{name: nameTransform(customer.name).trim(), email: customer.email ? customer.email : "", phone: customer.phone, location: customer.location ? customer.location : ""}} 
                            validate={validate} 
                            onSubmit={handleSubmit}
                        >
                            <Form>
                                <TextInput name="name" label="Nombre" adornment="" />
                                <br />
                                <TextInput name="email" label="Correo electrónico" adornment="" />
                                <br/>
                                <TextInput name="phone" label="Contacto" adornment="" />
                                <br/>
                                <TextInput name="location" label="Ubicación" adornment="" />
                                <br/>
                                <Button type="submit" variant="outlined" 
                                    >Guardar
                                </Button>
                            </Form>
                            
                        </Formik>
                    </CardContent> 
                </Card>
            </div>
            )}
            {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
            {customer.id == undefined && customers.length === 0 ? alert("Se produjo un error al guardar los datos.") : null}
        </div>
    )
}

export default EditCustomer;