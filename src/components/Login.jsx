import { Formik, Form } from "formik";
import { Avatar, Box, Button, CssBaseline, Grid, Paper, Typography } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import TextInput from "./TextInput";
import { loginBack } from "../services/auth.service";
import Notification from "./Notification";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
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
    const [errorMessage, setErrorMessage] = useState(null);
    const [loading, setLoading] = useState(false);
    const users = useSelector(state => state.users);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleSubmit = async (values) => {
        try {
            setLoading(true);
            const login = await loginBack({email: values.email, password: values.password});
            console.log(login);
            dispatch(addUser(login.user));
            //cookies
            const cookies = new Cookies();
            cookies.set("accessToken", login.accessToken, { path: "/" });
            cookies.set("refreshToken", login.refreshToken, { path: "/" });
            
            setLoading(false);
            navigate("/");
            

        } catch (error) {
            console.log(error.message);
            setErrorMessage("Credenciales erróneas");
            setTimeout(() => {
                setErrorMessage(null);
            }, 5000);
        }
    }
    console.log(users);


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
                >

                    {/* <Typography variant="h2" color={"black"}>
                        Sales Manager
                    </Typography> */}
              
                
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
                    <Grid container>
                        <Grid item xs>
                        <Link to="/recovery-password" variant="body2">
                            Recuperar contraseña
                        </Link>
                        </Grid>
                        <Grid item>
                        <Link to="/sign-up" variant="body2">
                            Crear cuenta
                        </Link>
                        </Grid>
                    </Grid>
                    {loading && (
                        <Loader></Loader>
                    )}
                    {/* <Copyright sx={{ mt: 5 }} /> */}
                    </Box>
                </Grid>
            </Grid>
        </div>
    )
}

export default Login;