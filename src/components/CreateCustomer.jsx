import { Button, Card, CardContent, Typography } from "@mui/material";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";
import TextInput from "./TextInput";
import { Formik, Form } from "formik";
import { useState } from "react";
import { postCustomerBack } from "../services/customers.service";
import { useDispatch } from "react-redux";
import { addCustomer } from "../features/customers/customerSlice";
import { useLocalStorage } from "../hooks/useLocalStorage";

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

const CreateCustomer = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [customer, setCustomer] = useLocalStorage("customer","");
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleSubmit = async (values) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            const resp = await postCustomerBack({ name: values.name.trim(), email: values.email, location: values.location, phone: values.phone });        
            dispatch(addCustomer(resp));
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
        <>          
            <div style={{display: "grid", placeItems: "center", height: "90vh"}}>
                <Card sx={{ maxWidth: 345 }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Crear nuevo cliente
                        </Typography>
                        <Formik 
                            initialValues={{name: "", phone: "", email: "", location: ""}} 
                            validate={validate} 
                            onSubmit={handleSubmit}
                        >
                            <Form>
                                <TextInput name="name" label="Nombre" adornment=" " type="text" required />
                                <TextInput name="phone" label="Contacto" adornment=" " type="text" required />
                                <TextInput name="email" label="Correo electrónico" adornment=" "  type="text" />
                                <TextInput name="location" label="Ubicación" adornment=" "  type="text" />

                                <br></br>
                                <br/>
                                <Button type="submit" variant="outlined" 
                                    >Guardar
                                </Button>
                            </Form>
                        </Formik>
                    </CardContent> 
                </Card>
                {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
            </div>
        </>
    )
}

export default CreateCustomer;