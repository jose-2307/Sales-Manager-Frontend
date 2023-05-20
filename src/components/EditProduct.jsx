import { Formik, Form } from "formik";
import TextInput from "./TextInput";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { updateProduct } from "../features/products/productSlice";
import { patchProduct } from "../services/products.service";
import { submitImage } from "../services/images.service";

const validate = (values) => {
    const errors = {};

    if (!values.salePriceKilo) {
        errors.salePriceKilo = "Requerido";
    } else if (values.salePriceKilo <= 0) {
        errors.salePriceKilo = "El valor debe ser positivo";
    }

    return errors;
}


const EditProduct = () => {
    const [product, setProduct] = useLocalStorage("product","");
    const dispatch = useDispatch();
    const products = useSelector(state => state.products);
    
    const navigate = useNavigate();
    const { productId = "" } = useParams();

    const handleSubmit = async (values) => {
        const data = new FormData();
        let imgs = [];
        if (values.file) {
            const img = await submitImage(values.file);
            imgs.push(img);
            data.append("urls", values.file);
        }
        
        if (values.salePriceKilo) {
            data.append("salePriceKilo", values.salePriceKilo);
        }
        const resp = await patchProduct(productId, {salePriceKilo:values.salePriceKilo, urls:imgs});
        dispatch(updateProduct(resp));

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
                <>
                    <p>{product.name[0].toUpperCase().concat(product.name.slice(1))}</p>
                    <Formik 
                        initialValues={{salePriceKilo: product.salePriceKilo, file:""}} 
                        validate={validate} 
                        onSubmit={handleSubmit}
                    >
                        {(formProps) => (
                            <Form>
                                <TextInput name="salePriceKilo" label="Precio por kilo: " type="number" />
                                <label>Imagen: </label>
                                <input name="file" type="file" accept=".jpg, .png" onChange= {(e) => {
                                    formProps.setFieldValue("file", e.target.files[0])
                                }} />
                                
                                <br />
                                <button type="submit">Guardar</button>
                            </Form>
                        )}
                    </Formik>
                </>
            )}
            {product.id == undefined && products.length === 0 ? alert("Se produjo un error al guardar los datos.") : null}
        </>
    )
}

export default EditProduct;

