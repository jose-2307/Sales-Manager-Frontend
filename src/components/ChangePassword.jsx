import { Avatar, Box, Button, CssBaseline, Grid, Paper, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import TextInput from "./TextInput";
import { useState } from "react";
import { changePasswordBack } from "../services/auth.service";
import { useQuery }from "../hooks/useQuery";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

const validate = (values) => {
    const errors = {};

    if (values.password.length < 8 || values.password.length > 12) {
        errors.password = "La contraseña debe tener entre 8 y 12 caracteres.";
    }

    if (values.repeatPassword !== values.password) {
        errors.repeatPassword = "Las contraseñas deben ser iguales.";
    }

    return errors;
}


const ChangePassword = () => {
    const query = useQuery(); //Para obtener los query params.
    const [errorMessage, setErrorMessage] = useState("");
    const [recovery, setRecovery] = useState(false);
    const [loading, setLoading] = useState(false);
    const navegate = useNavigate();
    

    const handleSubmit = async (values) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            const token = query.get("token");
            await changePasswordBack(token, values.password);
            setRecovery(true);

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
        <div className="container">
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
                        <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
                        </Avatar>
                        <Typography component="h1" variant="h5">
                        Restablecer contraseña
                        </Typography>
                        <br></br>
                        { !recovery 
                        ? (
                            <>
                                <Formik  initialValues={{password: "", repeatPassword: ""}} 
                                    validate={validate} 
                                    onSubmit={handleSubmit}
                                >
                                    <Form>
                                        <TextInput name="password" required label="Nueva contraseña" adornment=" " type="password" id="password" dimesions={{ m: 1, width: "66vh" }} autoComplete="current-password"></TextInput>
                                        <br></br>
                                        <TextInput name="repeatPassword" required label="Repita la nueva contraseña" adornment=" " type="password" id="repeatPassword" dimesions={{ m: 1, width: "66vh" }} autoComplete="current-password"></TextInput>
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                        >
                                            Restablecer contraseña
                                        </Button>
                                    </Form>
                                </Formik>
                            </>
                        )
                        : (
                            <>
                                <Typography gutterBottom variant="body1" sx={{mx: 4, color: "black" }} >
                                ¡Tu contraseña ha sido restablecida con éxito!
                                </Typography>
                                <br></br>
                                <Typography gutterBottom variant="body1" sx={{mx: 4, color: "black" }} >
                                Inicia sesión con tu nueva contraseña para acceder a tu cuenta.
                                </Typography>
                                <Button
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                    onClick={() => navegate("/login")}
                                >
                                    Iniciar sesión
                                </Button>
                            </>
                        )
                        }
                    {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}
                       
                    {/* <Copyright sx={{ mt: 5 }} /> */}
                    </Box>
                </Grid>
            </Grid>
        </div>
    )
}

export default ChangePassword;