const validate = (values) => {
    const errors = {};

    if (!values.salePriceKilo) {
        errors.salePriceKilo = "Requerido";
    } else if (values.salePriceKilo <= 0) {
        errors.salePriceKilo = "El valor debe ser positivo";
    }

    return errors;
}

const CreateProduct = () => {
    return (

    )
}

export default CreateProduct;