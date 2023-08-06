import { Formik, Form } from "formik";
import TextInput from "./TextInput";
import { useNavigate, useParams } from "react-router-dom";
import { postProductBack } from "../services/products.service";
import { submitImage } from "../services/images.service";
import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { useState } from "react";
import Loader from "./Loader";



const validate = (values) => {
    const errors = {};

    if (!values.name) {
        errors.name = "Requerido";
    } else if (values.name.length < 3) {
        errors.name = "El nombre debe tener al menos 3 caracteres";
    } else if (values.name.length > 30) {
        errors.name = "El nombre debe tener a lo más 30 caracteres";
    }

    if (!values.salePriceKilo) {
        errors.salePriceKilo = "Requerido";
    } else if (values.purchasePriceKilo <= 0) {
        errors.salePriceKilo = "El valor debe ser positivo";
    } else if (!Number.isInteger(values.salePriceKilo)) {
        errors.salePriceKilo = "El valor debe ser un número entero";
    }


    return errors;
}


const CreateProduct = () => {
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const navigate = useNavigate();
    const { id = ""} = useParams();


    const handleSubmit = async (values) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            const urls = [];
            if (values.file) {
                const img = await submitImage(values.file);
                urls.push(img.url);
            }

            await postProductBack(id, {name: values.name, salePriceKilo: values.salePriceKilo, urls });        
            
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
            <div style={{display: "grid", placeItems: "center"}}>
                <Card sx={{ maxWidth: 345 }}>
                    <CardMedia 
                        component="img"
                        // alt={product.name}
                        height="140"
                        // image={product.images[0]}
                        image="../../../categories/frutos-secos.jpg"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            Crear nuevo producto
                        </Typography>
                        <Formik 
                            initialValues={{name: "", salePriceKilo: "", file: ""}} 
                            validate={validate} 
                            onSubmit={handleSubmit}
                        >
                            {(formProps) => (
                                <Form>
                                    <TextInput name="name" label="Nombre" adornment=" " type="text"  />
                                    <TextInput name="salePriceKilo" label="Precio por kilo" adornment="$"  type="number" />
                                    <br></br>
                                    <label 
                                        htmlFor="image" 
                                        style={{ 
                                            display: "inline-block", 
                                            padding: "10px 20px", 
                                            border: "1px solid #ccc", 
                                            borderRadius: "4px", 
                                            backgroundColor: "#eee", 
                                            cursor: "pointer",
                                        }}
                                    >Seleccionar imagen</label>
                                    <input id="image" name="file" type="file" accept=".jpg, .png, .jpeg" onChange= {(e) => {
                                            formProps.setFieldValue("file", e.target.files[0]);
                                            const fileName = document.getElementById("file-name");
                                            fileName.textContent = e.target.files[0].name
;                                        }} style={{ display: "none" }}/>
                                        <span id="file-name" style={{ marginLeft: "10px" }}></span>
                                    <br/>
                                    <br/>

                                    <Button type="submit" variant="outlined" 
                                        >Guardar
                                    </Button>
                                </Form>
                            )}
                        </Formik>
                    </CardContent> 
                </Card>
                {loading && (<Loader error={errorMessage} closeErrorModal={closeErrorModal}></Loader>)}


            </div>
        </>
    )
}

export default CreateProduct;

