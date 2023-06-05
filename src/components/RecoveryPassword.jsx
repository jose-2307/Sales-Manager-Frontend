import { Avatar, Box, Button, CssBaseline, Grid, Paper, Typography } from "@mui/material";
import { Form, Formik } from "formik";
import TextInput from "./TextInput";
import Notification from "./Notification";
import { useState } from "react";
import { recoveryPasswordBack } from "../services/auth.service";


const RecoveryPassword = () => {

    const [errorMessage, setErrorMessage] = useState(null);
    const [email, setEmail] = useState(null);
    // const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            const recovery = await recoveryPasswordBack(values.email);
            console.log(recovery);
            setEmail(values.email);

            // navigate("/login");

        } catch (error) {
            console.log(error.message);
            setErrorMessage(error.message);
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
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
                                        <Button
                                            type="submit"
                                            fullWidth
                                            variant="contained"
                                            sx={{ mt: 3, mb: 2 }}
                                        >
                                            Recuperar contraseña
                                        </Button>
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
                        
                    {/* <Copyright sx={{ mt: 5 }} /> */}
                    </Box>
                </Grid>
            </Grid>
        </div>
    )
}

export default RecoveryPassword;