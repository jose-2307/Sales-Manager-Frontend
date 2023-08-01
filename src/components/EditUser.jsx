import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";
import { Avatar, Button, Card, CardContent, Typography } from "@mui/material";
import TextInput from "./TextInput";
import { Formik, Form } from "formik";
import { getUserBack, updateUserBack } from "../services/user.service";


const validate = (values) => {
    const errors = {};
    const emailData = values.email.split(".");

    if (emailData[emailData.length-1] != "cl" && emailData[emailData.length-1] != "com" && emailData[emailData.length-1] != "net" && values.email != "") {
        errors.email = "Correo electrónico inválido.";
    }
    if (values.password && values.password.length < 8) {
        errors.password = "La contraseña debe tener al menos 8 caracteres.";
    } else if (values.password && values.password.length > 12) {
        errors.password = "La contraseña debe tener a lo más 12 caracteres.";
    }
    if (values.password && !values.confirmPassword) {
        errors.confirmPassword = "Campo requerido.";
    } else if (!values.password && values.confirmPassword) {
        errors.password = "Campo requerido.";
    } else if (values.password && values.confirmPassword) {
        if (values.password !== values.confirmPassword) {
            errors.confirmPassword = "Las contraseñas ingresadas no coinciden.";
        }
    }

    return errors;
}

const EditUser = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const [user, setUser] = useState({});

    useEffect(() => {
        setLoading(true);
        let errorOCurred = false;
        const fetchData = async () => {
            try {
                const user = await getUserBack();
                setUser(user);
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

    const handleSubmit = async (values) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            if (values.email != user.email) { //Cambio de email
                await updateUserBack({email: values.email});
            }
            if (values.password != "") {
                await updateUserBack({password: values.password});
            }
            
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
            {user && (
                <div style={{display: "grid", placeItems: "center", height: "90vh"}}>
                    <Card sx={{ maxWidth: 345 }}>
                        <CardContent>
                            <Avatar sx={{ m: 1, bgcolor: "primary.main", left: "100px" }}>
                            </Avatar>
                            <br></br>
                            <Typography gutterBottom variant="h5" component="div">
                                {user.email}
                            </Typography>
                            <Formik 
                                initialValues={{email: user.email || "", password: "", confirmPassword: ""}} 
                                validate={validate} 
                                onSubmit={handleSubmit}
                                enableReinitialize={true} //Vuelve a renderizar en caso de haber cambiado
                            >
                                <Form>
                                    {/* <TextInput name="name" label="Nombre" adornment="" type="text"/>
                                    <br /> */}
                                    <TextInput name="email" label="Correo electrónico" adornment="" type="text" />
                                    <br/>
                                    <TextInput name="password" label="Nueva contraseña" adornment="" type="password" />
                                    <br/>
                                    <TextInput name="confirmPassword" label="Confirmar contraseña" adornment="" type="password"/>
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
        </div>
    )
}

export default EditUser;