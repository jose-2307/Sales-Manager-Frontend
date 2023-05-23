import { Formik, Form } from "formik";
import TextInput from "./TextInput";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { updateProduct } from "../features/products/productSlice";
import { postPurchaseBack } from "../services/products.service";
import { Card, CardMedia, CardContent, Typography, Button } from "@mui/material";

const userId = 1;

const validate = (values) => {
    const errors = {};

    if (!values.weight) {
        errors.weight = "Requerido";
    } else if (values.weight <= 0) {
        errors.weight = "El valor debe ser positivo";
    }

    if (!values.purchasePriceKilo) {
        errors.purchasePriceKilo = "Requerido";
    } else if (values.purchasePriceKilo <= 0) {
        errors.purchasePriceKilo = "El valor debe ser positivo";
    }

    if (!values.purchaseDate) {
        errors.purchaseDate = "Requerido";
    } else if (new Date(values.purchaseDate) <= new Date("01-01-2022")) {
        errors.purchaseDate = "La fecha debe ser mayor";
    }


    return errors;
}


const EditProduct = () => {
    const [product, setProduct] = useLocalStorage("product","");
    const dispatch = useDispatch();
    const products = useSelector(state => state.products);
    
    const navigate = useNavigate();
    const { productId = ""} = useParams();


    const handleSubmit = async (values) => {
        // const data = new FormData();

        // if (values.salePriceKilo) {
        //     data.append("salePriceKilo", values.salePriceKilo);
        // }

        const resp = await postPurchaseBack(userId, productId, {purchaseDate:values.purchaseDate, weight:values.weight, purchasePriceKilo:values.purchasePriceKilo});        dispatch(updateProduct(resp));
        // setProduct(resp)

        navigate(-1); //Para volver a la página anterior
    }

    useEffect(() => {

        if (products.length != 0) { //Evalúa la presencia de datos 
            setProduct(products.find(p => p.id == productId));
        }
    }, [productId, products]);


    return (
        <>
            {product.id == productId && (
                <div style={{display: "grid", placeItems: "center"}}>
                    <Card sx={{ maxWidth: 345 }}>
                        <CardMedia 
                            component="img"
                            alt={product.name}
                            height="140"
                            image={product.images.length === 0 ? "../../categories/frutos-secos.jpg" : product.images[0].url}

                        />
                        <CardContent>
                            <Typography gutterBottom variant="h5" component="div">
                                Suministro de {product.name[0].toUpperCase().concat(product.name.slice(1))}
                            </Typography>
                            <Formik 
                                initialValues={{weight: "", purchasePriceKilo: "", purchaseDate: ""}} 
                                validate={validate} 
                                onSubmit={handleSubmit}
                            >
                                <Form>
                                    <TextInput name="weight" label="Cantidad en gramos" adornment="g" type="number"  />
                                    <br/>
                                    <TextInput name="purchasePriceKilo" label="Precio por kilo" adornment="$"  type="number" />
                                    <br/>
                                    <TextInput name="purchaseDate" label="Fecha de compra" adornment=" " type="date" />
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
            {product.id == undefined && products.length === 0 ? alert("Se produjo un error al guardar los datos.") : null}
        </>
    )
}

export default EditProduct;

