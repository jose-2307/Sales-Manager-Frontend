import { Avatar, Box, Button, CssBaseline, Grid, Paper, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import TextInput from "./TextInput";
import Notification from "./Notification";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { singUpBack } from "../services/auth.service";
import Loader from "./Loader";

const validate = (values) => {
    const errors = {};

    const emailData = values.email.split(".");

    if (values.name.length < 3) {
        errors.name = "El nombre debe tener a lo menos 3 caracteres.";
    } else if (values.name.length > 15){
        errors.name = "El nombre debe tener a lo más 15 caracteres.";
    }

    if (values.lastName.length < 3) {
        errors.lastName = "El apellido debe tener a lo menos 3 caracteres.";
    } else if (values.lastName.length > 15){
        errors.lastName = "El apellido debe tener a lo más 15 caracteres.";
    }

    if (emailData[emailData.length-1] != "cl" && emailData[emailData.length-1] != "com" && emailData[emailData.length-1] != "net") {
        errors.email = "Correo electrónico inválido.";
    }

    if (values.password.length < 8 || values.password.length > 12) {
        errors.password = "La contraseña debe tener entre 8 y 12 caracteres.";
    }
    return errors;
}

const SignUp = () => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setLoading(true);
        try {
            const singUp = await singUpBack({name: values.name, lastName: values.lastName, email: values.email, password: values.password});
            console.log(singUp);
            navigate("/login");

        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.message);
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="container">
            <Notification message={errorMessage}/>
            <Grid container component="main" sx={{ height: "100vh" }}>
                <CssBaseline />
                <Grid
                item
                xs={false}
                sm={4}
                md={7}
                sx={{
                    backgroundImage: "url(../../categories/frutos-secos.jpg)",
                    backgroundRepeat: "no-repeat",
                    backgroundColor: (t) =>
                    t.palette.mode === "light" ? t.palette.grey[50] : t.palette.grey[900],
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                        my: 8,
                        mx: 4,
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        }}
                    >
                        <Avatar sx={{ m: 1 }}>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                        Crear cuenta
                        </Typography>
                        <Formik  initialValues={{name: "", lastName: "", email: "", password: ""}} 
                            validate={validate} 
                            onSubmit={handleSubmit}
                        >
                            <Form>
                                <TextInput name="name" required label="Nombre" adornment=" " type="text" id="name" dimesions={{ m: 1, width: "66vh" }}></TextInput>
                                <br></br>
                                <TextInput name="lastName" required label="Apellido" adornment=" " type="text" id="lastName" dimesions={{ m: 1, width: "66vh" }}></TextInput>
                                <br></br>
                                <TextInput name="email" required label="Correo electrónico" adornment=" " type="email" id="outlined-required" dimesions={{ m: 1, width: "66vh" }} placeholder="Ej: usuario@mail.com"></TextInput>
                                <br></br>
                                <TextInput name="password" required label="Contraseña" adornment=" " type="password" id="password" dimesions={{ m: 1, width: "66vh" }} autoComplete="current-password"></TextInput>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Crear cuenta
                                </Button>
                                <Button
                                    onClick={() => navigate("/login")}
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    
                                >
                                    Regresar
                                </Button>
                            </Form>
                        </Formik>
                    {loading && (<Loader></Loader>)}                        
                    {/* <Copyright sx={{ mt: 5 }} /> */}
                    </Box>
                </Grid>
            </Grid>
        </div>
    )
}

export default SignUp;