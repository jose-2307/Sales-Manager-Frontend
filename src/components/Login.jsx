import { Formik, Form } from "formik";
import { Avatar, Box, Button, CssBaseline, Grid, Paper, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "./TextInput";
import { loginBack } from "../services/auth.service";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { addUser } from "../features/users/userSlice";
import Cookies from "universal-cookie";
import Loader from "./Loader";


const validate = (values) => {
    const errors = {};

    if (values.password.length < 8 || values.password.length > 12) {
        errors.password = "La contraseña debe tener entre 8 y 12 caracteres.";
    }
    return errors;
}
const Login = () => {
    const [errorMessage, setErrorMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            const login = await loginBack({email: values.email, password: values.password});
            dispatch(addUser(login.user));
            //cookies
            const cookies = new Cookies();
            cookies.set("accessToken", login.accessToken, { path: "/" });
            cookies.set("refreshToken", login.refreshToken, { path: "/" });
            
            setLoading(false);
            navigate("/");
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
                >

                </Grid>
                
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
                    <Avatar sx={{ m: 1, bgcolor: "primary.main" }}>
                    </Avatar>
                    <Typography component="h1" variant="h5">
                    Iniciar sersión
                    </Typography>
                    <Formik  initialValues={{email: "", password: ""}} 
                        validate={validate} 
                        onSubmit={handleSubmit}
                    >
                        <Form>
                            <TextInput name="email" required label="Correo electrónico" adornment=" " type="email" id="outlined-required" dimesions={{ m: 1, width: "66vh" }}></TextInput>
                            <br></br>
                            <TextInput name="password" required label="Contraseña" adornment=" " type="password" id="password" dimesions={{ m: 1, width: "66vh" }} autoComplete="current-password"></TextInput>
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Iniciar sesión
                            </Button>
                        </Form>
                    </Formik>
                    <Grid container style={{display: "flex", justifyContent: "space-between" }}>
                        <div style={{paddingLeft: "6%"}}>
                            <Link to="/recovery-password" variant="body2">
                                Recuperar contraseña
                            </Link>
                        </div>
                        <div style={{paddingRight: "6%"}}>
                            <Link to="/sign-up" variant="body2">
                                Crear cuenta
                            </Link>
                        </div>
                    </Grid>
                    {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}

                    {/* <Copyright sx={{ mt: 5 }} /> */}
                    </Box>
                </Grid>
            </Grid>
        </div>
    )
}

export default Login;