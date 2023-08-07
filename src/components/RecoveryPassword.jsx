import { Avatar, Box, Button, CssBaseline, Grid, Paper, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import TextInput from "./TextInput";
import { useState } from "react";
import { recoveryPasswordBack } from "../services/auth.service";
import Loader from "./Loader";
import { useNavigate } from "react-router-dom";


const RecoveryPassword = () => {

    const [errorMessage, setErrorMessage] = useState("");
    const [email, setEmail] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            const recovery = await recoveryPasswordBack(values.email);
            console.log(recovery);
            setEmail(values.email);

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
                    backgroundImage: "url(http://res.cloudinary.com/dmevmh3ch/image/upload/v1691380304/rszej46nd6ncvd8dnycf.jpg)",
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
                        Recuperar contraseña
                        </Typography>
                        <br>
                        </br>

                        {!email 
                        ? (
                            <> 
                                <Typography gutterBottom variant="body1" sx={{mx: 4, paddingLeft: 0.2, color: "black" }} >
                                Escribe tu correo electrónico y te enviaremos las instrucciones para recuperar tu contraseña.
                                </Typography>
                                <br></br>
                                <Formik  initialValues={{email: ""}} 
                                    onSubmit={handleSubmit}
                                >
                                    <Form>
                                        <TextInput name="email" required label="Correo electrónico"  adornment=" " type="email" id="outlined-required" dimesions={{ m: 1, width: "66vh" }} placeholder="Ej: usuario@mail.com"></TextInput>
                                        <br></br>
                                        <div style={{display:"flex", flexDirection: "column", alignItems: "center"}}>
                                            
                                            <Button
                                                type="submit"
                                                fullWidth
                                                variant="contained"
                                                sx={{ mt: 3, mb: 2 }}
                                            >
                                                Recuperar contraseña
                                            </Button>
                                            <Button
                                                onClick={() => navigate("/login")}
                                                variant="contained"
                                                sx={{ mt: 3, mb: 2 }}
                                            >
                                                Volver
                                            </Button>
                                        </div>
                                    </Form>
                                </Formik>
                            </>
                            )
                        : (
                            <>
                                <Typography gutterBottom variant="body1" sx={{mx: 4, paddingLeft: 0.2, color: "black" }} >
                                Se ha enviado un correo electrónico a {email}. Por favor, revisa tu bandeja de entrada y sigue las instrucciones para recuperar tu contraseña.
                                </Typography>
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

export default RecoveryPassword;