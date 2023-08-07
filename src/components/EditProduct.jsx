import { Formik, Form } from "formik";
import TextInput from "./TextInput";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { updateProduct } from "../features/products/productSlice";
import { patchProductBack } from "../services/products.service";
import { submitImage } from "../services/images.service";
import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import Loader from "./Loader";
import { nameTransform } from "../utils/functions";


const validate = (values) => {
    const errors = {};
    if (!values.salePriceKilo) {
        errors.salePriceKilo = "Requerido";
    } else if (values.salePriceKilo <= 0) {
        errors.salePriceKilo = "El valor debe ser positivo";
    } else if (!Number.isInteger(values.salePriceKilo)) {
        errors.salePriceKilo = "El valor debe ser un número entero";
    }

    return errors;
}


const EditProduct = () => {
    const [product, setProduct] = useLocalStorage("product","");
    const dispatch = useDispatch();
    const products = useSelector(state => state.products);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    
    const navigate = useNavigate();
    const { productId = "" } = useParams();


    const handleSubmit = async (values) => {
        setLoading(true);
        let errorOCurred = false;
        try {
            let imgs = [];
            if (values.file) {
                const img = await submitImage(values.file);
                imgs.push(img.url);
            }
            const resp = await patchProductBack(productId, {salePriceKilo:values.salePriceKilo, urls:imgs});
            dispatch(updateProduct(resp));
            setProduct(resp)

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

    useEffect(() => {

        if (products.length != 0) { //Evalúa la presencia de datos 
            setProduct(products.find(p => p.id == productId));
        }
    }, [productId, products]);

    const closeErrorModal = () => { //Cierra el modal en caso de dar click en el botón de cerrar
        setLoading(false);
        setErrorMessage("");
    }

    return (
        <>
            {product.id == productId && (
                <div style={{display: "grid", placeItems: "center", height: "90vh"}}>
                    <Card sx={{ maxWidth: 345 }}>
                        <CardMedia 
                            component="img"
                            alt={product.name}
                            style={{ maxHeight: "220px" }}
                            image={product.images.length === 0 ? "http://res.cloudinary.com/dmevmh3ch/image/upload/v1685639993/m90r4s6zt6ooxb5jovpl.png" : product.images[0].url}
                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                {nameTransform(product.name)}
                            </Typography>
                            <Formik 
                                initialValues={{salePriceKilo: product.salePriceKilo, file:""}} 
                                validate={validate} 
                                onSubmit={handleSubmit}
                            >
                                {(formProps) => (
                                    <Form>
                                        <TextInput name="salePriceKilo" label="Precio por kilo" adornment="$" type="number" />
                                        <br />
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
                                        <input id="image" name="file" type="file" accept=".jpg, .png" onChange= {(e) => {
                                            formProps.setFieldValue("file", e.target.files[0]);
                                            const fileName = document.getElementById("file-name");
                                            fileName.textContent = e.target.files[0].name
;                                        }} style={{ display: "none" }}/>
                                        <span id="file-name" style={{ marginLeft: "10px" }}></span>       
                                        <br />
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
            )}
            {product.id == undefined && products.length === 0 ? alert("Se produjo un error al guardar los datos.") : null}
        </>
    )
}

export default EditProduct;

